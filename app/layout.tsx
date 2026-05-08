import type { Metadata } from "next";
import { Inter, Shippori_Mincho, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import PageTransition from "@/components/providers/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/shared/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const shippori = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-shippori",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ichimoku Edge | Master the Kumo Cloud",
  description: "Professional Trading Tools built on the Samurai Vision philosophy. Institutional-grade Ichimoku Kinko Hyo indicators for TradingView.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${shippori.variable} ${jetbrains.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
