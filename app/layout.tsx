import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import { getHomeSections } from "@/lib/sections";
import { profile } from "@/data/profile";
import "./globals.css";

// One sans for everything: Inter for Latin (next/font), Pretendard for Hangul (CDN, fallback in globals.css).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const description = profile.identityEn || profile.identity;

// 커스텀 도메인 연결 후 NEXT_PUBLIC_SITE_URL로 고정. 그 전에는 Vercel 프로덕션 URL을 쓴다.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

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
    <html lang="ko" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        <Navigation sections={getHomeSections()} />
        {children}
      </body>
    </html>
  );
}
