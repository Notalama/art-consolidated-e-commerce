import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CartStoreProvider } from "@/components/cart-store-provider";
import { Header } from "@/components/header";
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
  title: "Arts Consolidated Store",
  description: "Shop products from Arts Consolidated Store",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <CartStoreProvider>
          <Header />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
            {children}
          </main>
        </CartStoreProvider>
      </body>
    </html>
  );
}
