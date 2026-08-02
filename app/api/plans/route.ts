import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { sortOrder: "asc" },
    });

    // If database is empty, seed default plans dynamically
    if (plans.length === 0) {
      const defaultPlans = [
        {
          name: "Pro Pass",
          price: 29.0,
          currency: "USD",
          billingCycle: "monthly",
          description: "Full access to our flagship Ichimoku Edge indicator suite, multi-timeframe tables, and active signal scanners.",
          includedIndicators: JSON.stringify(["1", "2", "5", "8"]),
          includedTools: JSON.stringify(["t1", "t2"]),
          isActive: true,
          sortOrder: 1,
        },
        {
          name: "Annual Samurai Pass",
          price: 269.0,
          currency: "USD",
          billingCycle: "yearly",
          description: "Save 25% with annual access. Unlocks the entire indicator suite, private Discord signals, and beta tools.",
          includedIndicators: JSON.stringify(["1", "2", "3", "4", "5", "6", "7", "8"]),
          includedTools: JSON.stringify(["t1", "t2", "t3"]),
          isActive: true,
          sortOrder: 2,
        },
      ];

      for (const p of defaultPlans) {
        await prisma.plan.create({ data: p });
      }

      const seededPlans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });
      return NextResponse.json({ plans: seededPlans });
    }

    return NextResponse.json({ plans });
  } catch (error: any) {
    console.error("PLANS_GET_ERROR:", error);
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
    const { name, price, currency, billingCycle, description, includedIndicators, includedTools, isActive, sortOrder } = body;

    if (!name || typeof price !== "number") {
      return NextResponse.json({ error: "Name and numeric price are required" }, { status: 400 });
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        price,
        currency: currency || "USD",
        billingCycle: billingCycle || "monthly",
        description: description || "",
        includedIndicators: typeof includedIndicators === "string" ? includedIndicators : JSON.stringify(includedIndicators || []),
        includedTools: typeof includedTools === "string" ? includedTools : JSON.stringify(includedTools || []),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder || 0,
      },
    });

    await logAuditEvent({
      action: "PLAN_CREATED",
      entity: "Plan",
      entityId: plan.id,
      details: { name: plan.name, price: plan.price },
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error("PLAN_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
