import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (using env vars directly)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, name, tradingViewUsername } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // 1. Create user in Supabase Auth (no email verification)
    const { data: supabaseData, error: supabaseError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || '',
          trading_view_username: tradingViewUsername || '',
        },
      },
    });

    if (supabaseError) {
      console.error("SUPABASE_SIGNUP_ERROR", supabaseError);
      // Continue even if Supabase fails — Prisma is the primary store
    }

    // 2. Create user in Prisma (primary database)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        tradingViewUsername,
        provider: "credentials",
        role: "USER"
      }
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
