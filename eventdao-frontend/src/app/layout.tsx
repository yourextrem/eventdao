import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/wallet.css";
import { WalletContextProvider } from "@/contexts/WalletContextProvider";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "EventDAO - Solana Web3 Events",
  description: "Platform event terdesentralisasi di Solana blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <ErrorBoundary>
          <WalletContextProvider>
            <SupabaseProvider>
              {children}
            </SupabaseProvider>
          </WalletContextProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
