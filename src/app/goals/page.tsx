"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Check, Compass, Pencil, Plus, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { TOUCHSTONES_INTRO } from "@/data/touchstones";
import { ReorderControls } from "@/components/reorder-controls";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function GoalsPage() {
  const { isSignedIn } = useAuth();
  const {
    state,
    hydrated,
    touchstonesCatalog,
    toggleTouchstone,
    reorderTouchstone,
    addCustomTouchstone,
    removeCustomTouchstone,
  } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const doneMap = state.touchstoneDoneToday || {};
  const doneCount = touchstonesCatalog.filter((t) => doneMap[t.id]).length;
  const flatIds = useMemo(
    () => touchstonesCatalog.map((t) => t.id),
    [touchstonesCatalog]
  );

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  function submitAdd() {
    addCustomTouchstone({ title, description });
    setTitle("");
    setDescription("");
    setShowAdd(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
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
                Add
              </button>
            )}
          </div>
        ) : null}
      </div>

      <SignInPrompt compact />

      {showAdd && isSignedIn && (
        <Card className="space-y-3 border-teal-500/30">
          <CardTitle className="text-base">Add touchstone</CardTitle>
          <label className="block space-y-1 text-xs font-medium">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
              placeholder="e.g. Call a friend"
            />
          </label>
          <label className="block space-y-1 text-xs font-medium">
            Description (optional)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-teal-500/40 focus:ring-2"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitAdd}
              disabled={!title.trim()}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Save
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

      <Card className="border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-emerald-500/5 px-3 py-2.5">
        <p className="text-xs text-muted-foreground sm:text-sm">
          Check each as you honor it today ·{" "}
          <span className="font-semibold text-foreground">
            {doneCount}/{touchstonesCatalog.length}
          </span>{" "}
          · resets at midnight
        </p>
      </Card>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {touchstonesCatalog.map((item) => {
          const checked = !!doneMap[item.id];
          const idx = flatIds.indexOf(item.id);
          return (
            <li key={item.id}>
              <div className="flex items-center gap-0.5">
                {editing && isSignedIn ? (
                  <ReorderControls
                    className="pl-1"
                    canUp={idx > 0}
                    canDown={idx >= 0 && idx < flatIds.length - 1}
                    onUp={() => reorderTouchstone(item.id, "up")}
                    onDown={() => reorderTouchstone(item.id, "down")}
                    onRemove={
                      item.isCustom
                        ? () => {
                            if (confirm(`Remove “${item.title}”?`)) {
                              removeCustomTouchstone(item.id);
                            }
                          }
                        : undefined
                    }
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => toggleTouchstone(item.id)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-left transition hover:bg-muted/50",
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
                      {item.isCustom ? (
                        <span className="ml-1.5 text-[10px] font-semibold uppercase text-teal-600">
                          custom
                        </span>
                      ) : null}
                    </span>
                    {item.description ? (
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground line-clamp-1">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
