import type { Badge } from "@/lib/types";

export const BADGE_DEFS: Omit<Badge, "unlockedAt">[] = [
  {
    id: "first-check",
    name: "First Step",
    description: "Complete your first protocol habit",
    emoji: "🌱",
  },
  {
    id: "fifty-points",
    name: "Building Momentum",
    description: "Score 50+ points in a single day",
    emoji: "⚡",
  },
  {
    id: "thriving",
    name: "Thriving",
    description: "Score 150+ points in a single day",
    emoji: "🏆",
  },
  {
    id: "max-day",
    name: "Full Protocol",
    description: "Complete every protocol habit in one day",
    emoji: "💎",
  },
  {
    id: "streak-3",
    name: "3-Day Flame",
    description: "Maintain a 3-day thriving streak",
    emoji: "🔥",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day thriving streak",
    emoji: "🗓️",
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintain a 30-day thriving streak",
    emoji: "👑",
  },
  {
    id: "level-5",
    name: "Rising Star",
    description: "Reach Level 5",
    emoji: "⭐",
  },
  {
    id: "level-10",
    name: "Virtuous Path",
    description: "Reach Level 10",
    emoji: "🧭",
  },
];

/** Points needed per level (linear-ish growth) */
export function pointsForLevel(level: number): number {
  return level * 200;
}

export function levelFromLifetimePoints(points: number): {
  level: number;
  current: number;
  next: number;
  progress: number;
} {
  let level = 1;
  let remaining = points;
  while (remaining >= pointsForLevel(level)) {
    remaining -= pointsForLevel(level);
    level += 1;
    if (level > 100) break;
  }
  const next = pointsForLevel(level);
  return {
    level,
    current: remaining,
    next,
    progress: Math.min(100, Math.round((remaining / next) * 100)),
  };
}
