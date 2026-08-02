import { NextRequest, NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmailNotification } from "@/lib/email";
import { prisma } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) {
      return rateCheck.response!;
    }

    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      plan,
      planId,
      amount,
      currency,
      billingPeriod,
      paymentMethod,
      network,
      walletAddressUsed,
      customerName,
      customerEmail,
      tradingViewUsername,
      country,
      txnHash,
      paymentScreenshot,
    } = body;

    // Strict input validations
    if (!plan || typeof plan !== "string") {
      return NextResponse.json({ error: "Subscription plan is required" }, { status: 400 });
    }

    if (typeof amount !== "number" || amount < 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    if (!paymentMethod || !["USDT", "USDC"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Payment method must be USDT or USDC" }, { status: 400 });
    }

    if (!customerName || typeof customerName !== "string" || customerName.trim().length === 0) {
      return NextResponse.json({ error: "Customer Name is required" }, { status: 400 });
    }

    if (!customerEmail || typeof customerEmail !== "string" || !customerEmail.includes("@")) {
      return NextResponse.json({ error: "Valid Email Address is required" }, { status: 400 });
    }

    if (!tradingViewUsername || typeof tradingViewUsername !== "string" || tradingViewUsername.trim().length === 0) {
      return NextResponse.json({ error: "TradingView Username is required" }, { status: 400 });
    }

    if (!network || typeof network !== "string") {
      return NextResponse.json({ error: "Blockchain Network is required" }, { status: 400 });
    }

    if (!walletAddressUsed || typeof walletAddressUsed !== "string") {
      return NextResponse.json({ error: "Wallet Address Used is required" }, { status: 400 });
    }

    if (!txnHash || typeof txnHash !== "string" || txnHash.trim().length === 0) {
      return NextResponse.json({ error: "Transaction Hash (TXID) is required" }, { status: 400 });
    }

    const cleanCustomerName = sanitizeInput(customerName.trim());
    const cleanCustomerEmail = customerEmail.trim().toLowerCase();
    const cleanTvUsername = sanitizeInput(tradingViewUsername.trim());
    const cleanTxnHash = txnHash.trim();

    // Look up Plan ID if planRef is available
    let dbPlanId = planId;
    if (dbPlanId) {
      const planExists = await prisma.plan.findUnique({ where: { id: dbPlanId } });
      if (!planExists) dbPlanId = null;
    }
    if (!dbPlanId) {
      const allPlans = await prisma.plan.findMany();
      const dbPlan = allPlans.find((p) => p.name.toLowerCase() === plan.toLowerCase());
      if (dbPlan) dbPlanId = dbPlan.id;
    }

    const gateway = getPaymentGateway();
    const result = await gateway.createPayment({
      plan,
      amount,
      currency: currency || "USD",
      billingPeriod: billingPeriod === "yearly" ? "yearly" : "monthly",
      paymentMethod,
      network,
      walletAddressUsed,
      customerName: cleanCustomerName,
      customerEmail: cleanCustomerEmail,
      tradingViewUsername: cleanTvUsername,
      country: country ? sanitizeInput(country.trim()) : undefined,
      txnHash: cleanTxnHash,
      userId: (session?.user as any)?.id || undefined,
    });

    if (!result.success || !result.paymentId) {
      return NextResponse.json({ error: result.message || "Failed to create payment" }, { status: 500 });
    }

    const initialVerification = {
      isVerified: false,
      statusText: "NOT_VERIFIED" as const,
      amountReceived: 0,
      recipientWallet: walletAddressUsed,
      confirmationCount: 0,
      failureReason: "Payment request submitted. Awaiting blockchain verification.",
      verifiedAt: new Date().toISOString(),
    };

    // Update payment record to "Pending Verification" status
    await prisma.payment.update({
      where: { id: result.paymentId },
      data: {
        status: "Pending Verification",
        planId: dbPlanId || null,
        paymentScreenshot: paymentScreenshot?.trim() || null,
        verificationStatus: "NOT_VERIFIED",
        verificationResult: JSON.stringify(initialVerification),
      },
    });

    // Audit Log
    await logAuditEvent({
      action: "PAYMENT_SUBMITTED",
      entity: "Payment",
      entityId: result.paymentId,
      details: {
        plan,
        amount,
        paymentMethod,
        network,
        tradingViewUsername: cleanTvUsername,
        txnHash: cleanTxnHash,
      },
      userId: (session?.user as any)?.id || null,
    });

    // Trigger Payment Submitted Email to USER
    sendEmailNotification({
      toEmail: cleanCustomerEmail,
      customerName: cleanCustomerName,
      type: "payment_submitted",
      tradingViewUsername: cleanTvUsername,
      plan,
      amount,
      currency: currency || "USD",
      paymentMethod,
      network,
      paymentId: result.paymentId,
    }).catch((err) => console.error("Payment submitted email error:", err));

    // Trigger Alert Email to ADMIN
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.SUPPORT_EMAIL || "admin@ichimokuedge.com";
    sendEmailNotification({
      toEmail: adminEmail,
      customerName: cleanCustomerName,
      type: "admin_new_payment",
      tradingViewUsername: cleanTvUsername,
      plan,
      amount,
      currency: currency || "USD",
      paymentMethod,
      network,
      paymentId: result.paymentId,
    }).catch((err) => console.error("Admin payment alert email error:", err));

    return NextResponse.json({
      success: true,
      paymentId: result.paymentId,
      status: "Pending Verification",
      verification: initialVerification,
      message: "Payment request submitted successfully. Our team is verifying your on-chain transfer.",
    });
  } catch (error: any) {
    console.error("PAYMENT_CREATE_API_ERROR:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
