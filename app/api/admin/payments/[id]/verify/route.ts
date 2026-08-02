import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyCryptoTransaction } from "@/lib/payments";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const adminUserId = (session.user as any).id;
    const { id } = params;
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const verification = await verifyCryptoTransaction({
      id: payment.id,
      txnHash: payment.txnHash,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      network: payment.network,
      walletAddressUsed: payment.walletAddressUsed,
      paymentScreenshot: payment.paymentScreenshot,
    });

    const isVerified = verification.statusText === "VERIFIED" && verification.isVerified;
    const newPaymentStatus = isVerified ? "Verified" : payment.status;

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: newPaymentStatus,
        verificationStatus: verification.statusText,
        verificationResult: JSON.stringify(verification),
      },
    });

    await logAuditEvent({
      action: "PAYMENT_VERIFIED_ONCHAIN",
      entity: "Payment",
      entityId: payment.id,
      details: {
        verificationStatus: verification.statusText,
        isVerified,
        confirmationCount: verification.confirmationCount,
        amountReceived: verification.amountReceived,
      },
      userId: adminUserId,
    });

    return NextResponse.json({
      success: true,
      verification,
      payment: updatedPayment,
    });
  } catch (error: any) {
    console.error("ADMIN_PAYMENT_VERIFY_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
