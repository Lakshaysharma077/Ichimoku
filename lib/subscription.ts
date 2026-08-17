import { prisma } from "@/lib/db";
import { sendEmailNotification } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIAL"
  | "EXPIRED"
  | "PAYMENT_REQUIRED"
  | "CANCELLED"
  | "PENDING";

export interface UserSubscriptionInfo {
  hasActiveSubscription: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  trialStartDate?: Date | null;
  trialEndDate?: Date | null;
  hasUsedTrial: boolean;
  activeSubscriptions: Array<{
    id: string;
    planId: string;
    planName: string;
    startDate: Date;
    expiryDate: Date;
    status: SubscriptionStatus;
    isTrial: boolean;
    daysRemaining: number;
  }>;
  subscribedPlanNames: string[];
  latestSubscription?: {
    id: string;
    planName: string;
    status: SubscriptionStatus;
    isTrial: boolean;
    startDate: Date;
    expiryDate: Date;
    daysRemaining: number;
  } | null;
}

/**
 * System-wide trial expiration engine.
 * Automatically transitions all expired trials to EXPIRED/PAYMENT_REQUIRED and sends trial_expired email exactly once.
 */
export async function expireOutdatedTrials(): Promise<{ expiredCount: number; expiredIds: string[] }> {
  const now = new Date();
  const expiredIds: string[] = [];

  try {
    // Find all trial subscriptions whose expiration date has passed
    const expiredTrials = await prisma.subscription.findMany({
      where: {
        OR: [
          { status: "TRIAL" },
          { isTrial: true, status: { in: ["ACTIVE", "TRIAL"] } },
        ],
        expiryDate: { lte: now },
      },
      include: {
        user: true,
        plan: true,
      },
    });

    for (const sub of expiredTrials) {
      // 1. Update subscription status to EXPIRED
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: "EXPIRED" },
      });

      expiredIds.push(sub.id);

      // 2. Check if expiration email was already sent (strictly exactly-once guarantee)
      const alreadySent = await prisma.auditLog.findFirst({
        where: {
          action: "TRIAL_EXPIRED_EMAIL_SENT",
          entityId: sub.id,
        },
      });

      if (!alreadySent && sub.user?.email) {
        try {
          const formattedExpiry = new Date(sub.expiryDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          await sendEmailNotification({
            toEmail: sub.user.email,
            customerName: sub.user.name || "Edge Trader",
            type: "trial_expired",
            plan: sub.plan.name,
            tradingViewUsername: sub.user.tradingViewUsername || undefined,
            expiryDate: formattedExpiry,
          });

          await logAuditEvent({
            action: "TRIAL_EXPIRED_EMAIL_SENT",
            entity: "Subscription",
            entityId: sub.id,
            details: {
              email: sub.user.email,
              plan: sub.plan.name,
              expiredAt: now.toISOString(),
            },
            userId: sub.userId,
          });
        } catch (emailErr) {
          console.error(`[CRON/TRIAL_EXPIRATION] Failed to send trial_expired email to ${sub.user.email}:`, emailErr);
        }
      }
    }
  } catch (err) {
    console.error("[CRON/TRIAL_EXPIRATION_ERROR]", err);
  }

  return { expiredCount: expiredIds.length, expiredIds };
}

/**
 * Retrieves and evaluates user subscriptions. Automatically transitions expired active/trial subscriptions to EXPIRED state in DB.
 */
export async function getUserSubscriptionInfo(userId?: string | null): Promise<UserSubscriptionInfo> {
  if (!userId) {
    return {
      hasActiveSubscription: false,
      isTrial: false,
      trialDaysRemaining: 0,
      hasUsedTrial: false,
      activeSubscriptions: [],
      subscribedPlanNames: [],
      latestSubscription: null,
    };
  }

  const now = new Date();

  // Run auto-expiration check to keep database and emails fully synchronized
  await expireOutdatedTrials();

  // Fetch user details for trial flag
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hasUsedTrial: true,
      trialStartedAt: true,
      trialExpiresAt: true,
    },
  });

  // Fetch all user subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  const activeSubscriptions: Array<{
    id: string;
    planId: string;
    planName: string;
    startDate: Date;
    expiryDate: Date;
    status: SubscriptionStatus;
    isTrial: boolean;
    daysRemaining: number;
  }> = [];

  const subscribedPlanNames: string[] = [];
  let isTrialActive = false;
  let trialDaysRemaining = 0;
  let trialStartDate: Date | null = user?.trialStartedAt || null;
  let trialEndDate: Date | null = user?.trialExpiresAt || null;

  for (const sub of subscriptions) {
    const isSubTrial = sub.isTrial || sub.status === "TRIAL";

    if (sub.status === "ACTIVE" || sub.status === "TRIAL") {
      if (sub.expiryDate <= now) {
        // Automatically mark EXPIRED
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "EXPIRED" },
        });
      } else {
        const daysRemaining = Math.max(
          0,
          Math.ceil((new Date(sub.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        );

        const currentSubStatus: SubscriptionStatus = isSubTrial ? "TRIAL" : "ACTIVE";

        if (isSubTrial) {
          isTrialActive = true;
          trialDaysRemaining = daysRemaining;
          trialStartDate = sub.trialStartDate || sub.startDate;
          trialEndDate = sub.trialEndDate || sub.expiryDate;
        }

        activeSubscriptions.push({
          id: sub.id,
          planId: sub.planId,
          planName: sub.plan.name,
          startDate: sub.startDate,
          expiryDate: sub.expiryDate,
          status: currentSubStatus,
          isTrial: isSubTrial,
          daysRemaining,
        });

        if (!subscribedPlanNames.includes(sub.plan.name)) {
          subscribedPlanNames.push(sub.plan.name);
        }
      }
    }
  }

  // Derive latest subscription summary
  const latestSubRecord = subscriptions[0];
  let latestSubscription = null;
  if (latestSubRecord) {
    const isSubTrial = latestSubRecord.isTrial || latestSubRecord.status === "TRIAL";
    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(latestSubRecord.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
    latestSubscription = {
      id: latestSubRecord.id,
      planName: latestSubRecord.plan.name,
      status: (latestSubRecord.expiryDate <= now && (latestSubRecord.status === "ACTIVE" || latestSubRecord.status === "TRIAL")
        ? "EXPIRED"
        : latestSubRecord.status) as SubscriptionStatus,
      isTrial: isSubTrial,
      startDate: latestSubRecord.startDate,
      expiryDate: latestSubRecord.expiryDate,
      daysRemaining,
    };
  }

  return {
    hasActiveSubscription: activeSubscriptions.length > 0,
    isTrial: isTrialActive,
    trialDaysRemaining,
    trialStartDate,
    trialEndDate,
    hasUsedTrial: Boolean(user?.hasUsedTrial || subscriptions.some((s) => s.isTrial || s.status === "TRIAL")),
    activeSubscriptions,
    subscribedPlanNames,
    latestSubscription,
  };
}

/**
 * Computes 7-day trial start and expiry dates.
 */
export function calculateTrialPeriod(days: number = 7) {
  const startDate = new Date();
  const expiryDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
  return { startDate, expiryDate };
}

/**
 * Computes subscription start and expiry dates based on billing cycle.
 */
export function calculateSubscriptionPeriod(billingCycle: string = "monthly") {
  const startDate = new Date();
  const expiryDate = new Date(startDate);

  if (billingCycle === "yearly") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else if (billingCycle === "lifetime") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 100);
  } else {
    // Default monthly (30 days)
    expiryDate.setDate(expiryDate.getDate() + 30);
  }

  return { startDate, expiryDate };
}


