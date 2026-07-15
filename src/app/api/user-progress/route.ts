import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  LEADERBOARD_METADATA_KEY,
  PROGRESS_METADATA_KEY,
  buildCloudPayload,
  buildLeaderboardStats,
  normalizeAppState,
  parseCloudPayload,
  type CloudProgressPayload,
} from "@/lib/progress-cloud";

export const dynamic = "force-dynamic";

/**
 * Full progress → privateMetadata (server-only).
 * Board stats → publicMetadata (anonymous ranking only).
 */

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const raw = user.privateMetadata?.[PROGRESS_METADATA_KEY];
    const payload = parseCloudPayload(raw);

    // Backfill anonymous board stats if full progress exists but board is missing
    if (payload?.state) {
      const hasBoard = Boolean(
        user.publicMetadata?.[LEADERBOARD_METADATA_KEY]
      );
      if (!hasBoard) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            [LEADERBOARD_METADATA_KEY]: buildLeaderboardStats(payload.state),
          },
        });
      }
    }

    return NextResponse.json({
      progress: payload,
      empty: !payload,
    });
  } catch (err) {
    console.error("[user-progress GET]", err);
    return NextResponse.json(
      { error: "Failed to load progress" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const stateRaw =
    body && typeof body === "object" && "state" in body
      ? (body as { state: unknown }).state
      : body;

  const state = normalizeAppState(stateRaw);
  const payload = buildCloudPayload(state);
  const board = buildLeaderboardStats(state);

  const serialized = JSON.stringify(payload);
  if (serialized.length > 7500) {
    return NextResponse.json(
      {
        error:
          "Progress payload too large. Older history was pruned; try again.",
      },
      { status: 413 }
    );
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        [PROGRESS_METADATA_KEY]: payload,
      },
      publicMetadata: {
        [LEADERBOARD_METADATA_KEY]: board,
      },
    });

    return NextResponse.json({
      ok: true,
      progress: payload as CloudProgressPayload,
      board,
    });
  } catch (err) {
    console.error("[user-progress PUT]", err);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
