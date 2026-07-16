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
import { BADGE_DEFS, levelFromLifetimePoints } from "@/data/badges";
import {
  daysBetween,
  isNextCalendarDay,
  msUntilMidnight,
  todayKey,
} from "@/lib/dates";
import {
  mergeOrder,
  moveIdInOrder,
  newCustomId,
  resolveHealthyHabits,
  resolveProtocols,
  resolveTouchstones,
} from "@/lib/catalog";
import { HABITS } from "@/data/habits";
import { HEALTHY_HABITS } from "@/data/healthyHabits";
import { TOUCHSTONES } from "@/data/touchstones";
import { pickStateOnSignIn } from "@/lib/progress-cloud";
import {
  HEALTHY_HABIT_POINTS,
  dailyScoreFromState,
  maxProtocolPoints,
  THRIVING_THRESHOLD,
} from "@/lib/scoring";
import { defaultState, loadState, saveState } from "@/lib/storage";
import type {
  AppState,
  CustomHealthyHabit,
  CustomProtocol,
  CustomTouchstone,
  DailyGoal,
} from "@/lib/types";

type SyncStatus = "idle" | "loading" | "synced" | "saving" | "error" | "local";

type Store = {
  state: AppState;
  hydrated: boolean;
  syncStatus: SyncStatus;
  dailyScore: number;
  maxDailyPoints: number;
  levelInfo: ReturnType<typeof levelFromLifetimePoints>;
  protocols: ReturnType<typeof resolveProtocols>;
  healthyHabitsCatalog: ReturnType<typeof resolveHealthyHabits>;
  touchstonesCatalog: ReturnType<typeof resolveTouchstones>;
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
  /** Catalog customization (persists via AppState → Clerk when signed in) */
  reorderProtocol: (id: string, direction: "up" | "down") => void;
  addCustomProtocol: (input: {
    name: string;
    points: number;
    categoryKey: string;
    time?: string;
  }) => void;
  removeCustomProtocol: (id: string) => void;
  reorderHealthyHabit: (id: string, direction: "up" | "down") => void;
  addCustomHealthyHabit: (input: {
    name: string;
    categoryKey: string;
    science?: string;
  }) => void;
  removeCustomHealthyHabit: (id: string) => void;
  reorderTouchstone: (id: string, direction: "up" | "down") => void;
  addCustomTouchstone: (input: { title: string; description: string }) => void;
  removeCustomTouchstone: (id: string) => void;
};

const AppStoreContext = createContext<Store | null>(null);

/**
 * When daily score first reaches Thriving for `dateKey`, update
 * current streak + lifetime thriving-day count. Idempotent per date.
 */
function applyThrivingDayIfNeeded(
  state: AppState,
  dailyScore: number,
  dateKey: string
): AppState {
  if (dailyScore < THRIVING_THRESHOLD) return state;
  if (state.lastThrivingDate === dateKey) return state;

  let streak = 1;
  if (
    state.lastThrivingDate &&
    isNextCalendarDay(state.lastThrivingDate, dateKey)
  ) {
    streak = (state.streak || 0) + 1;
  }

  const bestStreak = Math.max(state.bestStreak || 0, streak);
  const totalThrivingDays = (state.totalThrivingDays || 0) + 1;

  return {
    ...state,
    streak,
    bestStreak,
    totalThrivingDays,
    lastThrivingDate: dateKey,
  };
}

/** Break current streak if the last thriving day is no longer "today or yesterday". */
function expireStreakIfBroken(state: AppState, today: string): AppState {
  if (!state.lastThrivingDate) {
    return state.streak === 0 ? state : { ...state, streak: 0 };
  }
  const gap = daysBetween(state.lastThrivingDate, today);
  // last thrived today (0) or yesterday (1) → streak still active
  if (gap <= 1) return state;
  return { ...state, streak: 0 };
}

function applyDayRollover(prev: AppState, now = new Date()): AppState {
  const today = todayKey(now);
  if (prev.activeDate === today) {
    return expireStreakIfBroken(prev, today);
  }

  const prevScore = dailyScoreFromState(
    prev.completedHabits,
    prev.healthyHabitDoneToday,
    prev
  );
  const scoreHistory = { ...prev.scoreHistory };
  if (prev.activeDate) {
    scoreHistory[prev.activeDate] = prevScore;
  }

  // Finalize thriving stats for the day we're leaving
  let next = applyThrivingDayIfNeeded(
    { ...prev, scoreHistory },
    prevScore,
    prev.activeDate
  );

  // Multi-day gap without opening the app breaks the streak
  next = expireStreakIfBroken(next, today);

  // If yesterday didn't thrive (score below threshold), streak is already 0
  // unless lastThrivingDate was still yesterday — only thrived days set it.
  if (prevScore < THRIVING_THRESHOLD) {
    const gapFromActive = daysBetween(prev.activeDate, today);
    if (gapFromActive >= 1) {
      // Closed a non-thriving day: streak continues only if last thrived day
      // is still yesterday relative to *today* (e.g. thrived day-before-yesterday
      // and missed yesterday → gap from lastThrivingDate > 1 → expired above).
      next = expireStreakIfBroken(next, today);
    }
  }

  const goals = next.goals.map((g) => ({ ...g, completed: false }));

  return {
    ...next,
    activeDate: today,
    completedHabits: {},
    touchstoneDoneToday: {},
    healthyHabitDoneToday: {},
    scoreHistory,
    goals,
  };
}

