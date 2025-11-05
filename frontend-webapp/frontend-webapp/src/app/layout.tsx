import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/theme.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CleanNFT - Turning Waste into Digital Impact",
  description: "CleanNFT bridges sustainability and blockchain — rewarding every act of recycling with verifiable, tradable NFTs.",
  keywords: ["NFT", "recycling", "blockchain", "sustainability", "Polygon", "environment"],
  authors: [{ name: "CleanNFT" }],
  openGraph: {
    title: "CleanNFT - Turning Waste into Digital Impact",
    description: "Recycle. Reward. Reimagine Ownership. Turn waste into digital value — powered by CleanNFT.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Header />
          <main className="min-h-screen pt-24 pb-8">{children}</main>
          <Footer />
          <ChatWidget />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
