"use client";

import {ReactNode} from "react";
import {ThemeProvider} from "./theme-provider";
import {User} from "@/models/user";
import {AuthProvider} from "./auth-provider";
import {Toaster} from "sonner";

export function Providers({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <Toaster />

      <AuthProvider user={user}>{children}</AuthProvider>
    </ThemeProvider>
  );
}
