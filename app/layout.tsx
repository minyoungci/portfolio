import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Minyoung KIM",
  description: "Medical AI / Futurist — Development Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="bg-white text-black font-sans antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
