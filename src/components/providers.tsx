"use client";

import { AuthProvider } from "./auth-provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextThemesProvider>
  );
}
