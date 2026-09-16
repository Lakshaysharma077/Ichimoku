import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmailNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/security";
import { getOfficialPlanPrice } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) {
      return rateCheck.response!;
    }

    const body = await req.json();

    const {
      plan,
      isTrial,
      tradingViewUsername,
      email,
      customerEmail,
      customerName,
      amount,
      currency,
      paymentMethod,
      network,
      walletAddressUsed,
      txnHash,
      billingPeriod,
    } = body;

    const finalEmail = (email || customerEmail || "").trim().toLowerCase();
    const finalTvUsername = sanitizeInput((tradingViewUsername || "").trim().toLowerCase());
    const finalCustomerName = sanitizeInput((customerName || "").trim());
    const finalPlan = (plan || "").trim();

    if (!finalEmail || !finalEmail.includes("@")) {
      return NextResponse.json({ error: "Valid Email Address is required" }, { status: 400 });
    }
    if (!finalTvUsername) {
      return NextResponse.json({ error: "TradingView Username is required" }, { status: 400 });
    }
    if (!finalPlan) {
      return NextResponse.json({ error: "Subscription plan is required" }, { status: 400 });
    }

    if (isTrial) {
      // For Trials: Server-side validation
      // 1. Check if ANY trial exists for this exact Email + TV Username + Product combination (even if expired)
      const existingTrial = await prisma.indicatorAccessRequest.findFirst({
        where: {
          email: finalEmail,
          tradingViewUsername: finalTvUsername,
          productName: finalPlan,
          isTrial: true,
        },
      });

      if (existingTrial) {
        return NextResponse.json(
          {
            error: "A 7-day free trial has already been used for this TradingView Username and Email. Please purchase a paid plan.",
          },
          { status: 400 }
        );
      }

      // Calculate timestamps server-side
      const trialStartAt = new Date();
      const trialEndAt = new Date();
      trialEndAt.setDate(trialEndAt.getDate() + 7);

      const request = await prisma.indicatorAccessRequest.create({
        data: {
          email: finalEmail,
          tradingViewUsername: finalTvUsername,
          productName: finalPlan,
          isTrial: true,
          paymentStatus: "verified", // Trials are free
          accessStatus: "active",
          trialStartAt,
          trialEndAt,
          accessStartAt: trialStartAt,
          accessEndAt: trialEndAt,
        },
      });

      // Fire email notification
      const formattedStartDate = trialStartAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const formattedExpiryDate = trialEndAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      
      sendEmailNotification({
        toEmail: finalEmail,
        customerName: finalCustomerName || "Edge Trader",
        type: "trial_activated",
        tradingViewUsername: finalTvUsername,
        plan: finalPlan,
        purchaseDate: formattedStartDate,
        expiryDate: formattedExpiryDate,
      }).catch((err) => console.error("Trial email notification error:", err));

      return NextResponse.json({
        success: true,
        message: "Your 7-day free trial has been activated!",
        request: {
          id: request.id,
          accessStatus: "active",
          trialDaysRemaining: 7,
          expiryDate: formattedExpiryDate,
        },
      });

    } else {
      // For Paid Plans
      const finalTxnHash = (txnHash || "").trim();
      if (!finalTxnHash) {
        return NextResponse.json({ error: "Transaction Hash is required" }, { status: 400 });
      }

      // Anti-replay: Check if this transaction hash was already used
      const existingHash = await prisma.indicatorAccessRequest.findFirst({
        where: { transactionHash: finalTxnHash },
      });
      if (existingHash) {
        return NextResponse.json({ error: "This transaction hash has already been submitted." }, { status: 400 });
      }

      // Check if there is already a PENDING or ACTIVE request for this exact combo (to prevent duplicate submissions)
      const existingPending = await prisma.indicatorAccessRequest.findFirst({
        where: {
          email: finalEmail,
          tradingViewUsername: finalTvUsername,
          productName: finalPlan,
          isTrial: false,
          accessStatus: { in: ["pending", "active"] },
        },
      });

      if (existingPending) {
        return NextResponse.json(
          { error: "You already have a pending or active request for this product. Please wait for admin verification." },
          { status: 400 }
        );
      }

      const period: "monthly" | "yearly" = billingPeriod === "yearly" ? "yearly" : "monthly";
      const expectedAmount = getOfficialPlanPrice(finalPlan, period);

      const request = await prisma.indicatorAccessRequest.create({
        data: {
          email: finalEmail,
          tradingViewUsername: finalTvUsername,
          productName: finalPlan,
          isTrial: false,
          amount: expectedAmount, // Set from server
          currency: "USD",
          paymentMethod: paymentMethod || "USDT",
          transactionHash: finalTxnHash,
          paymentStatus: "pending",
          accessStatus: "pending",
        },
      });

      // Send Request Received Email
      sendEmailNotification({
        toEmail: finalEmail,
        customerName: finalCustomerName || "Edge Trader",
        type: "payment_submitted",
        tradingViewUsername: finalTvUsername,
        plan: finalPlan,
        amount: expectedAmount,
        currency: "USD",
        paymentMethod: paymentMethod || "USDT",
        network: network || "N/A",
        paymentId: request.id,
      }).catch((err) => console.error("Payment submitted email error:", err));

      // Trigger Alert Email to ADMIN
      const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.SUPPORT_EMAIL || "admin@ichimokuedge.com";
      sendEmailNotification({
        toEmail: adminEmail,
        customerName: finalCustomerName || "Edge Trader",
        type: "admin_new_payment",
        tradingViewUsername: finalTvUsername,
        plan: finalPlan,
        amount: expectedAmount,
        currency: "USD",
        paymentMethod: paymentMethod || "USDT",
        network: network || "N/A",
        paymentId: request.id,
      }).catch((err) => console.error("Admin payment alert email error:", err));

      return NextResponse.json({
        success: true,
        message: "Payment request registered. Awaiting admin verification.",
        requestId: request.id,
      });
    }

  } catch (error: any) {
    console.error("ACCESS_REQUEST_CREATE_API_ERROR:", error);
    // Never expose internal database errors to client
    return NextResponse.json({ error: "An unexpected error occurred while submitting your request." }, { status: 500 });
  }
}
