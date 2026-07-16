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
    totalThrivingDays: 0,
    lastThrivingDate: null,
    lastActiveDate: null,
    unlockedBadges: [],
    goals: [],
    touchstoneDoneToday: {},
    healthyHabitChecks: {},
    healthyHabitDoneToday: {},
    userName: "",
    scoreHistory: {},
    virtueNotes: {},
    customProtocols: [],
    protocolOrder: [],
    customHealthyHabits: [],
    healthyHabitOrder: [],
    customTouchstones: [],
    touchstoneOrder: [],
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
    base.totalThrivingDays = Number(base.totalThrivingDays) || 0;
    base.lastThrivingDate =
      typeof base.lastThrivingDate === "string" ? base.lastThrivingDate : null;
    base.customProtocols = Array.isArray(base.customProtocols)
      ? base.customProtocols
      : [];
    base.protocolOrder = Array.isArray(base.protocolOrder)
      ? base.protocolOrder
      : [];
    base.customHealthyHabits = Array.isArray(base.customHealthyHabits)
      ? base.customHealthyHabits
      : [];
    base.healthyHabitOrder = Array.isArray(base.healthyHabitOrder)
      ? base.healthyHabitOrder
      : [];
    base.customTouchstones = Array.isArray(base.customTouchstones)
      ? base.customTouchstones
      : [];
    base.touchstoneOrder = Array.isArray(base.touchstoneOrder)
      ? base.touchstoneOrder
      : [];

    // Migrate totalThrivingDays from score history if never set
    if (
      !parsed.totalThrivingDays &&
      base.scoreHistory &&
      Object.keys(base.scoreHistory).length > 0
    ) {
      const thrived = Object.values(base.scoreHistory).filter(
        (s) => Number(s) >= 150
      ).length;
      if (thrived > base.totalThrivingDays) {
        base.totalThrivingDays = thrived;
      }
    }

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
