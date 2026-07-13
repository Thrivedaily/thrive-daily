"use client";

import { useState } from "react";
import { Check, ChevronDown, Leaf } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import {
  HEALTHY_HABIT_CATEGORIES,
  HEALTHY_HABITS,
  getHealthyHabitsByCategory,
} from "@/data/healthyHabits";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function HealthyHabitsPage() {
  const { state, hydrated, toggleHealthyHabit } = useAppStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  const checks = state.healthyHabitChecks || {};
  const activeCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20">
          <Leaf className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Healthy Habits</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Identifying and pursuing healthy habits is a powerful way to enhance
          your overall well-being, building on the foundation of your daily
          protocols. Use this as a guide to incorporate some into your daily
          life.
        </p>
      </div>

      <Card className="border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-emerald-500/5">
        <p className="text-sm text-muted-foreground">
          Check habits you want to focus on — they appear on Home under your
          daily protocols so you can complete them with the rest of your day.{" "}
          <span className="font-semibold text-foreground">
            {activeCount} of {HEALTHY_HABITS.length}
          </span>{" "}
          selected.
        </p>
      </Card>

      {HEALTHY_HABIT_CATEGORIES.map((cat) => {
        const items = getHealthyHabitsByCategory(cat.key);
        if (!items.length) return null;
        const catActive = items.filter((h) => checks[h.id]).length;

        return (
          <section key={cat.key} className="space-y-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">
                  {cat.emoji} {cat.label}
                </h2>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
                {catActive}/{items.length}
              </span>
            </div>

            <div className="space-y-2">
              {items.map((item) => {
                const isChecked = !!checks[item.id];
                const isOpen = !!expanded[item.id];

                return (
                  <Card
                    key={item.id}
                    className={cn(
                      "overflow-hidden p-0 transition",
                      isChecked && "border-teal-500/40 bg-teal-500/5"
                    )}
                  >
                    <div className="flex items-start gap-2 p-3 sm:p-4">
                      <button
                        type="button"
                        onClick={() => toggleHealthyHabit(item.id)}
                        aria-pressed={isChecked}
                        aria-label={
                          isChecked
                            ? `Unmark ${item.name}`
                            : `Mark ${item.name}`
                        }
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition",
                          isChecked
                            ? "border-teal-500 bg-teal-500 text-white"
                            : "border-muted-foreground/30 hover:border-teal-500/60"
                        )}
                      >
                        {isChecked && (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          className="flex w-full items-start justify-between gap-2 text-left"
                        >
                          <div>
                            <p
                              className={cn(
                                "font-medium leading-snug text-foreground",
                                isChecked && "text-teal-900 dark:text-teal-100"
                              )}
                            >
                              {item.name}
                            </p>
                            {!isOpen && (
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {item.science}
                              </p>
                            )}
                          </div>
                          <ChevronDown
                            className={cn(
                              "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>

                        {isOpen && (
                          <div className="mt-3 space-y-2 border-t border-border pt-3">
                            <CardTitle className="text-sm">
                              Why it matters
                            </CardTitle>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                              {item.science}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

      <Card className="text-sm text-muted-foreground">
        <p>
          Tip: start with one daily and one weekly habit. Consistency beats
          collecting checkmarks — pair these with your Daily Protocols for the
          strongest compounding effect.
        </p>
      </Card>
    </div>
  );
}
