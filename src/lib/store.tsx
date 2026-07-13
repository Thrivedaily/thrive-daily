"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { HABITS } from "@/data/habits";
import { BADGE_DEFS, levelFromLifetimePoints } from "@/data/badges";
import { isYesterday, msUntilMidnight, todayKey } from "@/lib/dates";
import { scoreFromCompletions, THRIVING_THRESHOLD } from "@/lib/scoring";
import { defaultState, loadState, saveState } from "@/lib/storage";
import type { AppState, DailyGoal } from "@/lib/types";

type Store = {
  state: AppState;
  hydrated: boolean;
  dailyScore: number;
  levelInfo: ReturnType<typeof levelFromLifetimePoints>;
  toggleHabit: (habitId: string) => void;
  setUserName: (name: string) => void;
  addGoal: (text: string) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  toggleTouchstone: (id: string) => void;
  toggleHealthyHabit: (id: string) => void;
  toggleHealthyHabitDone: (id: string) => void;
  setVirtueNote: (virtueId: string, note: string) => void;
  unlockBadge: (id: string) => void;
  resetToday: () => void;
};

const AppStoreContext = createContext<Store | null>(null);

function applyDayRollover(prev: AppState, now = new Date()): AppState {
  const today = todayKey(now);
  if (prev.activeDate === today) return prev;

  const prevScore = scoreFromCompletions(prev.completedHabits);
  const scoreHistory = { ...prev.scoreHistory };
  if (prev.activeDate) {
    scoreHistory[prev.activeDate] = prevScore;
  }

  let streak = prev.streak;
  let bestStreak = prev.bestStreak;
  let lastActiveDate = prev.lastActiveDate;

  // Streak logic: if previous day thrived and was yesterday relative to today, keep/extend;
  // if previous day thrived and we just rolled from that day, extend.
  if (prevScore >= THRIVING_THRESHOLD) {
    if (prev.activeDate === todayKey(new Date(now.getTime() - 86400000)) || isYesterday(prev.activeDate, now)) {
      streak = (prev.streak || 0) + 1;
    } else if (prev.activeDate !== today) {
      // gap — start new streak at 1 if they thrived on activeDate but not contiguous
      streak = 1;
    }
    lastActiveDate = prev.activeDate;
    bestStreak = Math.max(bestStreak, streak);
  } else if (prev.activeDate && prev.activeDate !== today) {
    // Missed thriving — if more than one day gap or didn't thrive, reset
    if (!isYesterday(prev.activeDate, now) && prev.activeDate !== today) {
      streak = 0;
    } else {
      streak = 0;
    }
  }

  // Reset daily completions; keep healthy-habit focus selections
  const goals = prev.goals.map((g) => ({ ...g, completed: false }));

  return {
    ...prev,
    activeDate: today,
    completedHabits: {},
    touchstoneDoneToday: {},
    healthyHabitDoneToday: {},
    scoreHistory,
    streak,
    bestStreak,
    lastActiveDate,
    goals,
  };
}

