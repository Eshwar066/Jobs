import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Eshwar — Senior Frontend Engineer | Fintech & AI",
  description:
    "Senior Frontend Engineer with 3+ years experience building scalable fintech platforms at Nuvama Wealth. Expertise in React, TypeScript, real-time systems, and AI/GenAI.",
  keywords: [
    "Senior Frontend Engineer",
    "React",
    "TypeScript",
    "Fintech",
    "WealthTech",
    "Real-time Systems",
    "AI",
    "GenAI",
    "RAG",
    "LLM",
    "Nuvama Wealth",
  ],
  authors: [{ name: "Eshwar" }],
  creator: "Eshwar",
  publisher: "Eshwar",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eshwar.dev",
    title: "Eshwar — Senior Frontend Engineer | Fintech & AI",
    description:
      "Senior Frontend Engineer with 3+ years experience building scalable fintech platforms at Nuvama Wealth. Expertise in React, TypeScript, real-time systems, and AI/GenAI.",
    siteName: "Eshwar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eshwar — Senior Frontend Engineer | Fintech & AI",
    description:
      "Senior Frontend Engineer with 3+ years experience building scalable fintech platforms at Nuvama Wealth.",
    creator: "@eshwar",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          dmSans.variable,
          spaceGrotesk.variable,
          jetbrainsMono.variable,
          "font-sans antialiased"
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

import { cn } from "@/lib/utils";