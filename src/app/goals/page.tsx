"use client";

import { Compass, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TOUCHSTONES, TOUCHSTONES_INTRO } from "@/data/touchstones";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { SignInPrompt } from "@/components/sign-in-prompt";

export default function GoalsPage() {
  const { state, hydrated, toggleTouchstone } = useAppStore();

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  const doneMap = state.touchstoneDoneToday || {};
  const doneCount = TOUCHSTONES.filter((t) => doneMap[t.id]).length;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20">
          <Compass className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Daily Touchstones
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {TOUCHSTONES_INTRO}
        </p>
      </div>

      <SignInPrompt compact />

      <Card className="border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-emerald-500/5 px-3 py-2.5">
        <p className="text-xs text-muted-foreground sm:text-sm">
          Check each as you honor it today ·{" "}
          <span className="font-semibold text-foreground">
            {doneCount}/{TOUCHSTONES.length}
          </span>{" "}
          · resets at midnight
        </p>
      </Card>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {TOUCHSTONES.map((item) => {
          const checked = !!doneMap[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleTouchstone(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition hover:bg-muted/50",
                  checked && "bg-teal-500/5"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                    checked
                      ? "border-teal-500 bg-teal-500 text-white"
                      : "border-muted-foreground/30"
                  )}
                  aria-hidden
                >
                  {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-medium leading-snug",
                      checked &&
                        "text-muted-foreground line-through decoration-teal-500/40"
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground line-clamp-1">
                    {item.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
