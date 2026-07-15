"use client";

import { useMemo, useState } from "react";
import { VIRTUES, VIRTUE_GROUPS, getVirtueOfTheDay } from "@/data/virtues";
import { Card, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { SignInPrompt } from "@/components/sign-in-prompt";

export default function VirtuesPage() {
  const virtueOfDay = getVirtueOfTheDay();
  const { state, hydrated, setVirtueNote } = useAppStore();
  const [selectedId, setSelectedId] = useState(virtueOfDay.id);

  const selected = useMemo(
    () => VIRTUES.find((v) => v.id === selectedId) ?? virtueOfDay,
    [selectedId, virtueOfDay]
  );

  const noteKey = `${state.activeDate}:${selected.id}`;
  const note = state.virtueNotes[noteKey] ?? "";

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Virtues</h1>
        <p className="mt-1 text-muted-foreground">
          Classical excellence and practices for eudaimonia — human flourishing.
        </p>
      </div>

      <SignInPrompt compact />

      <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/15 to-emerald-500/5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          Virtue of the Day
        </p>
        <h2 className="mt-1 text-2xl font-bold">{virtueOfDay.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {virtueOfDay.description}
        </p>
        <button
          type="button"
          onClick={() => setSelectedId(virtueOfDay.id)}
          className="mt-3 text-sm font-semibold text-teal-700 dark:text-teal-300"
        >
          Open reflections →
        </button>
      </Card>

      {VIRTUE_GROUPS.map((group) => {
        const items = VIRTUES.filter((v) => v.group === group.key).sort(
          (a, b) => a.order - b.order
        );
        if (!items.length) return null;
        return (
          <section key={group.key} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">{group.label}</h2>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition",
                    selected.id === v.id
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-border bg-card hover:border-teal-500/40"
                  )}
                >
                  <p className="font-semibold">{v.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {v.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      <Card className="space-y-4">
        <CardTitle>Reflect: {selected.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{selected.description}</p>
        <ul className="space-y-2">
          {selected.reflections.map((q) => (
            <li
              key={q}
              className="rounded-xl border border-border bg-background/60 px-3 py-2 text-sm"
            >
              {q}
            </li>
          ))}
        </ul>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="virtue-note">
            Today&apos;s notes
          </label>
          <textarea
            id="virtue-note"
            value={note}
            onChange={(e) => setVirtueNote(selected.id, e.target.value)}
            rows={4}
            placeholder="How did you practice this virtue today?"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-teal-500/30 focus:ring-2"
          />
        </div>
      </Card>
    </div>
  );
}
