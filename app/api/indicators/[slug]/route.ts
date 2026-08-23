import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "ADMIN";

    // Find by slug first, or by id as fallback
    let indicator = await prisma.indicatorItem.findUnique({
      where: { slug },
    });

    if (!indicator) {
      indicator = await prisma.indicatorItem.findUnique({
        where: { id: slug },
      });
    }

    if (!indicator) {
      return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
    }

    if (indicator.status === "Draft" && !isAdmin) {
      return NextResponse.json({ error: "Indicator not published" }, { status: 403 });
    }

    return NextResponse.json({ indicator });
  } catch (error: any) {
    console.error("INDICATOR_GET_BY_SLUG_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
