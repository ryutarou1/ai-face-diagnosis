import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "マッチングアプリ写真 辛口診断メーカー",
  description: "あなたのマッチングアプリ写真をガチ採点！表情、照明、背景、服装まで細かくダメ出し。改善ポイントも教えます。",
  keywords: ["マッチングアプリ", "写真診断", "辛口", "プロフィール写真", "Tinder", "Pairs", "モテ写真"],
  openGraph: {
    title: "マッチングアプリ写真 辛口診断メーカー",
    description: "あなたのマッチングアプリ写真をガチ採点！表情、照明、背景、服装まで細かくダメ出し。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "マッチングアプリ写真 辛口診断メーカー",
    description: "あなたのマッチングアプリ写真をガチ採点！表情、照明、背景、服装まで細かくダメ出し。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
