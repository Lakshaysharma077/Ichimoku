import { NextRequest, NextResponse } from "next/server";
import {
  getPaymentGateway,
  isSupportedPaymentCombination,
  getOfficialDepositAddress,
  getOfficialPlanPrice,
  NetworkId,
  PaymentMethod,
} from "@/lib/payments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmailNotification } from "@/lib/email";
import { prisma } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/security";

export const dynamic = "force-dynamic";

// Normalizes network string to NetworkId
function normalizeNetworkId(net: string): NetworkId | null {
  const s = net.toLowerCase().trim();
  if (s.includes("arbitrum")) return "arbitrum";
  if (s.includes("ethereum") || s.includes("erc-20") || s.includes("erc20")) return "ethereum";
  if (s.includes("avalanche") || s.includes("avax") || s.includes("c-chain")) return "avalanche";
  if (s.includes("tron") || s.includes("trc-20") || s.includes("trc20")) return "trc20";
  if (s.includes("solana") || s.includes("spl")) return "solana";
  return null;
}

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

    const period: "monthly" | "yearly" = billingPeriod === "yearly" ? "yearly" : "monthly";
    const expectedAmount = getOfficialPlanPrice(plan, period);

    // Server-side amount validation: Validate that amount matches official pricing ($22 / $220)
    if (typeof amount !== "number" || Math.abs(amount - expectedAmount) > 0.01) {
      return NextResponse.json(
        { error: `Invalid payment amount. Expected $${expectedAmount} USD for ${plan} (${period}).` },
        { status: 400 }
      );
    }

    if (!paymentMethod || !["USDT", "USDC"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Payment method must be USDT or USDC" }, { status: 400 });
    }

    const normalizedNetId = normalizeNetworkId(network);
    if (!normalizedNetId) {
      return NextResponse.json({ error: "Unsupported blockchain network selected" }, { status: 400 });
    }

    // Validate supported token + network combination
    if (!isSupportedPaymentCombination(paymentMethod as PaymentMethod, normalizedNetId)) {
      return NextResponse.json(
        { error: `${paymentMethod} is not supported on the ${network} network.` },
        { status: 400 }
      );
    }

    // Validate receiving wallet address against official single source of truth
    const officialWallet = getOfficialDepositAddress(paymentMethod as PaymentMethod, normalizedNetId);
    if (!officialWallet || !walletAddressUsed || walletAddressUsed.trim().toLowerCase() !== officialWallet.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid deposit wallet address used for this payment." },
        { status: 400 }
      );
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
      amount: expectedAmount,
      currency: "USD",
      billingPeriod: period,
      paymentMethod: paymentMethod as PaymentMethod,
      network,
      walletAddressUsed: officialWallet,
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
      recipientWallet: officialWallet,
      confirmationCount: 0,
      failureReason: "Payment request submitted. Awaiting on-chain verification.",
      verifiedAt: new Date().toISOString(),
    };

    // Update payment record to "Pending Verification" status
    await prisma.payment.update({
      where: { id: result.paymentId },
      data: {
        status: "Pending Verification",
        currency: "USD",
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
        amount: expectedAmount,
        currency: "USD",
        paymentMethod,
        network,
        walletAddressUsed: officialWallet,
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
      amount: expectedAmount,
      currency: "USD",
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
      amount: expectedAmount,
      currency: "USD",
      paymentMethod,
      network,
      paymentId: result.paymentId,
    }).catch((err) => console.error("Admin payment alert email error:", err));

    return NextResponse.json({
      success: true,
      paymentId: result.paymentId,
      status: "Pending Verification",
      verification: initialVerification,
      message: "Payment request registered. Blockchain verification is in progress.",
    });
  } catch (error: any) {
    console.error("PAYMENT_CREATE_API_ERROR:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
