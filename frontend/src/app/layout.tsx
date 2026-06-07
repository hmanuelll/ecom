import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatbotBubble } from "@/components/ui/ChatbotBubble";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense } from "react";
import { AuthObserver } from "@/components/AuthObserver";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechStore | Premium Electronics",
  description: "Your one-stop shop for premium computers and electronics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[#FAF9F6] text-gray-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <Suspense fallback={<div className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800" />}>
            <Navbar />
          </Suspense>
          <AuthObserver />
          <main className="min-h-screen flex flex-col">{children}</main>
          <Footer />
          <ChatbotBubble />
        </ThemeProvider>
      </body>
    </html>
  );
}
