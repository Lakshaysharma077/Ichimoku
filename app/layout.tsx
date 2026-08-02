import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import PageTransition from "@/components/providers/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/shared/CookieConsent";
import { Providers } from "./providers";
import AdminVisualToolbar from "@/components/admin/AdminVisualToolbar";
import CompleteProfileModal from "@/components/shared/CompleteProfileModal";
import KanjiBackground from "@/components/shared/KanjiBackground";
import JsonLd from "@/components/shared/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const shippori = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-shippori",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["Courier New", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ichimokuedge.com"),
  title: {
    default: "Ichimoku Edge | Master the Kumo Cloud",
    template: "%s | Ichimoku Edge",
  },
  description: "Professional Trading Tools built on the Samurai Vision philosophy. Institutional-grade Ichimoku Kinko Hyo indicators for TradingView.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ichimoku Edge | Professional Trading Tools",
    description: "Master the market with our premium indicator suite based on the Ichimoku Kinko Hyo system.",
    url: "https://ichimokuedge.com",
    siteName: "Ichimoku Edge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ichimoku Edge Indicator Suite",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ichimoku Edge | Professional Trading Tools",
    description: "Master the market with our premium indicator suite.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${shippori.variable} ${jetbrains.variable} font-sans antialiased`}>
        <JsonLd type="Organization" />
        <JsonLd type="SoftwareApplication" />
        <Providers>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
            <CookieConsent />
            <AdminVisualToolbar />
            <CompleteProfileModal />
            <KanjiBackground />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
