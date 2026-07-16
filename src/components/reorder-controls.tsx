"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function ReorderControls({
  onUp,
  onDown,
  onRemove,
  canUp,
  canDown,
  className,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove?: () => void;
  canUp: boolean;
  canDown: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center gap-0.5", className)}>
      <button
        type="button"
        onClick={onUp}
        disabled={!canUp}
        aria-label="Move up"
        className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={!canDown}
        aria-label="Move down"
        className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove custom item"
          className="rounded-md p-1 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
