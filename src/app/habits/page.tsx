"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Check, ChevronDown, Leaf, Pencil, Plus, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { HEALTHY_HABIT_CATEGORIES } from "@/data/healthyHabits";
import { ReorderControls } from "@/components/reorder-controls";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useAppStore } from "@/lib/store";
import { HEALTHY_HABIT_POINTS } from "@/lib/scoring";
import { cn } from "@/lib/cn";

export default function HealthyHabitsPage() {
  const { isSignedIn } = useAuth();
  const {
    state,
    hydrated,
    healthyHabitsCatalog,
    toggleHealthyHabit,
    reorderHealthyHabit,
    addCustomHealthyHabit,
    removeCustomHealthyHabit,
  } = useAppStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [categoryKey, setCategoryKey] = useState<string>(
    HEALTHY_HABIT_CATEGORIES[0].key
  );
  const [science, setScience] = useState("");

  const checks = state.healthyHabitChecks || {};
  const activeCount = Object.values(checks).filter(Boolean).length;
  const flatIds = useMemo(
    () => healthyHabitsCatalog.map((h) => h.id),
    [healthyHabitsCatalog]
  );

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  function submitAdd() {
    addCustomHealthyHabit({
      name,
      categoryKey,
      science: science || undefined,
    });
    setName("");
    setScience("");
    setShowAdd(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
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
        {isSignedIn ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing((e) => !e);
                setShowAdd(false);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium",
                editing
                  ? "border-teal-500/40 bg-teal-500/15 text-teal-800 dark:text-teal-200"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              {editing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {editing ? "Done" : "Customize"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setShowAdd((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-3 py-2 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add habit
              </button>
            )}
          </div>
        ) : null}
      </div>

      <SignInPrompt compact />

      <Card className="border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-emerald-500/5">
        <p className="text-sm text-muted-foreground">
          Check habits you want to focus on — they appear on Home under your
          daily protocols. Completing one there awards{" "}
          <span className="font-semibold text-teal-700 dark:text-teal-300">
            +{HEALTHY_HABIT_POINTS} points
          </span>{" "}
          toward your daily score and lifetime total.{" "}
          <span className="font-semibold text-foreground">
            {activeCount} of {healthyHabitsCatalog.length}
          </span>{" "}
          selected.
        </p>
      </Card>

      {showAdd && isSignedIn && (
        <Card className="space-y-3 border-teal-500/30">
          <CardTitle className="text-base">Add healthy habit</CardTitle>
          <label className="block space-y-1 text-xs font-medium">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
              placeholder="e.g. Walk outside after lunch"
            />
          </label>
          <label className="block space-y-1 text-xs font-medium">
            Category
            <select
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
            >
              {HEALTHY_HABIT_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-xs font-medium">
            Notes (optional)
            <textarea
              value={science}
              onChange={(e) => setScience(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitAdd}
              disabled={!name.trim()}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Save habit
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {HEALTHY_HABIT_CATEGORIES.map((cat) => {
        const items = healthyHabitsCatalog.filter(
          (h) => h.categoryKey === cat.key
        );
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
                const idx = flatIds.indexOf(item.id);

                return (
                  <Card
                    key={item.id}
                    className={cn(
                      "overflow-hidden p-0 transition",
                      isChecked && "border-teal-500/40 bg-teal-500/5"
                    )}
                  >
                    <div className="flex items-start gap-1 p-3 sm:p-4">
                      {editing && isSignedIn ? (
                        <ReorderControls
                          className="mt-0.5"
                          canUp={idx > 0}
                          canDown={idx >= 0 && idx < flatIds.length - 1}
                          onUp={() => reorderHealthyHabit(item.id, "up")}
                          onDown={() => reorderHealthyHabit(item.id, "down")}
                          onRemove={
                            item.isCustom
                              ? () => {
                                  if (confirm(`Remove “${item.name}”?`)) {
                                    removeCustomHealthyHabit(item.id);
                                  }
                                }
                              : undefined
                          }
                        />
                      ) : null}
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
                              {item.isCustom ? (
                                <span className="ml-1.5 text-[10px] font-semibold uppercase text-teal-600">
                                  custom
                                </span>
                              ) : null}
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
