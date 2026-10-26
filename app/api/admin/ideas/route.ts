import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { staticContent } from "@/lib/content";

export const dynamic = "force-dynamic";

// Helper to fetch current ideas data from DB or fallback to staticContent
async function getIdeasData() {
  const content = await prisma.contentSection.findUnique({
    where: { key: "ideas" },
  });

  if (content) {
    try {
      return JSON.parse(content.value);
    } catch {
      return staticContent.ideas;
    }
  }

  return staticContent.ideas;
}

// Helper to save ideas data to DB and revalidate
async function saveIdeasData(data: any) {
  const content = await prisma.contentSection.upsert({
    where: { key: "ideas" },
    update: { value: JSON.stringify(data) },
    create: { key: "ideas", value: JSON.stringify(data) },
  });

  revalidatePath("/ideas");
  revalidatePath("/");

  return JSON.parse(content.value);
}

// GET: Fetch all ideas
export async function GET(req: NextRequest) {
  try {
    const data = await getIdeasData();
    const response = NextResponse.json(data);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error) {
    console.error("GET_IDEAS_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}

// POST: Add new idea
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, image, url, ticker, company, timeframe, date, editorPick, wordCount, content, slug, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!image || !image.trim()) {
      return NextResponse.json({ error: "Screenshot/Image is required" }, { status: 400 });
    }

    const cleanTitle = title.trim();
    const articleSlug = (slug && slug.trim())
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")
      : cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const newId = `idea-${Date.now()}`;
    const pubDate = date && date.trim() ? date.trim() : new Date().toISOString().split("T")[0];

    // Calculate word count from content if provided
    let calculatedWordCount = wordCount ? Number(wordCount) : undefined;
    if (content && typeof content === "string" && content.trim()) {
      const textOnly = content.replace(/<[^>]*>/g, '').trim();
      calculatedWordCount = textOnly.split(/\s+/).filter(Boolean).length;
    }

    const newArticle = {
      id: newId,
      ticker: ticker ? ticker.trim().toUpperCase() : undefined,
      timeframe: timeframe ? timeframe.trim() : undefined,
      company: company ? company.trim() : undefined,
      title: cleanTitle,
      date: pubDate,
      image: image.trim(),
      url: url && url.trim() ? url.trim() : undefined,
      editorPick: Boolean(editorPick),
      wordCount: calculatedWordCount,
      slug: articleSlug,
      content: content && typeof content === "string" ? content : "",
      status: status && status.trim() ? status.trim() : "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentData = await getIdeasData();
    const currentArticles = Array.isArray(currentData.articles) ? currentData.articles : [];

    // Check for slug uniqueness
    const slugExists = currentArticles.some((a: any) => a.slug === articleSlug);
    if (slugExists) {
      // Append timestamp to ensure uniqueness
      newArticle.slug = `${articleSlug}-${Date.now()}`;
    }

    // Prepend new article and sort newest first by date
    const updatedArticles = [newArticle, ...currentArticles].sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });

    const updatedData = {
      ...currentData,
      articles: updatedArticles,
    };

    const saved = await saveIdeasData(updatedData);

    // Revalidate the new article page
    revalidatePath(`/ideas/${newArticle.slug}`);

    return NextResponse.json({
      success: true,
      message: "Idea published successfully",
      article: newArticle,
      data: saved,
    });
  } catch (error: any) {
    console.error("POST_IDEA_ERROR:", error);
    return NextResponse.json({ error: error?.message || "Failed to publish idea" }, { status: 500 });
  }
}

// PUT / PATCH: Update existing idea
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, image, url, ticker, company, timeframe, date, editorPick, wordCount, content, slug, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Idea ID is required for update" }, { status: 400 });
    }

    const currentData = await getIdeasData();
    const currentArticles = Array.isArray(currentData.articles) ? currentData.articles : [];

    const existingIndex = currentArticles.findIndex((a: any) => a.id === id);
    if (existingIndex === -1) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const existing = currentArticles[existingIndex];

    let calculatedWordCount = wordCount !== undefined ? Number(wordCount) : existing.wordCount;
    if (content && typeof content === "string" && content.trim()) {
      const textOnly = content.replace(/<[^>]*>/g, '').trim();
      calculatedWordCount = textOnly.split(/\s+/).filter(Boolean).length;
    }

    // Process slug
    let newSlug = existing.slug;
    if (slug !== undefined) {
      newSlug = slug.trim()
        ? slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")
        : existing.slug;
    } else if (!existing.slug && title) {
      // Auto-generate slug if article doesn't have one yet
      newSlug = (title.trim() || existing.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const updatedArticle = {
      ...existing,
      ...(title !== undefined && { title: title.trim() }),
      ...(image !== undefined && { image: image.trim() }),
      ...(url !== undefined && { url: url.trim() ? url.trim() : undefined }),
      ...(ticker !== undefined && { ticker: ticker.trim() ? ticker.trim().toUpperCase() : undefined }),
      ...(company !== undefined && { company: company.trim() ? company.trim() : undefined }),
      ...(timeframe !== undefined && { timeframe: timeframe.trim() ? timeframe.trim() : undefined }),
      ...(date !== undefined && { date: date.trim() }),
      ...(editorPick !== undefined && { editorPick: Boolean(editorPick) }),
      ...(calculatedWordCount !== undefined && { wordCount: calculatedWordCount }),
      ...(content !== undefined && { content: content }),
      ...(status !== undefined && { status: status.trim() ? status.trim() : "published" }),
      slug: newSlug,
      updatedAt: new Date().toISOString(),
    };

    currentArticles[existingIndex] = updatedArticle;

    // Keep sorted newest first by date
    currentArticles.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });

    const updatedData = {
      ...currentData,
      articles: currentArticles,
    };

    const saved = await saveIdeasData(updatedData);

    // Revalidate article pages
    if (existing.slug) revalidatePath(`/ideas/${existing.slug}`);
    if (newSlug && newSlug !== existing.slug) revalidatePath(`/ideas/${newSlug}`);

    return NextResponse.json({
      success: true,
      message: "Idea updated successfully",
      article: updatedArticle,
      data: saved,
    });
  } catch (error: any) {
    console.error("PUT_IDEA_ERROR:", error);
    return NextResponse.json({ error: error?.message || "Failed to update idea" }, { status: 500 });
  }
}

// DELETE: Remove an idea
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Idea ID is required" }, { status: 400 });
    }

    const currentData = await getIdeasData();
    const currentArticles = Array.isArray(currentData.articles) ? currentData.articles : [];

    const articleToDelete = currentArticles.find((a: any) => a.id === id);
    const updatedArticles = currentArticles.filter((a: any) => a.id !== id);

    if (updatedArticles.length === currentArticles.length) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const updatedData = {
      ...currentData,
      articles: updatedArticles,
    };

    const saved = await saveIdeasData(updatedData);

    // Revalidate the deleted article's page
    if (articleToDelete?.slug) {
      revalidatePath(`/ideas/${articleToDelete.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: "Idea deleted successfully",
      data: saved,
    });
  } catch (error: any) {
    console.error("DELETE_IDEA_ERROR:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete idea" }, { status: 500 });
  }
}
