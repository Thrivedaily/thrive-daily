"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { formatPoints, type LeaderboardEntry } from "@/lib/progress-cloud";
import { cn } from "@/lib/cn";

type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  yourRank: number | null;
  yourPoints: number | null;
  totalRanked: number;
};

export function LeaderboardWidget({
  className,
  embedded = false,
}: {
  className?: string;
  /** Inline style for use inside Daily Score card */
  embedded?: boolean;
}) {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(false);
      const res = await fetch("/api/leaderboard", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("failed");
      const json = (await res.json()) as LeaderboardResponse;
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 60_000);
    return () => clearInterval(id);
  }, [load]);

  const previewCount = embedded ? 5 : 5;
  const entries = data?.entries ?? [];
  const visible = expanded ? entries : entries.slice(0, previewCount);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-500/8 via-background/80 to-emerald-500/5",
        !embedded &&
          "w-[min(100%,15.5rem)] rounded-2xl border-border bg-card/95 shadow-md shadow-teal-500/5 backdrop-blur",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 text-left transition hover:bg-teal-500/5",
          embedded ? "px-3 py-2" : "px-3 py-2.5"
        )}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-300">
            <Trophy className="h-3.5 w-3.5" />
          </span>
          <span>
            <span className="block text-xs font-semibold tracking-tight text-teal-800 dark:text-teal-200">
              Leaderboard
            </span>
            <span className="block text-[10px] text-muted-foreground">
              Top thrivers · anonymous
            </span>
          </span>
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "border-t border-teal-500/15",
          embedded ? "px-2 pb-2 pt-1" : "px-2.5 pb-2.5 pt-1.5"
        )}
      >
        {loading && (
          <p className="px-1 py-2 text-[11px] text-muted-foreground">
            Loading ranks…
          </p>
        )}
        {error && !loading && (
          <p className="px-1 py-2 text-[11px] text-amber-600 dark:text-amber-400">
            Couldn&apos;t load board
          </p>
        )}
        {!loading && !error && entries.length === 0 && (
          <p className="px-1 py-2 text-[11px] text-muted-foreground">
            Be the first on the board — check a protocol today.
          </p>
        )}
        {!loading && entries.length > 0 && (
          <ul className="space-y-0.5">
            {visible.map((row) => (
              <li
                key={row.rank}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2 py-1.5 text-xs",
                  row.isYou
                    ? "bg-teal-500/15 font-medium text-teal-800 dark:text-teal-200"
                    : "text-foreground/90"
                )}
              >
                <span className="tabular-nums text-muted-foreground">
                  #{row.rank}
                  {row.isYou ? (
                    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-300">
                      you
                    </span>
                  ) : null}
                </span>
                <span className="tabular-nums font-semibold">
                  {formatPoints(row.lifetimePoints)}{" "}
                  <span className="text-[10px] font-medium text-muted-foreground">
                    pts
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}

        {expanded && data && (
          <div className="mt-2 space-y-1 border-t border-teal-500/15 px-1 pt-2 text-[10px] text-muted-foreground">
            {data.yourRank != null && data.yourPoints != null ? (
              <p>
                Your rank:{" "}
                <span className="font-semibold text-foreground">
                  #{data.yourRank}
                </span>{" "}
                · {formatPoints(data.yourPoints)} pts
              </p>
            ) : (
              <p>Sign in &amp; earn points to join the board.</p>
            )}
            {data.totalRanked > 0 && (
              <p>
                {data.totalRanked} thriver
                {data.totalRanked === 1 ? "" : "s"} ranked
              </p>
            )}
          </div>
        )}

        {!expanded && entries.length > previewCount && (
          <p className="mt-1 px-1 text-center text-[10px] text-muted-foreground">
            Tap to show top {entries.length}
          </p>
        )}
      </div>
    </div>
  );
}
