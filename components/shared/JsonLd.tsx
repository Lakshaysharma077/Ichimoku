import React from "react";

export interface JsonLdProps {
  type?: "Organization" | "SoftwareApplication" | "FAQPage" | "Article" | "BreadcrumbList";
  data?: any;
}

export default function JsonLd({ type = "Organization", data }: JsonLdProps) {
  let schemaData: any = null;

  if (type === "Organization") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Ichimoku Edge",
      url: "https://ichimokuedge.com",
      logo: "https://ichimokuedge.com/logo_final.png",
      description: "Professional Trading Tools built on the Samurai Vision philosophy. Institutional-grade Ichimoku Kinko Hyo indicators for TradingView.",
      sameAs: [
        "https://www.tradingview.com/u/IchimokuEdge/",
        "https://www.youtube.com/@IchimokuEdge",
        "https://x.com/IchimokuEdge",
      ],
    };
  } else if (type === "SoftwareApplication") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Ichimoku Edge Pro Indicator Suite",
      operatingSystem: "TradingView Pine Script v5",
      applicationCategory: "FinanceApplication",
      ratingValue: "4.9",
      ratingCount: "1200",
      offers: {
        "@type": "Offer",
        price: "29.00",
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
      },
    };
  } else if (type === "FAQPage") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data || [
        {
          "@type": "Question",
          name: "How do I access invite-only scripts on TradingView?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Once your payment is approved, your TradingView username will be granted access. Open any TradingView chart, click Indicators, and select Invite-Only Scripts.",
          },
        },
      ],
    };
  } else if (type === "BreadcrumbList") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data || [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ichimokuedge.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: "https://ichimokuedge.com/tools",
        },
      ],
    };
  } else if (type === "Article") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data?.title || "Mastering Ichimoku Equilibrium",
      author: {
        "@type": "Organization",
        name: "Ichimoku Edge",
      },
      publisher: {
        "@type": "Organization",
        name: "Ichimoku Edge",
        logo: {
          "@type": "ImageObject",
          url: "https://ichimokuedge.com/logo_final.png",
        },
      },
      datePublished: "2026-01-01",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
