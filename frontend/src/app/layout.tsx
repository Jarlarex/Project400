import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToasterProvider } from "@/components/ToasterProvider";

export const metadata: Metadata = {
  title: "DecentraMarket | Decentralized Marketplace",
  description: "DecentraMarket - A decentralised marketplace built on Ethereum. Buy, sell, and auction items with cryptocurrency, secured by smart contracts and IPFS.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
          <ToasterProvider />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
        {children}
            </main>
            <Footer />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
