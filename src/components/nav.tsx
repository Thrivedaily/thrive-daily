"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import {
  BookOpen,
  Crosshair,
  FlaskConical,
  HeartPulse,
  Home,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  Target,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/lib/store";

function SyncHint({ className }: { className?: string }) {
  const { syncStatus } = useAppStore();
  const label =
    syncStatus === "loading"
      ? "Syncing…"
      : syncStatus === "saving"
        ? "Saving…"
        : syncStatus === "synced"
          ? "Cloud sync on"
          : syncStatus === "error"
            ? "Cloud sync offline"
            : "Local only";

  return (
    <p
      className={cn(
        "truncate text-[10px] leading-tight",
        syncStatus === "error"
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground/80",
        className
      )}
    >
      {label}
    </p>
  );
}

function ClerkUserButton() {
  return (
    <UserButton
      afterSignOutUrl="/"
      showName={false}
      appearance={{
        elements: {
          avatarBox: "h-9 w-9",
          userButtonPopoverCard: "shadow-lg",
          userButtonPopoverActionButton__signOut:
            "text-red-600 dark:text-red-400 font-semibold",
        },
      }}
    >
      {/* Ensures Manage account + Sign out are available in the popover */}
      <UserButton.MenuItems>
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );
}

/** Compact sign-out — sits below Profile, smaller than main nav items */
function SignOutNavButton({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <SignOutButton redirectUrl="/">
      <button
        type="button"
        onClick={() => onNavigate?.()}
        className={cn(
          "mt-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
          "text-muted-foreground hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
        )}
      >
        <LogOut className="h-3.5 w-3.5 shrink-0 opacity-80" />
        Sign Out
      </button>
    </SignOutButton>
  );
}

/** Auth block styled like nav items — under Coaching on desktop + mobile menu */
function NavAuthSection({
  onNavigate,
  dense = false,
}: {
  onNavigate?: () => void;
  dense?: boolean;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const profileActive = pathname.startsWith("/profile");

  if (!isLoaded) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/60 bg-muted/30",
          dense ? "h-12" : "h-14"
        )}
        aria-hidden
      />
    );
  }

  if (isSignedIn) {
    const name =
      user?.fullName ||
      user?.firstName ||
      user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "Your profile";
    const email = user?.primaryEmailAddress?.emailAddress;

    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border px-2.5 py-2 transition",
          profileActive
            ? "border-teal-500/30 bg-teal-500/15"
            : "border-border/70 bg-background/50 hover:bg-muted/60"
        )}
      >
        <ClerkUserButton />
        <Link
          href="/profile"
          onClick={onNavigate}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className={cn(
              "truncate text-sm font-medium",
              profileActive
                ? "text-teal-700 dark:text-teal-300"
                : "text-foreground"
            )}
          >
            {name}
          </p>
          {email ? (
            <p className="truncate text-[10px] text-muted-foreground">
              {email}
            </p>
          ) : (
            <SyncHint />
          )}
          {email ? <SyncHint className="mt-0.5" /> : null}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <SignInButton mode="modal">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            dense && "py-3 text-foreground"
          )}
        >
          <LogIn className="h-4 w-4 shrink-0" />
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            "bg-gradient-to-r from-teal-500/15 to-emerald-500/10 text-teal-800 hover:from-teal-500/25 hover:to-emerald-500/20 dark:text-teal-200",
            dense && "py-3"
          )}
        >
          <UserPlus className="h-4 w-4 shrink-0" />
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocols", icon: Target },
  { href: "/virtues", label: "Virtues", icon: BookOpen },
  { href: "/goals", label: "Daily Touchstones", icon: Crosshair },
  { href: "/habits", label: "Healthy Habits", icon: HeartPulse },
  { href: "/science", label: "Science", icon: FlaskConical },
  { href: "/coaching", label: "Coaching", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: UserRound },
];

/** Primary items before the auth block (auth sits under Coaching) */
const NAV_BEFORE_AUTH = NAV.filter((item) => item.href !== "/profile");
const NAV_PROFILE = NAV.find((item) => item.href === "/profile")!;

const MOBILE_PRIMARY = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocols", icon: Target },
  { href: "/virtues", label: "Virtues", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/coaching", label: "Coaching", icon: Sparkles },
];

function NavLinks({
  items,
  pathname,
  onNavigate,
  dense = false,
}: {
  items: typeof NAV;
  pathname: string;
  onNavigate?: () => void;
  dense?: boolean;
}) {
  return (
    <>
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
              dense ? "py-3" : "py-2.5",
              active
                ? "bg-teal-500/15 text-teal-700 dark:text-teal-300"
                : dense
                  ? "text-foreground hover:bg-muted"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

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
          <p className="text-xs text-muted-foreground">
            Protocols · Virtues · Growth
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        <NavLinks items={NAV_BEFORE_AUTH} pathname={pathname} />

        {/* Account — directly under Coaching */}
        <div className="my-2 border-t border-border pt-3">
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Account
          </p>
          <NavAuthSection />
        </div>

        <NavLinks items={[NAV_PROFILE]} pathname={pathname} />
        {isLoaded && isSignedIn ? <SignOutNavButton /> : null}
      </nav>

      <div className="mt-4 flex items-center justify-between border-t border-border px-2 pt-4">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

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
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
              <NavLinks
                items={NAV_BEFORE_AUTH}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
                dense
              />

              <div className="my-2 border-t border-border pt-3">
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Account
                </p>
                <NavAuthSection
                  dense
                  onNavigate={() => setOpen(false)}
                />
              </div>

              <NavLinks
                items={[NAV_PROFILE]}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
                dense
              />
              {isLoaded && isSignedIn ? (
                <SignOutNavButton onNavigate={() => setOpen(false)} />
              ) : null}
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
