import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Next Note | The Best Workflow for Developers",
  description: "A premium note-taking system for Next.js, React, and Web Dev stacks. Inspired by Linear and Notion.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="h-full bg-bg-dark text-foreground flex overflow-hidden">
        <Sidebar aria-label="Sidebar Navigation" />
        <main className="flex-1 overflow-y-auto subtle-scroll relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-8 py-12 min-h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
