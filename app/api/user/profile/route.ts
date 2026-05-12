import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tradingViewUsername } = await req.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { tradingViewUsername }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
