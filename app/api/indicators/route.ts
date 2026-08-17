import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { seedIndicators } from "@/lib/indicators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    let indicators = await prisma.indicatorItem.findMany({
      orderBy: { sortOrder: "asc" },
    });

    if (indicators.length === 0) {
      // Seed default indicators from lib/indicators.ts into DB
      for (const ind of seedIndicators) {
        const accessStatus =
          ind.badgeType === "FREE"
            ? "Free"
            : ind.badgeType === "7-DAY TRIAL" || (ind.badgeType as any) === "14-DAY TRIAL"
            ? "Beta"
            : "Premium";

        await prisma.indicatorItem.create({
          data: {
            id: ind.id,
            name: ind.name,
            slug: ind.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: ind.description,
            accessStatus,
            priceLabel: ind.price,
            tvUrl: ind.tvUrl,
            category: JSON.stringify(ind.category),
            sortOrder: ind.sortOrder,
            rating: ind.rating,
            numRatings: ind.numRatings,
          },
        });
      }

      indicators = await prisma.indicatorItem.findMany({
        orderBy: { sortOrder: "asc" },
      });
    }

    return NextResponse.json({ indicators });
  } catch (error: any) {
    console.error("INDICATORS_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, accessStatus, priceLabel, tvUrl, category, sortOrder } = body;

    const validStatuses = ["Free", "Premium", "Coming Soon", "Beta", "Deprecated"];
    if (accessStatus && !validStatuses.includes(accessStatus)) {
      return NextResponse.json({ error: `Invalid accessStatus. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

    const indicator = await prisma.indicatorItem.create({
      data: {
        name,
        slug,
        description: description || "",
        accessStatus: accessStatus || "Premium",
        priceLabel: priceLabel || "$22/mo",
        tvUrl: tvUrl || "",
        category: typeof category === "string" ? category : JSON.stringify(category || ["ICHIMOKU"]),
        sortOrder: sortOrder || 0,
      },
    });

    await logAuditEvent({
      action: "INDICATOR_CREATED",
      entity: "IndicatorItem",
      entityId: indicator.id,
      details: { name: indicator.name, accessStatus: indicator.accessStatus },
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true, indicator });
  } catch (error: any) {
    console.error("INDICATOR_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Indicator ID is required" }, { status: 400 });
    }

    if (updates.category && typeof updates.category !== "string") {
      updates.category = JSON.stringify(updates.category);
    }

    const indicator = await prisma.indicatorItem.update({
      where: { id },
      data: updates,
    });

    await logAuditEvent({
      action: "INDICATOR_UPDATED",
      entity: "IndicatorItem",
      entityId: indicator.id,
      details: updates,
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true, indicator });
  } catch (error: any) {
    console.error("INDICATOR_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Indicator ID is required" }, { status: 400 });
    }

    await prisma.indicatorItem.delete({ where: { id } });

    await logAuditEvent({
      action: "INDICATOR_DELETED",
      entity: "IndicatorItem",
      entityId: id,
      details: { deletedId: id },
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("INDICATOR_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
