import { HABITS, MAX_DAILY_POINTS } from "@/data/habits";
import type { AppState, ScoreTier } from "@/lib/types";
import { resolveProtocols } from "@/lib/catalog";

export const THRIVING_THRESHOLD = 150;

/** Points awarded for each Healthy Habit marked done today */
export const HEALTHY_HABIT_POINTS = 20;

export const SCORE_TIERS: ScoreTier[] = [
  {
    min: 200,
    label: "Peak Performance",
    color: "text-emerald-500",
    message: "Exceptional day. You are operating at a high level.",
  },
  {
    min: THRIVING_THRESHOLD,
    label: "Thriving",
    color: "text-teal-500",
    message: "You are thriving. Keep stacking the wins.",
  },
  {
    min: 100,
    label: "Strong Day",
    color: "text-cyan-500",
    message: "Solid foundation. A few more protocols will push you into thriving.",
  },
  {
    min: 50,
    label: "Building",
    color: "text-amber-500",
    message: "Momentum is building. Protect the next keystone habit.",
  },
  {
    min: 1,
    label: "Started",
    color: "text-sky-500",
    message: "You showed up. That is the hardest part.",
  },
  {
    min: 0,
    label: "Ready",
    color: "text-slate-400",
    message: "Your day is a blank canvas. Start with wake-up protocols.",
  },
];

type PointHabit = { id: string; points: number };

/** Daily Protocols points from a resolved habit list (defaults + customs) */
export function scoreFromCompletions(
  completed: Record<string, boolean>,
  protocols?: PointHabit[]
): number {
  const list = protocols ?? HABITS;
  return list.reduce(
    (sum, h) => sum + (completed[h.id] ? h.points : 0),
    0
  );
}

/** Healthy Habits done today — 20 pts each */
export function scoreFromHealthyHabits(
  doneToday: Record<string, boolean> | undefined
): number {
  if (!doneToday) return 0;
  return (
    Object.values(doneToday).filter(Boolean).length * HEALTHY_HABIT_POINTS
  );
}

/** Full daily score: protocols + healthy habits */
export function dailyScoreFromState(
  completedHabits: Record<string, boolean>,
  healthyHabitDoneToday?: Record<string, boolean>,
  catalogState?: Pick<AppState, "customProtocols" | "protocolOrder">
): number {
  const protocols = catalogState
    ? resolveProtocols(catalogState)
    : HABITS;
  return (
    scoreFromCompletions(completedHabits, protocols) +
    scoreFromHealthyHabits(healthyHabitDoneToday)
  );
}

export function maxProtocolPoints(
  catalogState?: Pick<AppState, "customProtocols" | "protocolOrder">
): number {
  if (!catalogState) return MAX_DAILY_POINTS;
  return resolveProtocols(catalogState).reduce((s, h) => s + h.points, 0);
}

export function tierForScore(score: number): ScoreTier {
  return SCORE_TIERS.find((t) => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1];
}

export function completionPercent(score: number): number {
  if (MAX_DAILY_POINTS <= 0) return 0;
  return Math.min(100, Math.round((score / MAX_DAILY_POINTS) * 100));
}

export { MAX_DAILY_POINTS };
