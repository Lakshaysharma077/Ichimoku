import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmailNotification } from "@/lib/email";
import { calculateSubscriptionPeriod } from "@/lib/subscription";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function PATCH(
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
    const body = await req.json();
    const { status, adminNotes, txnHash, refundReason, allowUnverifiedOverride } = body;

    const validStatuses = [
      "Pending",
      "Pending Verification",
      "Verified",
      "Approved",
      "Rejected",
      "Refunded",
      "Expired",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { user: true, planRef: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // REQUIREMENT #3: Verification Gate before Approval
    if (status === "Approved") {
      const isVerifiedOnChain = payment.verificationStatus === "VERIFIED";
      if (!isVerifiedOnChain && !allowUnverifiedOverride) {
        return NextResponse.json(
          {
            error: "Payment cannot be Approved prior to successful blockchain verification. Click 'Re-Verify On-Chain' first or confirm manual override.",
            requiresOverrideConfirm: true,
          },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === "Refunded") {
        updateData.refundedAt = new Date();
        if (refundReason !== undefined) updateData.refundReason = refundReason;
      }
    }

    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (txnHash !== undefined) updateData.txnHash = txnHash;

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: updateData,
    });

    // Subscriptions handling upon Approval
    let createdSubscription: any = null;
    let formattedPurchaseDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    let formattedExpiryDate = "";

    if (status === "Approved" && payment.status !== "Approved") {
      // Find or associate user
      let targetUserId = payment.userId;
      if (!targetUserId) {
        const existingUser = await prisma.user.findUnique({ where: { email: payment.customerEmail } });
        if (existingUser) {
          targetUserId = existingUser.id;
          await prisma.payment.update({ where: { id }, data: { userId: targetUserId } });
        }
      }

      if (targetUserId) {
        // Look up plan
        let planId = payment.planId;
        if (!planId) {
          const allPlans = await prisma.plan.findMany();
          let planRecord = allPlans.find((p) => p.name.toLowerCase() === payment.plan.toLowerCase());
          if (!planRecord) {
            planRecord = await prisma.plan.create({
              data: {
                name: payment.plan,
                price: payment.amount,
                currency: payment.currency,
                billingCycle: payment.billingPeriod,
                description: `Plan for ${payment.plan}`,
              },
            });
          }
          planId = planRecord.id;
        }

        const { startDate, expiryDate } = calculateSubscriptionPeriod(payment.billingPeriod);
        formattedPurchaseDate = startDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        formattedExpiryDate = expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

        // Upsert dedicated Subscription model (Requirement #1)
        createdSubscription = await prisma.subscription.upsert({
          where: { paymentId: payment.id },
          create: {
            userId: targetUserId,
            planId,
            paymentId: payment.id,
            status: "ACTIVE",
            startDate,
            expiryDate,
          },
          update: {
            status: "ACTIVE",
            startDate,
            expiryDate,
          },
        });
      }
    } else if (["Rejected", "Refunded", "Expired"].includes(status)) {
      // Update any associated subscription to CANCELLED / EXPIRED
      await prisma.subscription.updateMany({
        where: { paymentId: payment.id },
        data: { status: status === "Refunded" ? "CANCELLED" : "EXPIRED" },
      });
    }

    // Audit Log
    await logAuditEvent({
      action: `PAYMENT_STATUS_CHANGED_${status || payment.status}`,
      entity: "Payment",
      entityId: payment.id,
      details: {
        previousStatus: payment.status,
        newStatus: status || payment.status,
        adminNotes: updateData.adminNotes,
        manualOverride: allowUnverifiedOverride || false,
      },
      userId: adminUserId,
    });

    // Dispatch automated Email Notification (Requirement #2)
    if (status && status !== payment.status) {
      if (status === "Approved") {
        sendEmailNotification({
          toEmail: updatedPayment.customerEmail,
          customerName: updatedPayment.customerName,
          type: "payment_approved",
          tradingViewUsername: updatedPayment.tradingViewUsername,
          plan: updatedPayment.plan,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          paymentId: updatedPayment.id,
          purchaseDate: formattedPurchaseDate,
          expiryDate: formattedExpiryDate,
        }).catch((err) => console.error("Approved email error:", err));
      } else if (status === "Rejected") {
        sendEmailNotification({
          toEmail: updatedPayment.customerEmail,
          customerName: updatedPayment.customerName,
          type: "payment_rejected",
          paymentId: updatedPayment.id,
          plan: updatedPayment.plan,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          adminNotes: updatedPayment.adminNotes || undefined,
        }).catch((err) => console.error("Rejected email error:", err));
      } else if (status === "Refunded") {
        sendEmailNotification({
          toEmail: updatedPayment.customerEmail,
          customerName: updatedPayment.customerName,
          type: "refund_processed",
          paymentId: updatedPayment.id,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          refundReason: updatedPayment.refundReason || undefined,
        }).catch((err) => console.error("Refund email error:", err));
      }
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      subscription: createdSubscription,
      message: `Payment status updated to ${updatedPayment.status}`,
    });
  } catch (error: any) {
    console.error("ADMIN_PAYMENT_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Delete associated subscription if any
    await prisma.subscription.deleteMany({ where: { paymentId: id } });

    // Delete payment record
    await prisma.payment.delete({ where: { id } });

    await logAuditEvent({
      action: "PAYMENT_DELETED",
      entity: "Payment",
      entityId: id,
      details: { deletedPaymentId: id, customerEmail: payment.customerEmail },
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true, message: "Payment record deleted successfully" });
  } catch (error: any) {
    console.error("ADMIN_PAYMENT_DELETE_ERROR:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

