import type { AppState } from "@/lib/types";
import { todayKey } from "@/lib/dates";

export const STORAGE_KEY = "thrive-daily-v1";

export function defaultState(): AppState {
  return {
    activeDate: todayKey(),
    completedHabits: {},
    lifetimePoints: 0,
    streak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    unlockedBadges: [],
    goals: [],
    touchstoneDoneToday: {},
    healthyHabitChecks: {},
    healthyHabitDoneToday: {},
    userName: "",
    scoreHistory: {},
    virtueNotes: {},
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<AppState> & {
      healthyHabits?: { id: string; completedToday?: boolean }[];
    };
    const base = { ...defaultState(), ...parsed };

    // Migrate legacy healthyHabits array → healthyHabitChecks
    if (!parsed.healthyHabitChecks && Array.isArray(parsed.healthyHabits)) {
      const checks: Record<string, boolean> = {};
      for (const h of parsed.healthyHabits) {
        if (h?.id && h.completedToday) checks[h.id] = true;
      }
      base.healthyHabitChecks = checks;
    }
    if (!base.touchstoneDoneToday) base.touchstoneDoneToday = {};
    if (!base.healthyHabitChecks) base.healthyHabitChecks = {};
    if (!base.healthyHabitDoneToday) base.healthyHabitDoneToday = {};
    // drop legacy field if present
    delete (base as { healthyHabits?: unknown }).healthyHabits;

    return base;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota / private mode — ignore
  }
}
