"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AppStoreProvider } from "@/lib/store";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function Providers({ children }: { children: ReactNode }) {
  if (!publishableKey) {
    // Fail visibly in dev so missing env is obvious; avoid silent missing context.
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. Clerk auth will not work."
      );
    }
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/"
    >
      <ThemeProvider>
        <AppStoreProvider>{children}</AppStoreProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
