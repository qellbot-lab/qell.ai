import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orderly Earn - DeFi Yield Farming",
  description: "Deposit your assets and earn yield automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased text-white min-h-screen`}
      >
        {/* 环境光 - 对角线布局 */}
        <div className="ambient-light-top-left" />
        <div className="ambient-light-bottom-right" />
        <div className="ambient-light-center" />

        {/* 全局噪点纹理 */}
        <div className="bg-noise" />

        {/* Web3 Provider - 提供钱包连接上下文 */}
        <Web3Provider>
          {/* 内容区 */}
          <div className="relative z-10">
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
