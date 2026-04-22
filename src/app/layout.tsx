import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import CommandPalette from "@/components/CommandPalette";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import PageTransition from "@/components/PageTransition";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Next Note - Premium Developer Notes",
  description: "A fast, keyboard-first note-taking system for modern web developers.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="h-full bg-bg-dark text-foreground flex overflow-hidden selection:bg-brand-primary/30">
        <Providers>
          <Toaster position="bottom-right" theme="dark" closeButton richColors />
          <CommandPalette />
          
          <ClientLayout>
            <PageTransition>
              {children}
            </PageTransition>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
