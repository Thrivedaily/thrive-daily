import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  LEADERBOARD_METADATA_KEY,
  parseLeaderboardStats,
  type LeaderboardEntry,
} from "@/lib/progress-cloud";

export const dynamic = "force-dynamic";

const TOP_N = 10;
const PAGE_SIZE = 100;
const MAX_PAGES = 5;

/**
 * Anonymous leaderboard from publicMetadata board stats.
 * Never returns names, emails, or Clerk user IDs to the client.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    const client = await clerkClient();

    type Row = {
      userId: string;
      lifetimePoints: number;
      level: number;
      streak: number;
    };

    const rows: Row[] = [];
    let offset = 0;

    for (let page = 0; page < MAX_PAGES; page++) {
      const list = await client.users.getUserList({
        limit: PAGE_SIZE,
        offset,
        orderBy: "-updated_at",
      });

      const batch = list.data ?? [];
      for (const user of batch) {
        const stats = parseLeaderboardStats(
          user.publicMetadata?.[LEADERBOARD_METADATA_KEY]
        );
        if (!stats || stats.lifetimePoints <= 0) continue;
        rows.push({
          userId: user.id,
          lifetimePoints: stats.lifetimePoints,
          level: stats.level,
          streak: stats.streak,
        });
      }

      if (batch.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    rows.sort((a, b) => {
      if (b.lifetimePoints !== a.lifetimePoints) {
        return b.lifetimePoints - a.lifetimePoints;
      }
      if (b.level !== a.level) return b.level - a.level;
      return b.streak - a.streak;
    });

    const top = rows.slice(0, TOP_N);
    const entries: LeaderboardEntry[] = top.map((row, i) => ({
      rank: i + 1,
      lifetimePoints: row.lifetimePoints,
      level: row.level,
      streak: row.streak,
      isYou: Boolean(userId && row.userId === userId),
    }));

    let yourRank: number | null = null;
    let yourPoints: number | null = null;
    if (userId) {
      const idx = rows.findIndex((r) => r.userId === userId);
      if (idx >= 0) {
        yourRank = idx + 1;
        yourPoints = rows[idx].lifetimePoints;
      }
    }

    return NextResponse.json({
      entries,
      yourRank,
      yourPoints,
      totalRanked: rows.length,
      limit: TOP_N,
    });
  } catch (err) {
    console.error("[leaderboard GET]", err);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
