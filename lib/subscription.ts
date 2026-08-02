import { prisma } from "@/lib/db";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

export interface UserSubscriptionInfo {
  hasActiveSubscription: boolean;
  activeSubscriptions: Array<{
    id: string;
    planId: string;
    planName: string;
    startDate: Date;
    expiryDate: Date;
    status: SubscriptionStatus;
  }>;
  subscribedPlanNames: string[];
}

/**
  Retrieves and evaluates user subscriptions. Automatically transitions expired active subscriptions to EXPIRED state in DB.
 */
export async function getUserSubscriptionInfo(userId?: string | null): Promise<UserSubscriptionInfo> {
  if (!userId) {
    return {
      hasActiveSubscription: false,
      activeSubscriptions: [],
      subscribedPlanNames: [],
    };
  }

  const now = new Date();

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
  }> = [];

  const subscribedPlanNames: string[] = [];

  for (const sub of subscriptions) {
    if (sub.status === "ACTIVE") {
      if (sub.expiryDate < now) {
        // Automatically expire sub in DB
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "EXPIRED" },
        });
      } else {
        activeSubscriptions.push({
          id: sub.id,
          planId: sub.planId,
          planName: sub.plan.name,
          startDate: sub.startDate,
          expiryDate: sub.expiryDate,
          status: "ACTIVE",
        });
        if (!subscribedPlanNames.includes(sub.plan.name)) {
          subscribedPlanNames.push(sub.plan.name);
        }
      }
    }
  }

  return {
    hasActiveSubscription: activeSubscriptions.length > 0,
    activeSubscriptions,
    subscribedPlanNames,
  };
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
