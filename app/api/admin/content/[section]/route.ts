// ACTIVE COMPONENT VERIFIED
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { staticContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const { section } = params;
    
    const content = await prisma.contentSection.findUnique({
      where: { key: section }
    });

    let data;
    if (content) {
      data = JSON.parse(content.value);
    } else if (section in staticContent) {
      data = staticContent[section as keyof typeof staticContent];
    } else {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
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
  } catch (error: any) {
    console.error("CONTENT_POST_ERROR:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
