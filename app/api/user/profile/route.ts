import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserSubscriptionInfo } from "@/lib/subscription";
import { getAccessProfile } from "@/lib/accessControl";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: "desc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const subscriptionInfo = await getUserSubscriptionInfo(user.id);
    const accessProfile = await getAccessProfile(user.id, user.role);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        provider: user.provider,
        tradingViewUsername: user.tradingViewUsername,
        hasUsedTrial: user.hasUsedTrial,
        trialStartedAt: user.trialStartedAt,
        trialExpiresAt: user.trialExpiresAt,
        createdAt: user.createdAt,
        subscriptions: user.subscriptions,
      },
      subscriptionInfo,
      accessProfile,
      payments: user.payments,
    });
  } catch (error) {
    console.error("PROFILE_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tradingViewUsername } = await req.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { tradingViewUsername },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

