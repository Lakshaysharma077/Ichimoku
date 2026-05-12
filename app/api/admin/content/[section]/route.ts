import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const { section } = params;
    
    const content = await prisma.contentSection.findUnique({
      where: { key: section }
    });

    if (!content) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(content.value));
  } catch (error) {
    console.error("CONTENT_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section } = params;
    const body = await req.json();

    const content = await prisma.contentSection.upsert({
      where: { key: section },
      update: { value: JSON.stringify(body) },
      create: { key: section, value: JSON.stringify(body) }
    });

    // Instant Revalidation
    revalidatePath("/");
    revalidatePath("/ichimoku");
    revalidatePath("/education");
    revalidatePath("/tools");
    revalidatePath("/pricing");
    revalidatePath("/glossary");

    return NextResponse.json({ success: true, data: JSON.parse(content.value) });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