/** Shared post-score update: history, thriving streak/total, badges */
function withScoreUpdate(
  base: AppState,
  patch: Partial<AppState> = {}
): AppState {
  let next: AppState = { ...base, ...patch };
  const score = dailyScoreFromState(
    next.completedHabits,
    next.healthyHabitDoneToday,
    next
  );
  next = applyThrivingDayIfNeeded(next, score, next.activeDate);
  next.scoreHistory = {
    ...next.scoreHistory,
    [next.activeDate]: score,
  };
  next.unlockedBadges = evaluateBadges(next, score);
  return next;
}

function evaluateBadges(state: AppState, dailyScore: number): string[] {
  const unlocked = new Set(state.unlockedBadges);
  const completedCount = Object.values(state.completedHabits).filter(Boolean)
    .length;
  const level = levelFromLifetimePoints(state.lifetimePoints).level;
  const protocolCount = resolveProtocols(state).length;

  const tryUnlock = (id: string, cond: boolean) => {
    if (cond) unlocked.add(id);
  };

  tryUnlock("first-check", completedCount >= 1);
  tryUnlock("fifty-points", dailyScore >= 50);
  tryUnlock("thriving", dailyScore >= THRIVING_THRESHOLD);
  tryUnlock("max-day", completedCount >= protocolCount);
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

  const protocols = useMemo(() => resolveProtocols(state), [state]);
  const healthyHabitsCatalog = useMemo(
    () => resolveHealthyHabits(state),
    [state]
  );
  const touchstonesCatalog = useMemo(
    () => resolveTouchstones(state),
    [state]
  );

  const dailyScore = useMemo(
    () =>
      dailyScoreFromState(
        state.completedHabits,
        state.healthyHabitDoneToday,
        state
      ),
    [state]
  );

  const maxDailyPoints = useMemo(
    () => maxProtocolPoints(state),
    [state]
  );

  const levelInfo = useMemo(
    () => levelFromLifetimePoints(state.lifetimePoints),
    [state.lifetimePoints]
  );

  const toggleHabit = useCallback((habitId: string) => {
    setState((prev) => {
      const rolled = applyDayRollover(prev);
      const habit = resolveProtocols(rolled).find((h) => h.id === habitId);
      if (!habit) return rolled;

      const was = !!rolled.completedHabits[habitId];
      const completedHabits = {
        ...rolled.completedHabits,
        [habitId]: !was,
      };
      const delta = was ? -habit.points : habit.points;
      const lifetimePoints = Math.max(0, rolled.lifetimePoints + delta);

      return withScoreUpdate(rolled, {
        completedHabits,
        lifetimePoints,
        lastActiveDate: todayKey(),
      });
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
      return withScoreUpdate(rolled, {
        healthyHabitChecks: checks,
        healthyHabitDoneToday: doneToday,
        lifetimePoints,
      });
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

      return withScoreUpdate(rolled, {
        healthyHabitDoneToday: doneToday,
        lifetimePoints,
        lastActiveDate: todayKey(),
      });
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
        prev.healthyHabitDoneToday,
        prev
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

  const reorderProtocol = useCallback((id: string, direction: "up" | "down") => {
    setState((prev) => {
      const current = mergeOrder(
        HABITS.map((h) => h.id),
        (prev.customProtocols || []).map((c) => c.id),
        prev.protocolOrder
      );
      return { ...prev, protocolOrder: moveIdInOrder(current, id, direction) };
    });
  }, []);

  const addCustomProtocol = useCallback(
    (input: {
      name: string;
      points: number;
      categoryKey: string;
      time?: string;
    }) => {
      const name = input.name.trim();
      if (!name) return;
      const points = Math.max(0, Math.min(100, Math.floor(input.points) || 0));
      const custom: CustomProtocol = {
        id: newCustomId("proto"),
        name,
        points,
        categoryKey: input.categoryKey,
        time: input.time?.trim() || "Anytime",
      };
      setState((prev) => {
        const customs = [...(prev.customProtocols || []), custom];
        const order = mergeOrder(
          HABITS.map((h) => h.id),
          customs.map((c) => c.id),
          prev.protocolOrder
        );
        if (!order.includes(custom.id)) order.push(custom.id);
        return {
          ...prev,
          customProtocols: customs,
          protocolOrder: order,
        };
      });
    },
    []
  );

  const removeCustomProtocol = useCallback((id: string) => {
    setState((prev) => {
      const customs = (prev.customProtocols || []).filter((c) => c.id !== id);
      const wasDone = !!prev.completedHabits[id];
      const removed = (prev.customProtocols || []).find((c) => c.id === id);
      const refund =
        wasDone && removed ? Math.max(0, removed.points) : 0;
      const completedHabits = { ...prev.completedHabits };
      delete completedHabits[id];
      const protocolOrder = (prev.protocolOrder || []).filter((x) => x !== id);
      return withScoreUpdate(prev, {
        customProtocols: customs,
        protocolOrder,
        completedHabits,
        lifetimePoints: Math.max(0, prev.lifetimePoints - refund),
      });
    });
  }, []);

  const reorderHealthyHabit = useCallback(
    (id: string, direction: "up" | "down") => {
      setState((prev) => {
        const current = mergeOrder(
          HEALTHY_HABITS.map((h) => h.id),
          (prev.customHealthyHabits || []).map((c) => c.id),
          prev.healthyHabitOrder
        );
        return {
          ...prev,
          healthyHabitOrder: moveIdInOrder(current, id, direction),
        };
      });
    },
    []
  );

  const addCustomHealthyHabit = useCallback(
    (input: { name: string; categoryKey: string; science?: string }) => {
      const name = input.name.trim();
      if (!name) return;
      const custom: CustomHealthyHabit = {
        id: newCustomId("hh"),
        name,
        categoryKey: input.categoryKey,
        science: input.science?.trim() || undefined,
      };
      setState((prev) => {
        const customs = [...(prev.customHealthyHabits || []), custom];
        const order = mergeOrder(
          HEALTHY_HABITS.map((h) => h.id),
          customs.map((c) => c.id),
          prev.healthyHabitOrder
        );
        if (!order.includes(custom.id)) order.push(custom.id);
        return {
          ...prev,
          customHealthyHabits: customs,
          healthyHabitOrder: order,
        };
      });
    },
    []
  );

  const removeCustomHealthyHabit = useCallback((id: string) => {
    setState((prev) => {
      const customs = (prev.customHealthyHabits || []).filter(
        (c) => c.id !== id
      );
      const checks = { ...(prev.healthyHabitChecks || {}) };
      const doneToday = { ...(prev.healthyHabitDoneToday || {}) };
      let lifetimePoints = prev.lifetimePoints;
      if (doneToday[id]) {
        lifetimePoints = Math.max(0, lifetimePoints - HEALTHY_HABIT_POINTS);
      }
      delete checks[id];
      delete doneToday[id];
      return withScoreUpdate(prev, {
        customHealthyHabits: customs,
        healthyHabitOrder: (prev.healthyHabitOrder || []).filter(
          (x) => x !== id
        ),
        healthyHabitChecks: checks,
        healthyHabitDoneToday: doneToday,
        lifetimePoints,
      });
    });
  }, []);

  const reorderTouchstone = useCallback(
    (id: string, direction: "up" | "down") => {
      setState((prev) => {
        const current = mergeOrder(
          TOUCHSTONES.map((t) => t.id),
          (prev.customTouchstones || []).map((c) => c.id),
          prev.touchstoneOrder
        );
        return {
          ...prev,
          touchstoneOrder: moveIdInOrder(current, id, direction),
        };
      });
    },
    []
  );

  const addCustomTouchstone = useCallback(
    (input: { title: string; description: string }) => {
      const title = input.title.trim();
      if (!title) return;
      const custom: CustomTouchstone = {
        id: newCustomId("ts"),
        title,
        description: input.description.trim(),
      };
      setState((prev) => {
        const customs = [...(prev.customTouchstones || []), custom];
        const order = mergeOrder(
          TOUCHSTONES.map((t) => t.id),
          customs.map((c) => c.id),
          prev.touchstoneOrder
        );
        if (!order.includes(custom.id)) order.push(custom.id);
        return {
          ...prev,
          customTouchstones: customs,
          touchstoneOrder: order,
        };
      });
    },
    []
  );

  const removeCustomTouchstone = useCallback((id: string) => {
    setState((prev) => {
      const done = { ...(prev.touchstoneDoneToday || {}) };
      delete done[id];
      return {
        ...prev,
        customTouchstones: (prev.customTouchstones || []).filter(
          (c) => c.id !== id
        ),
        touchstoneOrder: (prev.touchstoneOrder || []).filter((x) => x !== id),
        touchstoneDoneToday: done,
      };
    });
  }, []);

  const value: Store = {
    state,
    hydrated,
    syncStatus,
    dailyScore,
    maxDailyPoints,
    levelInfo,
    protocols,
    healthyHabitsCatalog,
    touchstonesCatalog,
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
    reorderProtocol,
    addCustomProtocol,
    removeCustomProtocol,
    reorderHealthyHabit,
    addCustomHealthyHabit,
    removeCustomHealthyHabit,
    reorderTouchstone,
    addCustomTouchstone,
    removeCustomTouchstone,
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
