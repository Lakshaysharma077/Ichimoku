import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { staticContent } from "@/lib/content";
import ArticlePageClient from "./ArticlePageClient";

export const dynamic = "force-dynamic";

// Helper to fetch all ideas data (same pattern as the API route)
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

// Find article by slug
async function getArticleBySlug(slug: string) {
  const data = await getIdeasData();
  const articles = Array.isArray(data.articles) ? data.articles : [];

  // Try exact slug match first
  let article = articles.find((a: any) => a.slug === slug);

  // Fallback: generate slug from title and try matching
  if (!article) {
    article = articles.find((a: any) => {
      const generatedSlug = (a.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return generatedSlug === slug;
    });
  }

  return article || null;
}

// Generate SEO metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const title = article.title || "Market Analysis";
  const description = article.content
    ? article.content.replace(/<[^>]*>/g, "").slice(0, 160).trim() + "..."
    : `${title} — Ichimoku technical analysis by Ichimoku Edge. ${article.company || ""} ${article.timeframe || ""} chart analysis.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/ideas/${params.slug}`,
    },
    openGraph: {
      title: `${title} | Ichimoku Edge`,
      description,
      url: `https://ichimokuedge.com/ideas/${params.slug}`,
      siteName: "Ichimoku Edge",
      type: "article",
      publishedTime: article.date,
      images: article.image
        ? [
            {
              url: article.image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Ichimoku Edge`,
      description,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return <ArticlePageClient article={article} slug={params.slug} />;
}
