"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { Cloud, LogIn } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Shown only when signed out. Full banner is tappable → Clerk Sign In
 * (modal also offers Sign Up).
 */
export function SignInPrompt({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) return null;

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/12 via-emerald-500/8 to-teal-500/10 text-left shadow-sm shadow-teal-500/5 transition hover:border-teal-500/50 hover:from-teal-500/18 hover:via-emerald-500/12 hover:shadow-md hover:shadow-teal-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40",
          compact ? "px-3.5 py-3" : "px-4 py-3.5 sm:px-5 sm:py-4",
          className
        )}
      >
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-teal-500/10 blur-2xl transition group-hover:bg-teal-500/15" />
        <div className="relative flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm shadow-teal-500/25">
            <Cloud className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium leading-snug text-foreground sm:text-[15px]">
              Sign in to save your progress, track lifetime points &amp; streaks,
              and compete on the leaderboard.
            </span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <LogIn className="h-3.5 w-3.5" aria-hidden />
              Sign in or create a free account
              <span
                className="transition group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </span>
          </span>
        </div>
      </button>
    </SignInButton>
  );
}
