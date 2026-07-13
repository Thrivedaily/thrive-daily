"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function ScienceActions({ habitId }: { habitId: string }) {
  const { state, hydrated, toggleHabit } = useAppStore();
  if (!hydrated) return null;
  const done = !!state.completedHabits[habitId];

  return (
    <button
      type="button"
      onClick={() => toggleHabit(habitId)}
      className={cn(
        "w-full rounded-xl px-4 py-3 text-sm font-semibold transition sm:w-auto",
        done
          ? "border border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300"
          : "bg-teal-600 text-white hover:bg-teal-500"
      )}
    >
      {done ? "✓ Completed today — tap to undo" : "Mark complete for today"}
    </button>
  );
}
