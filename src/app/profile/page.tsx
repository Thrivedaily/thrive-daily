"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  Award,
  Cloud,
  Flame,
  HardDrive,
  LogOut,
  Medal,
  Target,
  Trophy,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useAppStore, useBadgeMeta } from "@/lib/store";
import { formatPoints } from "@/lib/progress-cloud";
import { THRIVING_THRESHOLD, tierForScore } from "@/lib/scoring";
import { cn } from "@/lib/cn";

type RankInfo = {
  yourRank: number | null;
  yourPoints: number | null;
  totalRanked: number;
};

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { state, hydrated, dailyScore, syncStatus, setUserName } = useAppStore();
  const badges = useBadgeMeta();
  const unlocked = badges.filter((b) => b.unlocked);
  const tier = tierForScore(dailyScore);

  const [rank, setRank] = useState<RankInfo | null>(null);
  const [rankLoading, setRankLoading] = useState(true);

  const loadRank = useCallback(async () => {
    try {
      setRankLoading(true);
      const res = await fetch("/api/leaderboard", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as RankInfo;
      setRank({
        yourRank: data.yourRank ?? null,
        yourPoints: data.yourPoints ?? null,
        totalRanked: data.totalRanked ?? 0,
      });
    } catch {
      setRank(null);
    } finally {
      setRankLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRank();
  }, [loadRank, isSignedIn, state.lifetimePoints, syncStatus]);

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
          Momentum that follows you — points, streaks, and rankings stay with
          your account across devices.
        </p>
      </section>

      {/* Overall ranking — prominent */}
      <Card className="relative overflow-hidden border-teal-500/35 bg-gradient-to-br from-teal-500/15 via-card to-emerald-500/10 shadow-glow">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30">
              <Medal className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
                Overall ranking
              </p>
              {rankLoading ? (
                <p className="mt-1 text-lg text-muted-foreground">Loading…</p>
              ) : rank?.yourRank != null ? (
                <>
                  <p className="mt-0.5 text-4xl font-bold tracking-tight tabular-nums text-foreground sm:text-5xl">
                    #{rank.yourRank}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    of {rank.totalRanked} thriver
                    {rank.totalRanked === 1 ? "" : "s"} · ranked by lifetime
                    points
                  </p>
                </>
              ) : isSignedIn ? (
                <>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                    Unranked
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Earn lifetime points by completing protocols to join the
                    board.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                    Sign in to rank
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create an account to save progress and appear on the
                    leaderboard.
                  </p>
                </>
              )}
            </div>
          </div>
          {rank?.yourPoints != null && rank.yourRank != null ? (
            <div className="rounded-2xl border border-teal-500/25 bg-background/60 px-5 py-3 text-center sm:min-w-[8.5rem]">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Board points
              </p>
              <p className="text-2xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
                {formatPoints(rank.yourPoints)}
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-14 w-14",
                    userButtonPopoverActionButton__signOut:
                      "text-red-600 dark:text-red-400 font-semibold",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
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

          {isSignedIn ? (
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </SignOutButton>
          ) : (
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

      <section className="grid gap-3 sm:grid-cols-3">
        <StatTile
          icon={Trophy}
          label="Lifetime points"
          value={formatPoints(state.lifetimePoints)}
          accent="text-teal-600 dark:text-teal-300"
        />
        <StatTile
          icon={Flame}
          label="Current streak"
          value={`${state.streak} day${state.streak === 1 ? "" : "s"}`}
          sub={`Best ${state.bestStreak} · ${state.totalThrivingDays || 0} thriving days total`}
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

      <p className="text-center text-xs text-muted-foreground">
        Thriving day = {THRIVING_THRESHOLD}+ points
      </p>

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
            ? "Your daily scores, lifetime points, streaks, and completed habits sync through your secure Clerk account. Open Thrive Daily on another browser while signed in to pick up where you left off."
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
