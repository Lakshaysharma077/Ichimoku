import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    let tools = await prisma.toolItem.findMany({
      orderBy: { sortOrder: "asc" },
    });

    if (tools.length === 0) {
      const defaultTools = [
        {
          name: "Multi-Timeframe Ichimoku Table",
          slug: "mtf-ichimoku-table",
          description: "Compact live dashboard analyzing cloud alignment across 1H, 4H, and 1D charts simultaneously.",
          badge: "POPULAR",
          accessStatus: "Premium",
          href: "/tools",
          category: "DASHBOARD",
          sortOrder: 1,
        },
        {
          name: "Kumo Twist Scanner",
          slug: "kumo-twist-scanner",
          description: "Scans watchlist symbols for upcoming cloud twists and early trend reversal signals.",
          badge: "NEW",
          accessStatus: "Beta",
          href: "/tools",
          category: "SCANNER",
          sortOrder: 2,
        },
        {
          name: "TK Cross Signal Generator",
          slug: "tk-cross-signal-generator",
          description: "Free signal verification utility for standard Tenkan-Sen / Kijun-Sen crossovers.",
          badge: "FREE",
          accessStatus: "Free",
          href: "/tools",
          category: "UTILITY",
          sortOrder: 3,
        },
      ];

      for (const t of defaultTools) {
        await prisma.toolItem.create({ data: t });
      }

      tools = await prisma.toolItem.findMany({ orderBy: { sortOrder: "asc" } });
    }

    return NextResponse.json({ tools });
  } catch (error: any) {
    console.error("TOOLS_GET_ERROR:", error);
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
    const { name, description, badge, accessStatus, href, category, sortOrder } = body;

    const validStatuses = ["Free", "Premium", "Coming Soon", "Beta", "Deprecated"];
    if (accessStatus && !validStatuses.includes(accessStatus)) {
      return NextResponse.json({ error: `Invalid accessStatus. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

    const tool = await prisma.toolItem.create({
      data: {
        name,
        slug,
        description: description || "",
        badge: badge || null,
        accessStatus: accessStatus || "Premium",
        href: href || "/tools",
        category: category || "UTILITY",
        sortOrder: sortOrder || 0,
      },
    });

    await logAuditEvent({
      action: "TOOL_CREATED",
      entity: "ToolItem",
      entityId: tool.id,
      details: { name: tool.name, accessStatus: tool.accessStatus },
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true, tool });
  } catch (error: any) {
    console.error("TOOL_CREATE_ERROR:", error);
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
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }

    const tool = await prisma.toolItem.update({
      where: { id },
      data: updates,
    });

    await logAuditEvent({
      action: "TOOL_UPDATED",
      entity: "ToolItem",
      entityId: tool.id,
      details: updates,
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true, tool });
  } catch (error: any) {
    console.error("TOOL_UPDATE_ERROR:", error);
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
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }

    await prisma.toolItem.delete({ where: { id } });

    await logAuditEvent({
      action: "TOOL_DELETED",
      entity: "ToolItem",
      entityId: id,
      details: { deletedId: id },
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("TOOL_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
