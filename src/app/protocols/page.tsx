"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Pencil, Plus, RotateCcw, X } from "lucide-react";
import { CATEGORIES } from "@/data/habits";
import { Card, CardTitle } from "@/components/ui/card";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { ReorderControls } from "@/components/reorder-controls";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useAppStore } from "@/lib/store";
import { THRIVING_THRESHOLD, tierForScore } from "@/lib/scoring";
import { cn } from "@/lib/cn";

export default function ProtocolsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const {
    state,
    hydrated,
    dailyScore,
    maxDailyPoints,
    protocols,
    toggleHabit,
    resetToday,
    reorderProtocol,
    addCustomProtocol,
    removeCustomProtocol,
  } = useAppStore();
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [points, setPoints] = useState("10");
  const [categoryKey, setCategoryKey] = useState<string>(CATEGORIES[0].key);
  const [time, setTime] = useState("");
  const tier = tierForScore(dailyScore);

  // Home ribbon: /protocols?customize=1 opens edit mode for signed-in users
  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("customize") === "1") {
      setEditing(true);
    }
  }, [authLoaded, isSignedIn]);

  const sections = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      habits: protocols.filter((h) => h.categoryKey === cat.key),
    })).filter((s) => s.habits.length > 0);
  }, [protocols]);

  const visible =
    filter === "all" ? sections : sections.filter((s) => s.key === filter);

  const flatIds = useMemo(() => protocols.map((p) => p.id), [protocols]);

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  function submitAdd() {
    addCustomProtocol({
      name,
      points: Number(points) || 0,
      categoryKey,
      time: time || undefined,
    });
    setName("");
    setPoints("10");
    setTime("");
    setShowAdd(false);
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
        <div className="flex flex-wrap items-center gap-2">
          {isSignedIn ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditing((e) => !e);
                  setShowAdd(false);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
                  editing
                    ? "border-teal-500/40 bg-teal-500/15 text-teal-800 dark:text-teal-200"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {editing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {editing ? "Done" : "Customize"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => setShowAdd((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                >
                  <Plus className="h-4 w-4" />
                  Add habit
                </button>
              )}
            </>
          ) : null}
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
      </div>

      <SignInPrompt compact />

      {editing && isSignedIn && (
        <Card className="border-teal-500/25 bg-teal-500/5 px-4 py-3 text-sm text-muted-foreground">
          Use the arrows to reorder habits. Remove only applies to habits you
          added. Changes sync to your account across devices.
        </Card>
      )}

      {showAdd && isSignedIn && (
        <Card className="space-y-3 border-teal-500/30">
          <CardTitle className="text-base">Add personalized protocol</CardTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1 text-xs font-medium sm:col-span-2">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Journal 5 minutes"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
              />
            </label>
            <label className="block space-y-1 text-xs font-medium">
              Points
              <input
                type="number"
                min={0}
                max={100}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
              />
            </label>
            <label className="block space-y-1 text-xs font-medium">
              Category
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-xs font-medium sm:col-span-2">
              Time hint (optional)
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. After lunch"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitAdd}
              disabled={!name.trim()}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-40"
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

      <Card className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/5">
        <div>
          <p className="text-sm text-muted-foreground">Running total</p>
          <p className="text-3xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
            {dailyScore}
            <span className="text-base font-medium text-muted-foreground">
              {" "}
              / {maxDailyPoints}
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
              width: `${Math.min(
                100,
                maxDailyPoints > 0
                  ? (dailyScore / maxDailyPoints) * 100
                  : 0
              )}%`,
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
                {section.habits.map((habit) => {
                  const idx = flatIds.indexOf(habit.id);
                  return (
                    <div key={habit.id} className="flex items-start gap-1">
                      {editing && isSignedIn ? (
                        <ReorderControls
                          className="mt-3"
                          canUp={idx > 0}
                          canDown={idx >= 0 && idx < flatIds.length - 1}
                          onUp={() => reorderProtocol(habit.id, "up")}
                          onDown={() => reorderProtocol(habit.id, "down")}
                          onRemove={
                            habit.isCustom
                              ? () => {
                                  if (
                                    confirm(
                                      `Remove “${habit.name}”? Completions for it will be cleared.`
                                    )
                                  ) {
                                    removeCustomProtocol(habit.id);
                                  }
                                }
                              : undefined
                          }
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <CheckboxRow
                          checked={!!state.completedHabits[habit.id]}
                          onToggle={() => toggleHabit(habit.id)}
                          title={
                            habit.isCustom
                              ? `${habit.name} · custom`
                              : habit.name
                          }
                          subtitle={habit.time}
                          points={habit.points}
                          href={
                            habit.isCustom
                              ? undefined
                              : `/science/${habit.id}`
                          }
                        />
                      </div>
                    </div>
                  );
                })}
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
