import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateTrialPeriod } from "@/lib/subscription";
import { logAuditEvent } from "@/lib/audit";
import { sendEmailNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) {
      return rateCheck.response!;
    }

    // 1. Strict Server-Side Authentication Enforcement
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Authentication required to start a free trial. Please log in or create an account.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    const sessionUserId = (session.user as any).id;
    const sessionUserEmail = session.user.email;

    if (!sessionUserId || !sessionUserEmail) {
      return NextResponse.json(
        { error: "Invalid user session. Please re-authenticate.", code: "INVALID_SESSION" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const requestedPlan = body.planName || body.plan || "Samurai";
    const rawTvUsername = body.tradingViewUsername || (session.user as any).tradingViewUsername || "";
    const cleanTvUsername = rawTvUsername ? sanitizeInput(rawTvUsername.trim()) : "";

    if (!cleanTvUsername) {
      return NextResponse.json(
        {
          error: "TradingView Username is required so we can register your account for indicator access.",
          code: "TRADINGVIEW_USERNAME_REQUIRED",
        },
        { status: 400 }
      );
    }

    // 2. Fetch user record from database by authenticated session ID (Single Source of Truth)
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      include: {
        subscriptions: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found.", code: "USER_NOT_FOUND" }, { status: 404 });
    }

    // 3. Direct Account Check: Has this account already used a trial?
    if (user.hasUsedTrial || user.trialStartedAt !== null) {
      return NextResponse.json(
        {
          error: "You have already used your 7-day free trial on this account. Free trials are limited to one per user. Please upgrade to a paid plan to continue.",
          code: "TRIAL_ALREADY_USED",
        },
        { status: 400 }
      );
    }

    // 4. Check active subscriptions and past subscription history for this user
    const now = new Date();
    const hasActiveSub = user.subscriptions.some(
      (s) => (s.status === "ACTIVE" || s.status === "TRIAL") && s.expiryDate > now
    );

    if (hasActiveSub) {
      return NextResponse.json(
        {
          error: "You already have an active subscription or trial.",
          code: "SUBSCRIPTION_ACTIVE",
        },
        { status: 400 }
      );
    }

    const hasPastTrialSub = user.subscriptions.some(
      (s) => s.isTrial || s.status === "TRIAL" || s.trialStartDate !== null
    );

    if (hasPastTrialSub) {
      // Ensure hasUsedTrial flag is set
      await prisma.user.update({
        where: { id: user.id },
        data: { hasUsedTrial: true },
      });

      return NextResponse.json(
        {
          error: "A 7-day free trial has already been used on this account. Please select a paid plan to continue.",
          code: "TRIAL_ALREADY_USED",
        },
        { status: 400 }
      );
    }

    // 5. Multi-Account Anti-Abuse Prevention:
    // Check if the TradingView username has already been linked to any trial across ALL accounts
    const normalizedTv = cleanTvUsername.toLowerCase();
    const existingTvUserWithTrial = await prisma.user.findFirst({
      where: {
        tradingViewUsername: {
          equals: normalizedTv,
          mode: "insensitive",
        },
        id: { not: user.id },
        OR: [
          { hasUsedTrial: true },
          { trialStartedAt: { not: null } },
          {
            subscriptions: {
              some: {
                OR: [{ isTrial: true }, { status: "TRIAL" }],
              },
            },
          },
        ],
      },
    });

    if (existingTvUserWithTrial) {
      return NextResponse.json(
        {
          error: `A 7-day free trial has already been redeemed for TradingView username "${cleanTvUsername}". To prevent repeated trial abuse, each TradingView username is eligible for one trial. Please choose a paid plan.`,
          code: "TRADINGVIEW_USERNAME_TRIAL_EXHAUSTED",
        },
        { status: 400 }
      );
    }

    // 6. Look up or create Plan
    const allPlans = await prisma.plan.findMany();
    let targetPlan = allPlans.find(
      (p) => p.name.toLowerCase() === requestedPlan.toLowerCase()
    );

    if (!targetPlan) {
      targetPlan = allPlans.find((p) => p.name.toLowerCase().includes("samurai")) || allPlans[0];
    }

    if (!targetPlan) {
      targetPlan = await prisma.plan.create({
        data: {
          name: "Samurai",
          price: 22.0,
          currency: "USD",
          billingCycle: "monthly",
          description: "Full access to our flagship Ichimoku Edge indicator suite.",
          includedIndicators: JSON.stringify(["1", "2", "3", "4", "5", "6", "7", "8"]),
          includedTools: JSON.stringify(["t1", "t2", "t3"]),
          isActive: true,
          sortOrder: 1,
        },
      });
    }

    // 7. Calculate exact 7-day trial period
    const { startDate, expiryDate } = calculateTrialPeriod(7);

    // 8. Create Trial Subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: targetPlan.id,
        status: "TRIAL",
        isTrial: true,
        trialStartDate: startDate,
        trialEndDate: expiryDate,
        startDate,
        expiryDate,
      },
      include: {
        plan: true,
      },
    });

    // 9. Update User with Trial and TradingView flags
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hasUsedTrial: true,
        trialStartedAt: startDate,
        trialExpiresAt: expiryDate,
        tradingViewUsername: cleanTvUsername,
      },
    });

    // 10. Audit Log
    await logAuditEvent({
      action: "TRIAL_ACTIVATED",
      entity: "Subscription",
      entityId: subscription.id,
      details: {
        plan: targetPlan.name,
        durationDays: 7,
        trialStartDate: startDate.toISOString(),
        trialExpiryDate: expiryDate.toISOString(),
        tradingViewUsername: cleanTvUsername,
      },
      userId: user.id,
    });

    // 11. Trigger Confirmation Email (non-blocking)
    const formattedStartDate = startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    sendEmailNotification({
      toEmail: user.email!,
      customerName: user.name || "Edge Trader",
      type: "trial_activated",
      tradingViewUsername: cleanTvUsername,
      plan: targetPlan.name,
      purchaseDate: formattedStartDate,
      expiryDate: formattedExpiryDate,
    }).catch((err) => console.error("Trial email notification error:", err));

    return NextResponse.json({
      success: true,
      message: "Your 7-day free trial has been activated! Website tools and scanners are now unlocked.",
      subscription: {
        id: subscription.id,
        planName: targetPlan.name,
        status: "TRIAL",
        isTrial: true,
        startDate,
        expiryDate,
        trialDaysRemaining: 7,
        tradingViewAccess: "PENDING_WHITELIST",
        websiteAccess: "ACTIVE",
      },
    });
  } catch (error: any) {
    console.error("TRIAL_ACTIVATION_ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred while activating trial." },
      { status: 500 }
    );
  }
}

