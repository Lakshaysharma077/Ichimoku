import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmailNotification } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { action, adminNotes } = body;

    const request = await prisma.indicatorAccessRequest.findUnique({ where: { id } });
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const adminName = session.user.name || "Admin";

    if (action === "VERIFY_PAYMENT") {
      if (request.paymentStatus === "verified") {
        return NextResponse.json({ error: "Payment is already verified" }, { status: 400 });
      }

      const updated = await prisma.indicatorAccessRequest.update({
        where: { id },
        data: {
          paymentStatus: "verified",
          processedBy: adminName,
          processedAt: new Date(),
        },
      });

      await logAuditEvent({
        action: "ACCESS_REQUEST_PAYMENT_VERIFIED",
        entity: "IndicatorAccessRequest",
        entityId: id,
        details: { admin: adminName },
        userId: (session.user as any).id,
      });

      return NextResponse.json({ success: true, request: updated });
    } 
    else if (action === "GRANT_ACCESS") {
      if (request.paymentStatus !== "verified" && !request.isTrial) {
        return NextResponse.json({ error: "Cannot grant access before payment is verified" }, { status: 400 });
      }
      if (request.accessStatus === "active") {
        return NextResponse.json({ error: "Access is already active" }, { status: 400 });
      }

      const accessStartAt = new Date();
      // Assume 30 days for monthly, 365 for yearly if not a trial
      // Note: We don't have billingPeriod saved in the model directly, so we can infer from price or just assume it's handled manually, but let's give a default 30 days.
      const isYearly = request.amount && request.amount > 50;
      const days = isYearly ? 365 : 30;
      
      const accessEndAt = new Date();
      accessEndAt.setDate(accessEndAt.getDate() + days);

      const updated = await prisma.indicatorAccessRequest.update({
        where: { id },
        data: {
          accessStatus: "active",
          accessStartAt,
          accessEndAt,
          processedBy: adminName,
          processedAt: new Date(),
        },
      });

      await logAuditEvent({
        action: "ACCESS_REQUEST_ACCESS_GRANTED",
        entity: "IndicatorAccessRequest",
        entityId: id,
        details: { admin: adminName, days },
        userId: (session.user as any).id,
      });

      // Send Access Activated Email
      const formattedStartDate = accessStartAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const formattedExpiryDate = accessEndAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

      sendEmailNotification({
        toEmail: request.email,
        customerName: "Edge Trader",
        type: "payment_approved",
        tradingViewUsername: request.tradingViewUsername,
        plan: request.productName,
        purchaseDate: formattedStartDate,
        expiryDate: formattedExpiryDate,
      }).catch((err) => console.error("Access granted email error:", err));

      return NextResponse.json({ success: true, request: updated });
    } 
    else if (action === "REJECT") {
      const updated = await prisma.indicatorAccessRequest.update({
        where: { id },
        data: {
          accessStatus: "rejected",
          paymentStatus: "rejected",
          adminNotes: adminNotes || null,
          processedBy: adminName,
          processedAt: new Date(),
        },
      });

      await logAuditEvent({
        action: "ACCESS_REQUEST_REJECTED",
        entity: "IndicatorAccessRequest",
        entityId: id,
        details: { admin: adminName, reason: adminNotes },
        userId: (session.user as any).id,
      });

      // Send Rejection Email (Assuming 'payment_rejected' exists in email system)
      sendEmailNotification({
        toEmail: request.email,
        customerName: "Edge Trader",
        type: "payment_rejected",
        tradingViewUsername: request.tradingViewUsername,
        plan: request.productName,
        adminNotes: adminNotes || "Payment could not be verified.",
      }).catch((err) => console.error("Reject email error:", err));

      return NextResponse.json({ success: true, request: updated });
    } 
    else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("ADMIN_ACCESS_REQUESTS_MUTATION_ERROR:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
