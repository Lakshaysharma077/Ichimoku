import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const totalPaymentsCount = await prisma.payment.count();
    const pendingPaymentsCount = await prisma.payment.count({ where: { status: "Pending" } });
    const verifiedPaymentsCount = await prisma.payment.count({ where: { status: "Verified" } });
    const approvedPaymentsCount = await prisma.payment.count({ where: { status: "Approved" } });
    const rejectedPaymentsCount = await prisma.payment.count({ where: { status: "Rejected" } });
    const refundedPaymentsCount = await prisma.payment.count({ where: { status: "Refunded" } });

    const activeSubscriptionsCount = await prisma.subscription.count({ where: { status: "ACTIVE" } });
    const expiredSubscriptionsCount = await prisma.subscription.count({ where: { status: "EXPIRED" } });

    const openSupportTicketsCount = await prisma.supportTicket.count({ where: { status: "OPEN" } });

    // Calculate total revenue from approved payments
    const revenueSum = await prisma.payment.aggregate({
      where: { status: "Approved" },
      _sum: { amount: true },
    });

    const totalRevenue = revenueSum._sum.amount || 0;

    return NextResponse.json({
      analytics: {
        totalRevenue,
        totalPaymentsCount,
        pendingPaymentsCount,
        verifiedPaymentsCount,
        approvedPaymentsCount,
        rejectedPaymentsCount,
        refundedPaymentsCount,
        activeSubscriptionsCount,
        expiredSubscriptionsCount,
        openSupportTicketsCount,
      },
    });
  } catch (error: any) {
    console.error("ADMIN_ANALYTICS_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
