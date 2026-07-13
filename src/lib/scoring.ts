import { HABITS, MAX_DAILY_POINTS } from "@/data/habits";
import type { ScoreTier } from "@/lib/types";

export const THRIVING_THRESHOLD = 150;

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

export function scoreFromCompletions(
  completed: Record<string, boolean>
): number {
  return HABITS.reduce(
    (sum, h) => sum + (completed[h.id] ? h.points : 0),
    0
  );
}

export function tierForScore(score: number): ScoreTier {
  return SCORE_TIERS.find((t) => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1];
}

export function completionPercent(score: number): number {
  if (MAX_DAILY_POINTS <= 0) return 0;
  return Math.min(100, Math.round((score / MAX_DAILY_POINTS) * 100));
}

export { MAX_DAILY_POINTS };
