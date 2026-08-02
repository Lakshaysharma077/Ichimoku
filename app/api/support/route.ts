import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/security";
import { sendEmailNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) {
      return rateCheck.response!;
    }

    const body = await req.json();
    const { name, email, tradingViewUsername, category, subject, message } = body;

    const validCategories = ["General", "Payment", "Subscription", "Technical", "Indicator", "Bug Report"];

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const selectedCategory = validCategories.includes(category) ? category : "General";

    const ticket = await prisma.supportTicket.create({
      data: {
        name: sanitizeInput(name.trim()),
        email: email.trim().toLowerCase(),
        tradingViewUsername: tradingViewUsername ? sanitizeInput(tradingViewUsername.trim()) : null,
        category: selectedCategory,
        subject: sanitizeInput(subject.trim()),
        message: sanitizeInput(message.trim()),
        status: "OPEN",
      },
    });

    // 1. Notify USER (Ticket Received Acknowledgment)
    sendEmailNotification({
      toEmail: email.trim().toLowerCase(),
      customerName: name,
      type: "support_reply",
      ticketId: ticket.id,
      supportMessage: message,
      replyMessage: `Thank you for reaching out! We have received your inquiry regarding "${subject}" and our team will get back to you shortly.`,
    }).catch((err) => console.error("User support confirmation error:", err));

    // 2. Notify ADMIN (New Support Ticket Alert)
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.SUPPORT_EMAIL || "support@ichimokuedge.com";
    sendEmailNotification({
      toEmail: adminEmail,
      customerName: name,
      type: "admin_new_ticket",
      ticketId: ticket.id,
      tradingViewUsername: tradingViewUsername ? sanitizeInput(tradingViewUsername.trim()) : undefined,
      adminNotes: subject,
      supportMessage: message,
    }).catch((err) => console.error("Admin support notification error:", err));

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
      message: "Your support request has been submitted successfully. We will reply shortly.",
    });
  } catch (error: any) {
    console.error("SUPPORT_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
