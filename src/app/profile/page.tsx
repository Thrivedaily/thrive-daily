"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  Award,
  Cloud,
  Flame,
  HardDrive,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useAppStore, useBadgeMeta } from "@/lib/store";
import { formatPoints } from "@/lib/progress-cloud";
import { THRIVING_THRESHOLD, tierForScore } from "@/lib/scoring";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { state, hydrated, dailyScore, levelInfo, syncStatus, setUserName } =
    useAppStore();
  const badges = useBadgeMeta();
  const unlocked = badges.filter((b) => b.unlocked);
  const tier = tierForScore(dailyScore);

  if (!hydrated || !isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  const displayName =
    state.userName ||
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Thriver";

  const email = user?.primaryEmailAddress?.emailAddress;

  const syncLabel =
    syncStatus === "loading"
      ? "Syncing with cloud…"
      : syncStatus === "saving"
        ? "Saving to cloud…"
        : syncStatus === "synced"
          ? "Saved to your Clerk account"
          : syncStatus === "error"
            ? "Cloud unreachable — using local copy"
            : "Stored on this device only";

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
          Your path
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="max-w-xl text-muted-foreground">
          Momentum that follows you — points, streaks, and levels stay with your
          account across devices.
        </p>
      </section>

      <Card className="relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: { avatarBox: "h-14 w-14" },
                }}
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-xl font-bold text-white shadow-md shadow-teal-500/25">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold">{displayName}</p>
              {isSignedIn && email ? (
                <p className="truncate text-sm text-muted-foreground">{email}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Guest on this device
                </p>
              )}
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                {isSignedIn ? (
                  <Cloud className="h-3.5 w-3.5 text-teal-600" />
                ) : (
                  <HardDrive className="h-3.5 w-3.5" />
                )}
                {syncLabel}
              </p>
            </div>
          </div>

          {!isSignedIn && (
            <div className="flex flex-wrap gap-2">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-500/25"
                >
                  Create account
                </button>
              </SignUpButton>
            </div>
          )}
        </div>

        {isSignedIn && (
          <div className="mt-5 border-t border-border pt-4">
            <label className="text-xs font-medium text-muted-foreground">
              Display name in app
            </label>
            <div className="mt-1.5 flex max-w-sm gap-2">
              <input
                type="text"
                defaultValue={state.userName}
                placeholder="How should we greet you?"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-teal-500/40 focus:ring-2"
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== state.userName) setUserName(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value.trim();
                    setUserName(v);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
            </div>
          </div>
        )}
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Trophy}
          label="Lifetime points"
          value={formatPoints(state.lifetimePoints)}
          accent="text-teal-600 dark:text-teal-300"
        />
        <StatTile
          icon={Sparkles}
          label="Level"
          value={`Lv ${levelInfo.level}`}
          sub={`${formatPoints(levelInfo.current)} / ${formatPoints(levelInfo.next)} to next`}
        />
        <StatTile
          icon={Flame}
          label="Current streak"
          value={`${state.streak} day${state.streak === 1 ? "" : "s"}`}
          sub={`Best ${state.bestStreak}`}
        />
        <StatTile
          icon={Target}
          label="Today"
          value={`${dailyScore} pts`}
          sub={
            <span className={cn("font-medium", tier.color)}>{tier.label}</span>
          }
        />
      </section>

      <Card>
        <CardTitle className="mb-1">Level progress</CardTitle>
        <p className="mb-3 text-sm text-muted-foreground">
          Keep stacking protocols — every check compounds.
        </p>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
            style={{ width: `${Math.min(100, levelInfo.progress)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Thriving day = {THRIVING_THRESHOLD}+ points
        </p>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between gap-2">
          <CardTitle className="mb-0 flex items-center gap-2">
            <Award className="h-5 w-5 text-teal-600" />
            Badges
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {unlocked.length} / {badges.length}
          </span>
        </div>
        {unlocked.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Complete protocols to unlock your first badge.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {unlocked.map((b) => (
              <li
                key={b.id}
                className="flex items-start gap-3 rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5"
              >
                <span className="text-xl" aria-hidden>
                  {b.emoji}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{b.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {b.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="bg-gradient-to-br from-teal-500/10 via-card to-emerald-500/5">
        <CardTitle className="mb-2">Cross-device progress</CardTitle>
        <p className="text-sm text-muted-foreground">
          {isSignedIn
            ? "Your daily scores, lifetime points, streaks, completed habits, and levels sync through your secure Clerk account. Open Thrive Daily on another browser while signed in to pick up where you left off."
            : "Sign in to save progress to the cloud. Until then, data stays in this browser’s local storage."}
        </p>
        <div className="mt-4">
          <Link
            href="/protocols"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500"
          >
            Start today’s protocols
          </Link>
        </div>
      </Card>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: ReactNode;
  accent?: string;
}) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className={cn("text-2xl font-bold tabular-nums tracking-tight", accent)}>
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      ) : null}
    </Card>
  );
}
