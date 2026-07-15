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
import { useAuth } from "@clerk/nextjs";
import { HABITS } from "@/data/habits";
import { BADGE_DEFS, levelFromLifetimePoints } from "@/data/badges";
import { isYesterday, msUntilMidnight, todayKey } from "@/lib/dates";
import { pickStateOnSignIn } from "@/lib/progress-cloud";
import {
  HEALTHY_HABIT_POINTS,
  dailyScoreFromState,
  THRIVING_THRESHOLD,
} from "@/lib/scoring";
import { defaultState, loadState, saveState } from "@/lib/storage";
import type { AppState, DailyGoal } from "@/lib/types";

type SyncStatus = "idle" | "loading" | "synced" | "saving" | "error" | "local";

type Store = {
  state: AppState;
  hydrated: boolean;
  syncStatus: SyncStatus;
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

  const prevScore = dailyScoreFromState(
    prev.completedHabits,
    prev.healthyHabitDoneToday
  );
  const scoreHistory = { ...prev.scoreHistory };
  if (prev.activeDate) {
    scoreHistory[prev.activeDate] = prevScore;
  }

  let streak = prev.streak;
  let bestStreak = prev.bestStreak;
  let lastActiveDate = prev.lastActiveDate;

  if (prevScore >= THRIVING_THRESHOLD) {
    if (
      prev.activeDate === todayKey(new Date(now.getTime() - 86400000)) ||
      isYesterday(prev.activeDate, now)
    ) {
      streak = (prev.streak || 0) + 1;
    } else if (prev.activeDate !== today) {
      streak = 1;
    }
    lastActiveDate = prev.activeDate;
    bestStreak = Math.max(bestStreak, streak);
  } else if (prev.activeDate && prev.activeDate !== today) {
    if (!isYesterday(prev.activeDate, now) && prev.activeDate !== today) {
      streak = 0;
    } else {
      streak = 0;
    }
  }

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
  const completedCount = Object.values(state.completedHabits).filter(Boolean)
    .length;
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

async function fetchCloudProgress(): Promise<AppState | null> {
  const res = await fetch("/api/user-progress", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Load failed (${res.status})`);
  const data = (await res.json()) as {
    progress?: { state?: AppState } | null;
  };
  return data.progress?.state ?? null;
}

async function saveCloudProgress(state: AppState): Promise<void> {
  const res = await fetch("/api/user-progress", {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });
  if (res.status === 401) return;
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Save failed (${res.status})`);
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cloudSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cloudReady = useRef(false);
  const skipNextCloudSave = useRef(false);
  const activeUserId = useRef<string | null>(null);

  // Initial hydrate from localStorage (works signed-out and as offline cache)
  useEffect(() => {
    const loaded = applyDayRollover(loadState());
    setState(loaded);
    setHydrated(true);
    setSyncStatus("local");
  }, []);

  // When auth resolves / user changes: load Clerk-backed progress
  useEffect(() => {
    if (!hydrated || !authLoaded) return;

    // Signed out → local only
    if (!isSignedIn || !userId) {
      activeUserId.current = null;
      cloudReady.current = false;
      setSyncStatus("local");
      return;
    }

    // Same user already synced
    if (activeUserId.current === userId && cloudReady.current) return;

    let cancelled = false;
    activeUserId.current = userId;
    cloudReady.current = false;
    setSyncStatus("loading");

    (async () => {
      try {
        const local = applyDayRollover(loadState());
        const remote = await fetchCloudProgress();
        if (cancelled) return;

        const { state: chosen, shouldUpload } = pickStateOnSignIn(
          local,
          remote ? applyDayRollover(remote) : null
        );
        const rolled = applyDayRollover(chosen);

        // Avoid double-save when setState triggers the cloud effect after load
        skipNextCloudSave.current = true;
        setState(rolled);
        saveState(rolled);

        if (shouldUpload) {
          setSyncStatus("saving");
          await saveCloudProgress(rolled);
        }

        if (cancelled) return;
        cloudReady.current = true;
        setSyncStatus("synced");
      } catch (err) {
        console.error("[progress sync]", err);
        if (!cancelled) {
          // Stay on local data if cloud fails
          cloudReady.current = true;
          setSyncStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, authLoaded, isSignedIn, userId]);

  // Persist to localStorage always (signed-in offline cache + signed-out primary)
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(state), 150);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated]);

  // Persist to Clerk when signed in
  useEffect(() => {
    if (!hydrated || !authLoaded || !isSignedIn || !userId) return;
    if (!cloudReady.current) return;

    if (skipNextCloudSave.current) {
      skipNextCloudSave.current = false;
      return;
    }

    if (cloudSaveTimer.current) clearTimeout(cloudSaveTimer.current);
    cloudSaveTimer.current = setTimeout(() => {
      setSyncStatus("saving");
      saveCloudProgress(state)
        .then(() => setSyncStatus("synced"))
        .catch((err) => {
          console.error("[progress save]", err);
          setSyncStatus("error");
        });
    }, 600);

    return () => {
      if (cloudSaveTimer.current) clearTimeout(cloudSaveTimer.current);
    };
  }, [state, hydrated, authLoaded, isSignedIn, userId]);

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
    () =>
      dailyScoreFromState(
        state.completedHabits,
        state.healthyHabitDoneToday
      ),
    [state.completedHabits, state.healthyHabitDoneToday]
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
      const nextScore = dailyScoreFromState(
        completedHabits,
        rolled.healthyHabitDoneToday
      );

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
      const rolled = applyDayRollover(prev);
      const checks = { ...(rolled.healthyHabitChecks || {}) };
      const doneToday = { ...(rolled.healthyHabitDoneToday || {}) };
      // Unfocus: refund points if it was completed today
      let lifetimePoints = rolled.lifetimePoints;
      if (checks[id]) {
        if (doneToday[id]) {
          lifetimePoints = Math.max(0, lifetimePoints - HEALTHY_HABIT_POINTS);
        }
        delete checks[id];
        delete doneToday[id];
      } else {
        checks[id] = true;
      }
      const nextScore = dailyScoreFromState(
        rolled.completedHabits,
        doneToday
      );
      return {
        ...rolled,
        healthyHabitChecks: checks,
        healthyHabitDoneToday: doneToday,
        lifetimePoints,
        scoreHistory: {
          ...rolled.scoreHistory,
          [rolled.activeDate]: nextScore,
        },
        unlockedBadges: evaluateBadges(
          { ...rolled, healthyHabitDoneToday: doneToday, lifetimePoints },
          nextScore
        ),
      };
    });
  }, []);

  const toggleHealthyHabitDone = useCallback((id: string) => {
    setState((prev) => {
      const rolled = applyDayRollover(prev);
      if (!rolled.healthyHabitChecks?.[id]) return rolled;

      const doneToday = { ...(rolled.healthyHabitDoneToday || {}) };
      const was = !!doneToday[id];
      if (was) delete doneToday[id];
      else doneToday[id] = true;

      const delta = was ? -HEALTHY_HABIT_POINTS : HEALTHY_HABIT_POINTS;
      const lifetimePoints = Math.max(0, rolled.lifetimePoints + delta);
      const nextScore = dailyScoreFromState(
        rolled.completedHabits,
        doneToday
      );

      const next: AppState = {
        ...rolled,
        healthyHabitDoneToday: doneToday,
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
      const refund = dailyScoreFromState(
        prev.completedHabits,
        prev.healthyHabitDoneToday
      );
      return {
        ...prev,
        completedHabits: {},
        healthyHabitDoneToday: {},
        lifetimePoints: Math.max(0, prev.lifetimePoints - refund),
        scoreHistory: { ...prev.scoreHistory, [prev.activeDate]: 0 },
      };
    });
  }, []);

  const value: Store = {
    state,
    hydrated,
    syncStatus,
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
