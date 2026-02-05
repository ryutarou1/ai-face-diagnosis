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
  title: "AI顔診断 - あなたの顔をAIが徹底分析！",
  description: "顔写真をアップロードするだけで、AIがあなたの顔タイプ、似ている有名人、モテ度を診断！無料で楽しめる顔診断アプリ",
  keywords: ["顔診断", "AI診断", "顔タイプ", "似てる有名人", "モテ度診断"],
  openGraph: {
    title: "AI顔診断 - あなたの顔をAIが徹底分析！",
    description: "顔写真をアップロードするだけで、AIがあなたの顔タイプ、似ている有名人、モテ度を診断！",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI顔診断 - あなたの顔をAIが徹底分析！",
    description: "顔写真をアップロードするだけで、AIがあなたの顔タイプ、似ている有名人、モテ度を診断！",
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
