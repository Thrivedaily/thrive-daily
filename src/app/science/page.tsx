"use client";

import Link from "next/link";
import { CATEGORIES, HABITS } from "@/data/habits";
import { Card } from "@/components/ui/card";
import { DreamSaferText } from "@/components/ui/dreamsafer-text";

export default function ScienceIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Science</h1>
        <p className="mt-1 text-muted-foreground">
          How to do each habit, why it matters, and the research behind it.
        </p>
      </div>

      {CATEGORIES.map((cat) => {
        const habits = HABITS.filter((h) => h.categoryKey === cat.key).sort(
          (a, b) => a.order - b.order
        );
        if (!habits.length) return null;
        return (
          <section key={cat.key} className="space-y-2">
            <h2 className="text-lg font-semibold">
              {cat.emoji} {cat.label}
            </h2>
            <div className="grid gap-2">
              {habits.map((h) => (
                <Link key={h.id} href={`/science/${h.id}`}>
                  <Card className="flex items-center justify-between gap-3 transition hover:border-teal-500/40">
                    <div className="min-w-0">
                      <p className="font-medium">
                        <DreamSaferText text={h.name} />
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {h.howTo || h.whyImportant || "View science details"}
                      </p>
                    </div>
                    <span
                      className={
                        h.points >= 20
                          ? "shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400"
                          : "shrink-0 rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300"
                      }
                    >
                      +{h.points}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
