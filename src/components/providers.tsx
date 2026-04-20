"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AuthProvider } from "./auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <HeroUIProvider>{children}</HeroUIProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
