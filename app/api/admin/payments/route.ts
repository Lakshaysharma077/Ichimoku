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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const month = searchParams.get("month");

    const whereClause: any = {};

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (month && month !== "ALL") {
      const [yearStr, monthStr] = month.split("-");
      const year = parseInt(yearStr);
      const mIndex = parseInt(monthStr) - 1;
      if (!isNaN(year) && !isNaN(mIndex)) {
        const startDate = new Date(Date.UTC(year, mIndex, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, mIndex + 1, 0, 23, 59, 59, 999));
        whereClause.createdAt = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    if (search && search.trim().length > 0) {
      const query = search.trim();
      whereClause.OR = [
        { customerName: { contains: query } },
        { customerEmail: { contains: query } },
        { tradingViewUsername: { contains: query } },
        { plan: { contains: query } },
        { txnHash: { contains: query } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Also get summary counts for admin metrics
    const stats = {
      total: await prisma.payment.count(),
      pending: await prisma.payment.count({ where: { status: "Pending" } }),
      approved: await prisma.payment.count({ where: { status: "Approved" } }),
      rejected: await prisma.payment.count({ where: { status: "Rejected" } }),
      refunded: await prisma.payment.count({ where: { status: "Refunded" } }),
    };

    return NextResponse.json({
      success: true,
      payments,
      stats,
    });
  } catch (error: any) {
    console.error("ADMIN_PAYMENTS_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
