"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Compass, Flame, Sparkles } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useAppStore, useBadgeMeta } from "@/lib/store";
import { formatDisplayDate, greetingForHour } from "@/lib/dates";
import {
  MAX_DAILY_POINTS,
  THRIVING_THRESHOLD,
  tierForScore,
} from "@/lib/scoring";
import { CATEGORIES, HABITS } from "@/data/habits";
import { HEALTHY_HABITS } from "@/data/healthyHabits";
import { getVirtueOfTheDay } from "@/data/virtues";
import { getTouchstoneOfTheDay } from "@/data/touchstones";
import { cn } from "@/lib/cn";
import { DreamSaferText } from "@/components/ui/dreamsafer-text";

/** Ring fills to 100% at the thriving threshold (150), not max daily points */
function thrivingRingPercent(score: number): number {
  return Math.min(100, Math.round((score / THRIVING_THRESHOLD) * 100));
}

export default function HomePage() {
  const {
    state,
    hydrated,
    dailyScore,
    setUserName,
    toggleHabit,
    toggleHealthyHabitDone,
  } = useAppStore();
  const [nameDraft, setNameDraft] = useState("");
  const badges = useBadgeMeta();
  const tier = tierForScore(dailyScore);
  const isThriving = dailyScore >= THRIVING_THRESHOLD;
  const achievedBadges = badges.filter((b) => b.unlocked);
  const virtue = getVirtueOfTheDay();
  const touchstone = getTouchstoneOfTheDay();
  const done = Object.values(state.completedHabits).filter(Boolean).length;

  const focusedHealthyHabits = HEALTHY_HABITS.filter(
    (h) => state.healthyHabitChecks?.[h.id]
  ).sort((a, b) => a.order - b.order);
  const healthyDoneCount = focusedHealthyHabits.filter(
    (h) => state.healthyHabitDoneToday?.[h.id]
  ).length;

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Loading your day…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
          {formatDisplayDate()}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {greetingForHour()}
          {state.userName ? `, ${state.userName}` : ""}
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Build eudaimonia (&ldquo;The Good Life&rdquo;) one protocol at a time.
        </p>
        <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
          Feel better <span className="text-muted-foreground">|</span> Achieve more{" "}
          <span className="text-muted-foreground">|</span> Elevate your routine
        </p>
        {!state.userName && (
          <div className="flex max-w-sm flex-col gap-2 pt-2 sm:flex-row">
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Your name (optional)"
              className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none ring-teal-500/40 focus:ring-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameDraft.trim()) {
                  setUserName(nameDraft.trim());
                }
              }}
            />
            <button
              type="button"
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
              onClick={() => {
                if (nameDraft.trim()) setUserName(nameDraft.trim());
              }}
            >
              Save
            </button>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {/* Daily Score — score + momentum in one place */}
        <Card className="relative overflow-hidden shadow-glow">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl" />
          <CardTitle className="mb-4">Daily Score</CardTitle>
          <div className="flex items-center gap-4">
            <ProgressRing value={thrivingRingPercent(dailyScore)} size={120}>
              <span className="text-2xl font-bold tabular-nums">{dailyScore}</span>
              <span className="text-[10px] text-muted-foreground">
                / {MAX_DAILY_POINTS}
              </span>
            </ProgressRing>
            <div className="min-w-0 space-y-1.5">
              <p className={`text-lg font-semibold ${tier.color}`}>{tier.label}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tier.message}
              </p>
              <p className="text-xs text-muted-foreground">
                Full ring at{" "}
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {THRIVING_THRESHOLD}+
                </span>
                {" · "}
                {done}/{HABITS.length} protocols
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border bg-background/60 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                Streak
              </div>
              <p className="mt-0.5 text-lg font-bold tabular-nums">
                {state.streak}
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  day{state.streak === 1 ? "" : "s"}
                </span>
              </p>
              {state.bestStreak > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Best: {state.bestStreak}
                </p>
              )}
            </div>
            <div className="rounded-xl border border-border bg-background/60 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                Lifetime
              </div>
              <p className="mt-0.5 text-lg font-bold tabular-nums">
                {state.lifetimePoints}
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  pts
                </span>
              </p>
            </div>
          </div>

          {/* Thriving badge when threshold met; other badges only if achieved */}
          {(isThriving || achievedBadges.length > 0) && (
            <div className="mt-3 space-y-2">
              {isThriving && (
                <div className="flex items-center gap-3 rounded-xl border border-teal-500/40 bg-gradient-to-r from-teal-500/15 to-emerald-500/10 px-3 py-2.5">
                  <span className="text-2xl" aria-hidden>
                    🏆
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-teal-800 dark:text-teal-200">
                      Thriving
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {THRIVING_THRESHOLD}+ points — you hit today&apos;s mark
                    </p>
                  </div>
                </div>
              )}
              {achievedBadges.filter((b) => b.id !== "thriving").length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {achievedBadges
                    .filter((b) => b.id !== "thriving")
                    .map((b) => (
                      <span
                        key={b.id}
                        title={b.description}
                        className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[11px] font-medium"
                      >
                        <span aria-hidden>{b.emoji}</span>
                        {b.name}
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Right column: Virtue + Touchstone of the Day */}
        <div className="flex flex-col gap-4">
          <Card className="relative flex flex-col overflow-hidden border-teal-500/25 bg-gradient-to-br from-teal-500/12 via-card to-emerald-500/5">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-teal-500/15 blur-2xl" />
            <div className="relative flex flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600/15 text-teal-700 dark:text-teal-300">
                  <BookOpen className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                  Virtue of the Day
                </p>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{virtue.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                {virtue.description}
              </p>
              <Link
                href="/virtues"
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-xl bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
              >
                Explore all virtues
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>

          <Card className="relative flex flex-col overflow-hidden border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 via-card to-teal-500/5">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/15 blur-2xl" />
            <div className="relative flex flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                  <Compass className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Touchstone of the Day
                </p>
              </div>
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                {touchstone.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {touchstone.description}
              </p>
              <Link
                href="/goals"
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              >
                All touchstones
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Link
        href="/protocols"
        className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-4 text-white shadow-lg shadow-teal-600/25 transition hover:brightness-110"
      >
        <div>
          <p className="text-sm font-medium text-white/80">Ready when you are</p>
          <p className="text-lg font-bold">Start Daily Protocols</p>
        </div>
        <ArrowRight className="h-6 w-6" />
      </Link>

      {/* Compact protocol checklist — quick access from home */}
      <Card className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Today&apos;s protocols</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tap to check off · {done}/{HABITS.length} done · {dailyScore} pts
            </p>
          </div>
          <Link
            href="/protocols"
            className="shrink-0 text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
          >
            Full view →
          </Link>
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const habits = HABITS.filter((h) => h.categoryKey === cat.key).sort(
              (a, b) => a.order - b.order
            );
            if (!habits.length) return null;
            const catDone = habits.filter(
              (h) => state.completedHabits[h.id]
            ).length;
            return (
              <div key={cat.key}>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {cat.emoji} {cat.label}
                  </p>
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {catDone}/{habits.length}
                  </span>
                </div>
                <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {habits.map((habit) => {
                    const checked = !!state.completedHabits[habit.id];
                    return (
                      <li key={habit.id}>
                        <button
                          type="button"
                          onClick={() => toggleHabit(habit.id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition hover:bg-muted/50",
                            checked && "bg-teal-500/5"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                              checked
                                ? "border-teal-500 bg-teal-500 text-white"
                                : "border-muted-foreground/30"
                            )}
                            aria-hidden
                          >
                            {checked && (
                              <Check className="h-3 w-3" strokeWidth={3} />
                            )}
                          </span>
                          <span
                            className={cn(
                              "min-w-0 flex-1 text-sm leading-snug",
                              checked &&
                                "text-muted-foreground line-through decoration-teal-500/40"
                            )}
                          >
                            <DreamSaferText text={habit.name} />
                          </span>
                          <span
                            className={cn(
                              "shrink-0 text-[11px] font-semibold tabular-nums",
                              habit.points >= 20
                                ? "text-red-600 dark:text-red-400"
                                : "text-teal-700 dark:text-teal-300"
                            )}
                          >
                            +{habit.points}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Focused healthy habits — selected on Healthy Habits page, done for today here */}
      <Card className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">My Healthy Habits - Focus Areas</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {focusedHealthyHabits.length === 0
                ? "Select habits to weave into your day"
                : `Part of today’s stack · ${healthyDoneCount}/${focusedHealthyHabits.length} done`}
            </p>
          </div>
          <Link
            href="/habits"
            className="shrink-0 text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
          >
            {focusedHealthyHabits.length === 0 ? "Choose →" : "Edit →"}
          </Link>
        </div>

        {focusedHealthyHabits.length === 0 ? (
          <Link
            href="/habits"
            className="flex items-center justify-between rounded-xl border border-dashed border-teal-500/40 bg-teal-500/5 px-3 py-3 text-sm transition hover:border-teal-500/60"
          >
            <span className="text-muted-foreground">
              Browse the Healthy Habits guide and check ones to focus on
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
          </Link>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {focusedHealthyHabits.map((habit) => {
              const doneToday = !!state.healthyHabitDoneToday?.[habit.id];
              return (
                <li key={habit.id}>
                  <button
                    type="button"
                    onClick={() => toggleHealthyHabitDone(habit.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition hover:bg-muted/50",
                      doneToday && "bg-teal-500/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                        doneToday
                          ? "border-teal-500 bg-teal-500 text-white"
                          : "border-muted-foreground/30"
                      )}
                      aria-hidden
                    >
                      {doneToday && (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-sm leading-snug",
                          doneToday &&
                            "text-muted-foreground line-through decoration-teal-500/40"
                        )}
                      >
                        {habit.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {habit.category}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickLink href="/goals" label="Daily Touchstones" />
        <QuickLink href="/habits" label="Healthy Habits" />
        <QuickLink href="/science" label="Science" />
        <QuickLink href="/coaching" label="Coaching" />
      </section>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card px-3 py-3 text-center text-sm font-medium transition hover:border-teal-500/40 hover:text-teal-700 dark:hover:text-teal-300"
    >
      {label}
    </Link>
  );
}
