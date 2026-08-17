import { prisma } from "@/lib/db";
import { getUserSubscriptionInfo } from "./subscription";

export type AccessLevel =
  | "Guest"
  | "Registered"
  | "Pending Payment"
  | "Active Subscriber"
  | "Expired Subscriber"
  | "Cancelled Subscriber"
  | "Admin";

export interface UserAccessProfile {
  accessLevel: AccessLevel;
  role: string;
  isLoggedIn: boolean;
  canAccessPremium: boolean;
  canAccessBeta: boolean;
  unlockedPlans: string[];
  isTrial?: boolean;
  trialDaysRemaining?: number;
  hasUsedTrial?: boolean;
}

/**
 * Resolves the comprehensive access control level for a user.
 */
export async function getAccessProfile(
  userId?: string | null,
  role?: string | null
): Promise<UserAccessProfile> {
  if (!userId) {
    return {
      accessLevel: "Guest",
      role: "GUEST",
      isLoggedIn: false,
      canAccessPremium: false,
      canAccessBeta: false,
      unlockedPlans: [],
      isTrial: false,
      trialDaysRemaining: 0,
      hasUsedTrial: false,
    };
  }

  if (role === "ADMIN") {
    return {
      accessLevel: "Admin",
      role: "ADMIN",
      isLoggedIn: true,
      canAccessPremium: true,
      canAccessBeta: true,
      unlockedPlans: ["ALL"],
      isTrial: false,
      trialDaysRemaining: 0,
      hasUsedTrial: true,
    };
  }

  const subInfo = await getUserSubscriptionInfo(userId);

  if (subInfo.hasActiveSubscription) {
    return {
      accessLevel: "Active Subscriber",
      role: role || "USER",
      isLoggedIn: true,
      canAccessPremium: true,
      canAccessBeta: true,
      unlockedPlans: subInfo.subscribedPlanNames,
      isTrial: subInfo.isTrial,
      trialDaysRemaining: subInfo.trialDaysRemaining,
      hasUsedTrial: subInfo.hasUsedTrial,
    };
  }

  // Check if user has a pending payment
  const pendingPayment = await prisma.payment.findFirst({
    where: {
      userId,
      status: { in: ["Pending", "Pending Verification", "Verified"] },
    },
  });

  if (pendingPayment) {
    return {
      accessLevel: "Pending Payment",
      role: role || "USER",
      isLoggedIn: true,
      canAccessPremium: false,
      canAccessBeta: false,
      unlockedPlans: [],
      isTrial: false,
      trialDaysRemaining: 0,
      hasUsedTrial: subInfo.hasUsedTrial,
    };
  }

  // Check past subscriptions
  const lastSub = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (lastSub) {
    if (lastSub.status === "EXPIRED") {
      return {
        accessLevel: "Expired Subscriber",
        role: role || "USER",
        isLoggedIn: true,
        canAccessPremium: false,
        canAccessBeta: false,
        unlockedPlans: [],
        isTrial: false,
        trialDaysRemaining: 0,
        hasUsedTrial: subInfo.hasUsedTrial,
      };
    }
    if (lastSub.status === "CANCELLED") {
      return {
        accessLevel: "Cancelled Subscriber",
        role: role || "USER",
        isLoggedIn: true,
        canAccessPremium: false,
        canAccessBeta: false,
        unlockedPlans: [],
        isTrial: false,
        trialDaysRemaining: 0,
        hasUsedTrial: subInfo.hasUsedTrial,
      };
    }
  }

  return {
    accessLevel: "Registered",
    role: role || "USER",
    isLoggedIn: true,
    canAccessPremium: false,
    canAccessBeta: false,
    unlockedPlans: [],
    isTrial: false,
    trialDaysRemaining: 0,
    hasUsedTrial: subInfo.hasUsedTrial,
  };
}

/**
 * Checks whether an item with given access status is unlocked for the user.
 * Access Statuses: Free, Premium, Coming Soon, Beta, Deprecated
 */
export function isItemUnlocked(
  accessStatus: string,
  accessProfile: UserAccessProfile
): { isUnlocked: boolean; reason?: string } {
  if (accessProfile.accessLevel === "Admin") {
    return { isUnlocked: true };
  }

  const status = accessStatus.trim();

  if (status === "Free") {
    return { isUnlocked: true };
  }

  if (status === "Coming Soon") {
    return { isUnlocked: false, reason: "This tool is under development." };
  }

  if (status === "Deprecated") {
    return { isUnlocked: false, reason: "This tool has been deprecated." };
  }

  if (status === "Beta") {
    if (accessProfile.canAccessBeta) {
      return { isUnlocked: true };
    }
    return { isUnlocked: false, reason: "Beta tools require an active subscription." };
  }

  if (status === "Premium") {
    if (accessProfile.canAccessPremium) {
      return { isUnlocked: true };
    }
    if (!accessProfile.isLoggedIn) {
      return { isUnlocked: false, reason: "Login and active subscription required." };
    }
    return { isUnlocked: false, reason: "Active subscription required." };
  }

  return { isUnlocked: true };
}
