export type HabitCategoryKey =
  | "wake-up"
  | "morning"
  | "mid-morning"
  | "mid-day"
  | "evening"
  | "late-evening"
  | "bedtime";

export interface Habit {
  id: string;
  category: string;
  categoryKey: HabitCategoryKey | string;
  time: string;
  name: string;
  points: number;
  order: number;
  howTo: string;
  whyImportant: string;
  detailedScience: string;
  links: string[];
}

export type VirtueGroup = "cardinal" | "theological" | "additional";

export interface Virtue {
  id: string;
  name: string;
  description: string;
  order: number;
  group: VirtueGroup | string;
  reflections: string[];
}

export interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

/** Guide item from the Healthy Habits content library */
export interface HealthyHabitGuideItem {
  id: string;
  categoryKey: string;
  category: string;
  name: string;
  science: string;
  order: number;
}

/** @deprecated kept for migration of older localStorage */
export interface HealthyHabit {
  id: string;
  name: string;
  notes: string;
  frequency: string;
  completedToday: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
}

export interface AppState {
  /** ISO date (YYYY-MM-DD) for which completions apply */
  activeDate: string;
  /** habitId -> completed */
  completedHabits: Record<string, boolean>;
  /** Lifetime points (all-time) */
  lifetimePoints: number;
  /**
   * Current streak: consecutive days (including today once thrived)
   * at or above the Thriving threshold (150+). Resets to 0 after a missed day.
   */
  streak: number;
  /** Longest consecutive thriving streak ever */
  bestStreak: number;
  /**
   * Lifetime total of distinct days that reached Thriving (150+).
   * Never decreases when a day is missed.
   */
  totalThrivingDays: number;
  /** Last date (YYYY-MM-DD) that reached Thriving — used for streak continuity */
  lastThrivingDate: string | null;
  /** Last date user completed at least one habit (YYYY-MM-DD) */
  lastActiveDate: string | null;
  /** Badge ids unlocked */
  unlockedBadges: string[];
  /** Daily goals (legacy freeform; touchstones use touchstoneDoneToday) */
  goals: DailyGoal[];
  /** Daily Touchstones marked practiced today (id -> true) */
  touchstoneDoneToday: Record<string, boolean>;
  /** Healthy habit guide items selected as focus (id -> true) */
  healthyHabitChecks: Record<string, boolean>;
  /** Selected healthy habits completed for the active day (id -> true) */
  healthyHabitDoneToday: Record<string, boolean>;
  /** Display name */
  userName: string;
  /** History of daily scores by date */
  scoreHistory: Record<string, number>;
  /** Virtue reflections by virtue id + date */
  virtueNotes: Record<string, string>;
}

export type ScoreTier = {
  min: number;
  label: string;
  color: string;
  message: string;
};
