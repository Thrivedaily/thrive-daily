"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { DreamSaferText } from "@/components/ui/dreamsafer-text";

export function CheckboxRow({
  checked,
  onToggle,
  title,
  subtitle,
  points,
  href,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  points?: number;
  href?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-background/60 p-3 transition",
        checked && "border-teal-500/40 bg-teal-500/5"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        aria-label={checked ? `Uncheck ${title}` : `Check ${title}`}
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition",
          checked
            ? "border-teal-500 bg-teal-500 text-white"
            : "border-muted-foreground/30 hover:border-teal-500/60"
        )}
      >
        {checked && <Check className="h-4 w-4" strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-medium leading-snug text-foreground",
              checked && "text-muted-foreground line-through decoration-teal-500/50"
            )}
          >
            <DreamSaferText text={title} />
          </p>
          {typeof points === "number" && (
            <span
              className={
                points >= 20
                  ? "shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400"
                  : "shrink-0 rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300"
              }
            >
              +{points}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
        {href && (
          <a
            href={href}
            className="mt-1 inline-block text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Science & how-to →
          </a>
        )}
      </div>
    </div>
  );
}
