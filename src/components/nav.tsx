"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Crosshair,
  FlaskConical,
  HeartPulse,
  Home,
  Menu,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocols", icon: Target },
  { href: "/virtues", label: "Virtues", icon: BookOpen },
  { href: "/goals", label: "Daily Touchstones", icon: Crosshair },
  { href: "/habits", label: "Healthy Habits", icon: HeartPulse },
  { href: "/science", label: "Science", icon: FlaskConical },
  { href: "/coaching", label: "Coaching", icon: Sparkles },
];

const MOBILE_PRIMARY = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocols", icon: Target },
  { href: "/virtues", label: "Virtues", icon: BookOpen },
  { href: "/goals", label: "Touchstones", icon: Crosshair },
  { href: "/coaching", label: "Coaching", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/80 px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-lg font-bold text-white shadow-md shadow-teal-500/25">
          T
        </div>
        <div>
          <p className="text-base font-bold tracking-tight text-foreground">
            Thrive Daily
          </p>
          <p className="text-xs text-muted-foreground">Protocols · Virtues · Growth</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-teal-500/15 text-teal-700 dark:text-teal-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 flex items-center justify-between px-2">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-bold text-white">
            T
          </div>
          <span className="font-bold tracking-tight">Thrive Daily</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-card p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">Menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                      active
                        ? "bg-teal-500/15 text-teal-700 dark:text-teal-300"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around py-1">
        {MOBILE_PRIMARY.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium",
                active
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-28 lg:max-w-4xl lg:px-8 lg:pb-10">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
