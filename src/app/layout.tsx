import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* ── Fonts ────────────────────────────────────────────────────────────────── */

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: "FastApp — AI Prompt-to-Website Generator",
    template: "%s | FastApp",
  },
  description:
    "Turn a single prompt into a fully-deployed, production-grade website in seconds. Powered by AI.",
  keywords: ["AI website generator", "prompt to website", "FastApp", "no-code"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "FastApp — AI Prompt-to-Website Generator",
    description: "Turn a single prompt into a production-grade website in seconds.",
    siteName: "FastApp",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastApp — AI Prompt-to-Website Generator",
    description: "Turn a single prompt into a production-grade website in seconds.",
  },
};

/* ── Root layout ──────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
