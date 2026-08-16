import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const startTime = Date.now();

  try {
    // Perform a lightweight database query to keep Supabase active
    await prisma.$queryRaw`SELECT 1;`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "ok",
        message: "Database connection active",
        timestamp: new Date().toISOString(),
        latencyMs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[KEEP_ALIVE_ERROR]", error);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "error",
        message: "Database ping failed",
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
        latencyMs,
      },
      { status: 500 }
    );
  }
}
