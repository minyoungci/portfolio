import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import Navigation from "@/components/Navigation";
import RevealObserver from "@/components/RevealObserver";
import GlassPointer from "@/components/GlassPointer";
import { getHomeSections } from "@/lib/sections";
import { siteUrl } from "@/lib/site";
import { profile } from "@/data/profile";
import "./globals.css";

// One sans for everything: Inter for Latin, Noto Sans KR for Hangul. Both self-hosted by next/font
// (no render-blocking external stylesheet). Noto Sans KR ships as unicode-range slices, so only the
// glyph ranges a page uses are downloaded.
// Variable fonts: one file per script (Inter) / per slice (Noto Sans KR) instead of one per weight,
// which keeps the generated @font-face CSS small.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

const description = profile.identityEn || profile.identity;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.tagline}`,
    template: `%s — ${profile.name}`,
  },
  description,
  openGraph: {
    title: `${profile.name} — ${profile.tagline}`,
    description,
    siteName: profile.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKr.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <Navigation sections={getHomeSections()} />
        <RevealObserver />
        <GlassPointer />
        {children}
      </body>
    </html>
  );
}