function evaluateBadges(state: AppState, dailyScore: number): string[] {
  const unlocked = new Set(state.unlockedBadges);
  const completedCount = Object.values(state.completedHabits).filter(Boolean).length;
  const level = levelFromLifetimePoints(state.lifetimePoints).level;

  const tryUnlock = (id: string, cond: boolean) => {
    if (cond) unlocked.add(id);
  };

  tryUnlock("first-check", completedCount >= 1);
  tryUnlock("fifty-points", dailyScore >= 50);
  tryUnlock("thriving", dailyScore >= THRIVING_THRESHOLD);
  tryUnlock("max-day", completedCount >= HABITS.length);
  tryUnlock("streak-3", state.streak >= 3);
  tryUnlock("streak-7", state.streak >= 7);
  tryUnlock("streak-30", state.streak >= 30);
  tryUnlock("level-5", level >= 5);
  tryUnlock("level-10", level >= 10);
  return Array.from(unlocked);
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loaded = applyDayRollover(loadState());
    setState(loaded);
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(state), 150);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated]);

  // Midnight reset timer
  useEffect(() => {
    if (!hydrated) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setState((prev) => applyDayRollover(prev));
        schedule();
      }, msUntilMidnight() + 500);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [hydrated]);

  // Visibility check for day change
  useEffect(() => {
    if (!hydrated) return;
    const onFocus = () => {
      setState((prev) => applyDayRollover(prev));
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [hydrated]);

  const dailyScore = useMemo(
    () => scoreFromCompletions(state.completedHabits),
    [state.completedHabits]
  );

  const levelInfo = useMemo(
    () => levelFromLifetimePoints(state.lifetimePoints),
    [state.lifetimePoints]
  );

  const toggleHabit = useCallback((habitId: string) => {
    setState((prev) => {
      const rolled = applyDayRollover(prev);
      const habit = HABITS.find((h) => h.id === habitId);
      if (!habit) return rolled;

      const was = !!rolled.completedHabits[habitId];
      const completedHabits = {
        ...rolled.completedHabits,
        [habitId]: !was,
      };
      const delta = was ? -habit.points : habit.points;
      const lifetimePoints = Math.max(0, rolled.lifetimePoints + delta);
      const nextScore = scoreFromCompletions(completedHabits);

      // Streak is finalized on day rollover; badges use current score live
      const next: AppState = {
        ...rolled,
        completedHabits,
        lifetimePoints,
        lastActiveDate: todayKey(),
      };
      next.unlockedBadges = evaluateBadges(next, nextScore);
      next.scoreHistory = {
        ...next.scoreHistory,
        [next.activeDate]: nextScore,
      };
      return next;
    });
  }, []);

  const setUserName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, userName: name }));
  }, []);

  const addGoal = useCallback((text: string) => {
    const goal: DailyGoal = {
      id: `goal-${Date.now()}`,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    if (!goal.text) return;
    setState((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
  }, []);

  const toggleGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  }, []);

  const toggleTouchstone = useCallback((id: string) => {
    setState((prev) => {
      const done = { ...(prev.touchstoneDoneToday || {}) };
      if (done[id]) delete done[id];
      else done[id] = true;
      return { ...prev, touchstoneDoneToday: done };
    });
  }, []);

  const toggleHealthyHabit = useCallback((id: string) => {
    setState((prev) => {
      const checks = { ...(prev.healthyHabitChecks || {}) };
      const doneToday = { ...(prev.healthyHabitDoneToday || {}) };
      if (checks[id]) {
        delete checks[id];
        delete doneToday[id];
      } else {
        checks[id] = true;
      }
      return {
        ...prev,
        healthyHabitChecks: checks,
        healthyHabitDoneToday: doneToday,
      };
    });
  }, []);

  const toggleHealthyHabitDone = useCallback((id: string) => {
    setState((prev) => {
      // Only allow complete if habit is in focus set
      if (!prev.healthyHabitChecks?.[id]) return prev;
      const doneToday = { ...(prev.healthyHabitDoneToday || {}) };
      if (doneToday[id]) delete doneToday[id];
      else doneToday[id] = true;
      return { ...prev, healthyHabitDoneToday: doneToday };
    });
  }, []);

  const setVirtueNote = useCallback((virtueId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      virtueNotes: {
        ...prev.virtueNotes,
        [`${prev.activeDate}:${virtueId}`]: note,
      },
    }));
  }, []);

  const unlockBadge = useCallback((id: string) => {
    setState((prev) => {
      if (prev.unlockedBadges.includes(id)) return prev;
      return { ...prev, unlockedBadges: [...prev.unlockedBadges, id] };
    });
  }, []);

  const resetToday = useCallback(() => {
    setState((prev) => {
      // Reverse lifetime points for currently completed habits
      const refund = scoreFromCompletions(prev.completedHabits);
      return {
        ...prev,
        completedHabits: {},
        lifetimePoints: Math.max(0, prev.lifetimePoints - refund),
        scoreHistory: { ...prev.scoreHistory, [prev.activeDate]: 0 },
      };
    });
  }, []);

  const value: Store = {
    state,
    hydrated,
    dailyScore,
    levelInfo,
    toggleHabit,
    setUserName,
    addGoal,
    toggleGoal,
    removeGoal,
    toggleTouchstone,
    toggleHealthyHabit,
    toggleHealthyHabitDone,
    setVirtueNote,
    unlockBadge,
    resetToday,
  };

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}

export function useBadgeMeta() {
  const { state } = useAppStore();
  return BADGE_DEFS.map((b) => ({
    ...b,
    unlocked: state.unlockedBadges.includes(b.id),
  }));
}
