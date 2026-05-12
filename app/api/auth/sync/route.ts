import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/sync
 * Syncs a Supabase Auth user into the Prisma database.
 * Called after OAuth sign-in to ensure the user exists in our DB.
 * Also creates a hashed password placeholder so NextAuth credentials can work.
 */
export async function POST(req: Request) {
  try {
    const { email, name, image, provider, supabaseId } = await req.json();

    if (!email) {
      return new NextResponse("Missing email", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user with latest info
      const updated = await prisma.user.update({
        where: { email },
        data: {
          name: name || existingUser.name,
          image: image || existingUser.image,
          provider: provider || existingUser.provider,
        },
      });

      return NextResponse.json({
        id: updated.id,
        email: updated.email,
        synced: true,
        isNew: false,
      });
    }

    // Create new user with a deterministic password derived from supabaseId
    // This allows NextAuth credentials provider to authenticate OAuth users
    const oauthPassword = await bcrypt.hash(`__supabase_oauth__${supabaseId}`, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        image,
        password: oauthPassword,
        provider: provider || "google",
        role: "USER",
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      synced: true,
      isNew: true,
    });
  } catch (error: any) {
    console.error("SYNC_ERROR", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
