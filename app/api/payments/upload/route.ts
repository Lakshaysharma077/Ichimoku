import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate image format
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json({ error: "Invalid file format. Please upload JPG, PNG, or WEBP." }, { status: 400 });
    }

    // Limit file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filename = `receipt-${randomUUID()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "receipts");

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(join(uploadDir, filename), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/receipts/${filename}`,
    });
  } catch (error: any) {
    console.error("PAYMENT_SCREENSHOT_UPLOAD_ERROR:", error);
    return NextResponse.json({ error: "Failed to upload screenshot" }, { status: 500 });
  }
}
