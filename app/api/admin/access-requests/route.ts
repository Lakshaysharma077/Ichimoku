import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";

    const whereClause: any = {};

    if (status !== "ALL") {
      if (status === "Pending") whereClause.accessStatus = "pending";
      else if (status === "Verified") whereClause.paymentStatus = "verified";
      else if (status === "Active") whereClause.accessStatus = "active";
      else if (status === "Rejected") whereClause.accessStatus = "rejected";
    }

    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { tradingViewUsername: { contains: search, mode: "insensitive" } },
        { transactionHash: { contains: search, mode: "insensitive" } },
        { productName: { contains: search, mode: "insensitive" } },
      ];
    }

    const requests = await prisma.indicatorAccessRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error("ADMIN_ACCESS_REQUESTS_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch access requests" }, { status: 500 });
  }
}
