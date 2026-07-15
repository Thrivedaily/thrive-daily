"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CATEGORIES, HABITS } from "@/data/habits";
import { Card, CardTitle } from "@/components/ui/card";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { useAppStore } from "@/lib/store";
import {
  MAX_DAILY_POINTS,
  THRIVING_THRESHOLD,
  tierForScore,
} from "@/lib/scoring";
import { SignInPrompt } from "@/components/sign-in-prompt";

export default function ProtocolsPage() {
  const { state, hydrated, dailyScore, toggleHabit, resetToday } = useAppStore();
  const [filter, setFilter] = useState<string>("all");
  const tier = tierForScore(dailyScore);

  const sections = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      habits: HABITS.filter((h) => h.categoryKey === cat.key).sort(
        (a, b) => a.order - b.order
      ),
    })).filter((s) => s.habits.length > 0);
  }, []);

  const visible =
    filter === "all" ? sections : sections.filter((s) => s.key === filter);

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Protocols</h1>
          <p className="mt-1 text-muted-foreground">
            Check habits as you complete them. Score resets at midnight.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                "Reset today’s checkboxes? Points earned today will be removed from lifetime total."
              )
            ) {
              resetToday();
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Reset today
        </button>
      </div>

      <SignInPrompt compact />

      <Card className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/5">
        <div>
          <p className="text-sm text-muted-foreground">Running total</p>
          <p className="text-3xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
            {dailyScore}
            <span className="text-base font-medium text-muted-foreground">
              {" "}
              / {MAX_DAILY_POINTS}
            </span>
          </p>
          <p className={`text-sm font-semibold ${tier.color}`}>
            {tier.label}
            {dailyScore >= THRIVING_THRESHOLD
              ? " — you are thriving today"
              : ` — ${Math.max(0, THRIVING_THRESHOLD - dailyScore)} to Thriving`}
          </p>
        </div>
        <div className="h-3 w-full max-w-xs overflow-hidden rounded-full bg-muted sm:w-48">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
            style={{
              width: `${Math.min(100, (dailyScore / MAX_DAILY_POINTS) * 100)}%`,
            }}
          />
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
        />
        {sections.map((s) => (
          <FilterChip
            key={s.key}
            active={filter === s.key}
            onClick={() => setFilter(s.key)}
            label={`${s.emoji} ${s.label}`}
          />
        ))}
      </div>

      <div className="space-y-6">
        {visible.map((section) => {
          const sectionPts = section.habits.reduce(
            (sum, h) =>
              sum + (state.completedHabits[h.id] ? h.points : 0),
            0
          );
          const sectionMax = section.habits.reduce((s, h) => s + h.points, 0);
          return (
            <Card key={section.key} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle>
                    {section.emoji} {section.label}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums">
                  {sectionPts}/{sectionMax}
                </span>
              </div>
              <div className="space-y-2">
                {section.habits.map((habit) => (
                  <CheckboxRow
                    key={habit.id}
                    checked={!!state.completedHabits[habit.id]}
                    onToggle={() => toggleHabit(habit.id)}
                    title={habit.name}
                    subtitle={habit.time}
                    points={habit.points}
                    href={`/science/${habit.id}`}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-teal-600 text-white"
          : "border border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
