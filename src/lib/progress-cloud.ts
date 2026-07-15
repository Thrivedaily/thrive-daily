import type { AppState } from "@/lib/types";
import { defaultState } from "@/lib/storage";
import { levelFromLifetimePoints } from "@/data/badges";

/** Full progress — Clerk privateMetadata (server-only) */
export const PROGRESS_METADATA_KEY = "thriveDaily";

/**
 * Public, non-identifying board stats — Clerk publicMetadata
 * (readable for leaderboard ranking; no names/emails)
 */
export const LEADERBOARD_METADATA_KEY = "thriveBoard";

export const CLOUD_PROGRESS_VERSION = 1 as const;

export type CloudProgressPayload = {
  version: typeof CLOUD_PROGRESS_VERSION;
  updatedAt: string;
  state: AppState;
};

/** Anonymous board snapshot stored on publicMetadata */
export type LeaderboardPublicStats = {
  lifetimePoints: number;
  streak: number;
  bestStreak: number;
  level: number;
  badges: number;
  updatedAt: string;
};

export type LeaderboardEntry = {
  rank: number;
  lifetimePoints: number;
  level: number;
  streak: number;
  /** true when this row is the signed-in user (still no name shown) */
  isYou: boolean;
};

/** Soft limit: stay well under Clerk's ~8KB metadata cap */
const MAX_SCORE_HISTORY_DAYS = 120;
const MAX_VIRTUE_NOTES = 80;

export function isEmptyProgress(state: AppState): boolean {
  const hasHabits = Object.values(state.completedHabits || {}).some(Boolean);
  const hasHistory = Object.keys(state.scoreHistory || {}).length > 0;
  const hasBadges = (state.unlockedBadges || []).length > 0;
  const hasFocus = Object.keys(state.healthyHabitChecks || {}).length > 0;
  return (
    (state.lifetimePoints || 0) === 0 &&
    (state.streak || 0) === 0 &&
    (state.bestStreak || 0) === 0 &&
    (state.totalThrivingDays || 0) === 0 &&
    !hasHabits &&
    !hasHistory &&
    !hasBadges &&
    !hasFocus
  );
}

export function normalizeAppState(raw: unknown): AppState {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;
  const parsed = raw as Partial<AppState>;
  return {
    ...base,
    ...parsed,
    completedHabits: parsed.completedHabits ?? {},
    unlockedBadges: Array.isArray(parsed.unlockedBadges)
      ? parsed.unlockedBadges
      : [],
    goals: Array.isArray(parsed.goals) ? parsed.goals : [],
    touchstoneDoneToday: parsed.touchstoneDoneToday ?? {},
    healthyHabitChecks: parsed.healthyHabitChecks ?? {},
    healthyHabitDoneToday: parsed.healthyHabitDoneToday ?? {},
    scoreHistory: parsed.scoreHistory ?? {},
    virtueNotes: parsed.virtueNotes ?? {},
    lifetimePoints: Number(parsed.lifetimePoints) || 0,
    streak: Number(parsed.streak) || 0,
    bestStreak: Number(parsed.bestStreak) || 0,
    totalThrivingDays: Number(parsed.totalThrivingDays) || 0,
    lastThrivingDate:
      typeof parsed.lastThrivingDate === "string"
        ? parsed.lastThrivingDate
        : null,
    userName: typeof parsed.userName === "string" ? parsed.userName : "",
    activeDate:
      typeof parsed.activeDate === "string" ? parsed.activeDate : base.activeDate,
    lastActiveDate:
      typeof parsed.lastActiveDate === "string" || parsed.lastActiveDate === null
        ? (parsed.lastActiveDate as string | null)
        : null,
  };
}

/** Keep cloud payload small enough for Clerk metadata */
export function pruneStateForCloud(state: AppState): AppState {
  const historyEntries = Object.entries(state.scoreHistory || {}).sort(
    ([a], [b]) => b.localeCompare(a)
  );
  const scoreHistory = Object.fromEntries(
    historyEntries.slice(0, MAX_SCORE_HISTORY_DAYS)
  );

  const noteEntries = Object.entries(state.virtueNotes || {}).sort(([a], [b]) =>
    b.localeCompare(a)
  );
  const virtueNotes = Object.fromEntries(noteEntries.slice(0, MAX_VIRTUE_NOTES));

  return {
    ...state,
    scoreHistory,
    virtueNotes,
  };
}

export function parseCloudPayload(raw: unknown): CloudProgressPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Partial<CloudProgressPayload>;
  if (!obj.state) return null;
  return {
    version: CLOUD_PROGRESS_VERSION,
    updatedAt:
      typeof obj.updatedAt === "string"
        ? obj.updatedAt
        : new Date(0).toISOString(),
    state: normalizeAppState(obj.state),
  };
}

/**
 * Decide which state wins when signing in.
 * - Remote empty + local has data → keep local (seed cloud later)
 * - Otherwise prefer remote as the signed-in source of truth
 */
export function pickStateOnSignIn(
  local: AppState,
  remote: AppState | null
): { state: AppState; shouldUpload: boolean } {
  if (!remote) {
    return { state: local, shouldUpload: !isEmptyProgress(local) };
  }
  if (isEmptyProgress(remote) && !isEmptyProgress(local)) {
    return { state: local, shouldUpload: true };
  }
  return { state: remote, shouldUpload: false };
}

export function buildCloudPayload(state: AppState): CloudProgressPayload {
  return {
    version: CLOUD_PROGRESS_VERSION,
    updatedAt: new Date().toISOString(),
    state: pruneStateForCloud(state),
  };
}

export function buildLeaderboardStats(state: AppState): LeaderboardPublicStats {
  const lifetimePoints = Math.max(0, Math.floor(state.lifetimePoints || 0));
  return {
    lifetimePoints,
    streak: Math.max(0, Math.floor(state.streak || 0)),
    bestStreak: Math.max(0, Math.floor(state.bestStreak || 0)),
    level: levelFromLifetimePoints(lifetimePoints).level,
    badges: Array.isArray(state.unlockedBadges) ? state.unlockedBadges.length : 0,
    updatedAt: new Date().toISOString(),
  };
}

export function parseLeaderboardStats(raw: unknown): LeaderboardPublicStats | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<LeaderboardPublicStats>;
  const lifetimePoints = Number(o.lifetimePoints);
  if (!Number.isFinite(lifetimePoints) || lifetimePoints < 0) return null;
  return {
    lifetimePoints: Math.floor(lifetimePoints),
    streak: Math.max(0, Math.floor(Number(o.streak) || 0)),
    bestStreak: Math.max(0, Math.floor(Number(o.bestStreak) || 0)),
    level: Math.max(1, Math.floor(Number(o.level) || 1)),
    badges: Math.max(0, Math.floor(Number(o.badges) || 0)),
    updatedAt:
      typeof o.updatedAt === "string" ? o.updatedAt : new Date(0).toISOString(),
  };
}

export function formatPoints(n: number): string {
  return Math.floor(n).toLocaleString("en-US");
}
