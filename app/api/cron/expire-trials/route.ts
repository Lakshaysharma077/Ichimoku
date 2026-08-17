import { NextRequest, NextResponse } from "next/server";
import { expireOutdatedTrials } from "@/lib/subscription";

export const dynamic = "force-dynamic";

/**
 * Scheduled Cron Endpoint to automatically detect and expire trials after 7 days.
 * Can be triggered via Vercel Cron, GitHub Actions, AWS EventBridge, or external webhook.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional secret check if CRON_SECRET is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const url = new URL(req.url);
      const queryKey = url.searchParams.get("key");
      if (queryKey !== cronSecret) {
        return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
      }
    }

    const result = await expireOutdatedTrials();

    return NextResponse.json({
      success: true,
      message: `Processed expired trials. ${result.expiredCount} subscriptions expired.`,
      expiredCount: result.expiredCount,
      expiredIds: result.expiredIds,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[CRON_EXPIRE_TRIALS_GET_ERROR]", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
