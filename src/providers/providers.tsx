"use client";

import {ReactNode} from "react";
import {ThemeProvider} from "./theme-provider";
import {AuthProvider} from "./auth-provider";
import {Toaster} from "sonner";

export function Providers({children}: {children: ReactNode}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <Toaster />

      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
