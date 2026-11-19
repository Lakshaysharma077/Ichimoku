import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { staticContent } from "@/lib/content";
import ArticlePageClient from "./ArticlePageClient";

export const dynamic = "force-dynamic";

// Helper to fetch all ideas data (same pattern as the API route)
async function getIdeasData() {
  try {
    const content = await prisma.contentSection.findUnique({
      where: { key: "ideas" },
    });

    if (content) {
      try {
        const parsed = JSON.parse(content.value);
        if (parsed && Array.isArray(parsed.articles)) {
          // Merge with staticContent to guarantee rich content is never missing
          parsed.articles = parsed.articles.map((dbArticle: any) => {
            const staticMatch = staticContent.ideas.articles.find(
              (sa) => sa.id === dbArticle.id || sa.slug === dbArticle.slug
            );
            if (!dbArticle.content || dbArticle.content.trim().length < 50) {
              if (staticMatch && staticMatch.content) {
                return {
                  ...dbArticle,
                  content: staticMatch.content,
                  wordCount: staticMatch.wordCount || dbArticle.wordCount,
                  bias: staticMatch.bias,
                  primaryResistance: staticMatch.primaryResistance,
                  primarySupport: staticMatch.primarySupport,
                  equilibriumAnchor: staticMatch.equilibriumAnchor,
                };
              }
            }
            if (staticMatch) {
              return {
                ...staticMatch,
                ...dbArticle,
                content: dbArticle.content?.trim()?.length >= 50 ? dbArticle.content : staticMatch.content,
                bias: dbArticle.bias || staticMatch.bias,
                primaryResistance: dbArticle.primaryResistance || staticMatch.primaryResistance,
                primarySupport: dbArticle.primarySupport || staticMatch.primarySupport,
                equilibriumAnchor: dbArticle.equilibriumAnchor || staticMatch.equilibriumAnchor,
              };
            }
            return dbArticle;
          });
          return parsed;
        }
      } catch {
        return staticContent.ideas;
      }
    }
  } catch (err) {
    console.warn("DB lookup failed in ideas page, using staticContent fallback", err);
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

  // Fallback: match by id or TradingView URL key
  if (!article) {
    article = articles.find((a: any) => {
      if (a.id && a.id.toLowerCase() === slug.toLowerCase()) return true;
      if (a.url && a.url.toLowerCase().includes(slug.toLowerCase())) return true;
      return false;
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
  const data = await getIdeasData();
  const articles: any[] = Array.isArray(data.articles) ? data.articles : [];

  let currentIndex = articles.findIndex((a: any) => a.slug === params.slug);
  if (currentIndex === -1) {
    currentIndex = articles.findIndex((a: any) => {
      const generatedSlug = (a.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return generatedSlug === params.slug;
    });
  }

  if (currentIndex === -1) {
    currentIndex = articles.findIndex((a: any) => {
      if (a.id && a.id.toLowerCase() === params.slug.toLowerCase()) return true;
      if (a.url && a.url.toLowerCase().includes(params.slug.toLowerCase())) return true;
      return false;
    });
  }

  if (currentIndex === -1) {
    notFound();
  }

  const article = articles[currentIndex];
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  // Filter 3 related articles (excluding current)
  const relatedArticles = articles
    .filter((_: any, idx: number) => idx !== currentIndex)
    .slice(0, 3);

  return (
    <ArticlePageClient
      article={article}
      slug={params.slug}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
      relatedArticles={relatedArticles}
    />
  );
}
