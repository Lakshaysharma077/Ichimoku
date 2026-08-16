/**
 * Centralized Institutional Email Notification Subsystem for Ichimoku Edge
 * Custom-built with dark mode aesthetic matching ichimokuedge.com design system:
 * - Palette: Gold Accent (#FBE178), Electric Blue (#2962FF), Deep Obsidian (#07090E), Slate (#0F172A)
 * - Support for 12 System Email Templates (User & Admin Notifications)
 */

import nodemailer from "nodemailer";
import dns from "dns";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

export type EmailType =
  | "welcome"
  | "verify_email"
  | "password_reset"
  | "payment_submitted"
  | "payment_approved"
  | "payment_rejected"
  | "subscription_expiring"
  | "subscription_expired"
  | "refund_processed"
  | "support_reply"
  | "admin_new_payment"
  | "admin_new_ticket";

export interface GenericEmailPayload {
  toEmail: string;
  customerName: string;
  type: EmailType;
  tradingViewUsername?: string;
  plan?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  network?: string;
  paymentId?: string;
  purchaseDate?: string;
  expiryDate?: string;
  refundReason?: string;
  adminNotes?: string;
  resetUrl?: string;
  verificationUrl?: string;
  ticketId?: string;
  supportMessage?: string;
  replyMessage?: string;
}

export type PaymentEmailPayload = GenericEmailPayload & {
  status?: "Pending" | "Approved" | "Rejected" | "Refunded";
};

function generateEmailHtml(payload: GenericEmailPayload): { subject: string; html: string } {
  const {
    customerName,
    tradingViewUsername = "N/A",
    plan = "Samurai Pass",
    amount = 0,
    currency = "USD",
    paymentMethod = "USDT",
    network = "Arbitrum One",
    paymentId = "N/A",
    purchaseDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    expiryDate = new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    refundReason,
    adminNotes,
    resetUrl = "#",
    verificationUrl = "#",
    ticketId = "N/A",
    supportMessage,
    replyMessage,
    type,
  } = payload;

  const currentYear = new Date().getFullYear();

  // Shared Brand Header
  const brandHeader = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #07090E; border-bottom: 2px solid #2962FF;">
      <tr>
        <td style="padding: 32px 24px; text-align: center;">
          <div style="display: inline-block; padding: 6px 14px; background-color: rgba(251, 225, 120, 0.08); border: 1px solid rgba(251, 225, 120, 0.2); border-radius: 20px; margin-bottom: 12px;">
            <span style="color: #FBE178; font-family: monospace; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
              ⚔ SAMURAI VISION SYSTEM
            </span>
          </div>
          <h1 style="color: #FFFFFF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            ICHIMOKU <span style="color: #FBE178;">EDGE</span>
          </h1>
          <p style="color: #64748B; font-family: monospace; font-size: 11px; margin: 6px 0 0 0; letter-spacing: 1px; text-transform: uppercase;">
            Institutional-Grade Trading Indicators for TradingView
          </p>
        </td>
      </tr>
    </table>
  `;

  // Shared Brand Footer
  const brandFooter = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #05070B; border-top: 1px solid #1E293B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <tr>
        <td style="padding: 28px 24px; text-align: center; color: #64748B; font-size: 12px; line-height: 1.6;">
          <p style="margin: 0 0 12px 0; color: #94A3B8; font-weight: 500;">
            Need help or have questions? Contact support at <a href="mailto:support@ichimokuedge.com" style="color: #FBE178; text-decoration: none; font-weight: bold;">support@ichimokuedge.com</a>
          </p>
          <div style="margin: 16px 0;">
            <a href="https://www.tradingview.com/u/IchimokuEdge/" style="color: #38BDF8; text-decoration: none; margin: 0 10px; font-family: monospace; font-size: 11px;">TradingView Profile</a>
            <span style="color: #334155;">•</span>
            <a href="https://ichimokuedge.com/education" style="color: #38BDF8; text-decoration: none; margin: 0 10px; font-family: monospace; font-size: 11px;">Education Hub</a>
            <span style="color: #334155;">•</span>
            <a href="https://ichimokuedge.com/faq" style="color: #38BDF8; text-decoration: none; margin: 0 10px; font-family: monospace; font-size: 11px;">FAQ & Terms</a>
          </div>
          <p style="margin: 12px 0 0 0; font-family: monospace; font-size: 10px; color: #475569;">
            &copy; ${currentYear} Ichimoku Edge Inc. Educational & analysis tools only. Not financial advice.
          </p>
        </td>
      </tr>
    </table>
  `;

  let subject = "";
  let bodyContent = "";

  switch (type) {
    case "welcome":
      subject = `Welcome to Ichimoku Edge, ${customerName}! ⚔`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #FBE178; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px; letter-spacing: 0.5px;">
            Welcome to the Samurai Trading Community
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 20px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 24px;">
            Thank you for joining <strong>Ichimoku Edge</strong>. Our system is engineered around discipline, market structure, and the <em>Samurai Vision</em> philosophy — replacing market noise with crystal-clear equilibrium signals.
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1E293B; border: 1px solid #334155; border-radius: 12px; margin-bottom: 28px;">
            <tr>
              <td style="padding: 20px;">
                <h4 style="color: #38BDF8; margin: 0 0 12px 0; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">
                  Quick Start Checklist
                </h4>
                <ul style="margin: 0; padding-left: 18px; color: #CBD5E1; font-size: 13px; line-height: 1.8;">
                  <li>Explore free TradingView indicators on our platform</li>
                  <li>Read the <strong>Ichimoku Kinkō Hyō</strong> glossary & guide</li>
                  <li>Subscribe to a 14-day free trial for full indicator access</li>
                </ul>
              </td>
            </tr>
          </table>

          <div style="text-align: center; margin: 32px 0 16px 0;">
            <a href="https://ichimokuedge.com/tools" style="background: linear-gradient(135deg, #FBE178 0%, #EAB308 100%); color: #000000; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 4px 15px rgba(251, 225, 120, 0.3);">
              Explore Indicator Suite →
            </a>
          </div>
        </div>
      `;
      break;

    case "verify_email":
      subject = `Verify your email address — Ichimoku Edge`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #38BDF8; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Verify Your Email Address
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 20px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 28px;">
            Please click the button below to confirm your email address and complete your Ichimoku Edge account activation:
          </p>

          <div style="text-align: center; margin: 36px 0;">
            <a href="${verificationUrl}" style="background-color: #2962FF; color: #FFFFFF; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              Confirm Email Address →
            </a>
          </div>
          <p style="font-size: 12px; color: #64748B; text-align: center; margin-top: 24px;">
            If you did not create an account with Ichimoku Edge, please disregard this message.
          </p>
        </div>
      `;
      break;

    case "password_reset":
      subject = `Password Reset Request — Ichimoku Edge`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #F59E0B; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Password Reset Request
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 20px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 28px;">
            We received a request to reset your password. Click the link below to set up a new password for your account:
          </p>

          <div style="text-align: center; margin: 36px 0;">
            <a href="${resetUrl}" style="background-color: #F59E0B; color: #000000; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              Reset Password Now →
            </a>
          </div>
          <p style="font-size: 12px; color: #64748B; text-align: center; margin-top: 24px;">
            This link is valid for 60 minutes. If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `;
      break;

    case "payment_submitted":
      subject = `[Ichimoku Edge] Payment Request Received (ID: ${paymentId.slice(-6)})`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <div style="display: inline-block; padding: 4px 12px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; margin-bottom: 16px;">
            <span style="color: #F59E0B; font-family: monospace; font-size: 11px; font-weight: bold;">⏳ PENDING VERIFICATION</span>
          </div>

          <h2 style="color: #FFFFFF; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Payment Transfer Received
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 24px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>, thank you for your order! We have received your crypto transfer submission for the <strong style="color: #FBE178;">${plan} Plan</strong>. Our operational team is verifying your transaction on-chain.
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1E293B; border: 1px solid #334155; border-radius: 12px; margin-bottom: 24px; font-size: 13px;">
            <tr>
              <td style="padding: 18px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold; width: 40%;">Payment Reference ID</td>
              <td style="padding: 18px 20px; border-bottom: 1px solid #334155; color: #38BDF8; font-family: monospace; font-weight: bold;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">Plan Name</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #FFFFFF; font-weight: bold;">${plan}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">Amount Paid</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #FBE178; font-family: monospace; font-weight: bold;">$${amount} ${currency} (${paymentMethod} on ${network})</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; color: #94A3B8; font-weight: bold;">TradingView Username</td>
              <td style="padding: 14px 20px; color: #10B981; font-family: monospace; font-weight: bold;">${tradingViewUsername}</td>
            </tr>
          </table>

          <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin-bottom: 0;">
            Verification usually takes 5-15 minutes. Once verified, your invite-only TradingView indicator access will be activated immediately and you will receive an activation confirmation email.
          </p>
        </div>
      `;
      break;

    case "payment_approved":
      subject = `[Ichimoku Edge] Subscription Activated! (${plan})`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <div style="display: inline-block; padding: 4px 12px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; margin-bottom: 16px;">
            <span style="color: #10B981; font-family: monospace; font-size: 11px; font-weight: bold;">✓ VERIFIED & APPROVED</span>
          </div>

          <h2 style="color: #10B981; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Subscription Successfully Activated!
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 24px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>, great news! Your crypto payment has been verified on-chain and access to your indicator suite has been granted.
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1E293B; border: 1px solid #10B981; border-radius: 12px; margin-bottom: 28px; font-size: 13px;">
            <tr>
              <td style="padding: 16px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">Plan Name</td>
              <td style="padding: 16px 20px; border-bottom: 1px solid #334155; color: #FFFFFF; font-weight: bold;">${plan}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">TradingView Username</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #10B981; font-family: monospace; font-weight: bold;">${tradingViewUsername}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">Purchase Date</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #CBD5E1; font-family: monospace;">${purchaseDate}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; color: #94A3B8; font-weight: bold;">Expiry Date</td>
              <td style="padding: 14px 20px; color: #FBE178; font-family: monospace; font-weight: bold;">${expiryDate}</td>
            </tr>
          </table>

          <div style="background-color: rgba(41, 98, 255, 0.1); border-left: 4px solid #2962FF; padding: 18px 20px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
            <h4 style="color: #38BDF8; margin: 0 0 8px 0; font-size: 13px; font-family: monospace; text-transform: uppercase;">
              How to Load Indicators on TradingView:
            </h4>
            <ol style="margin: 0; padding-left: 18px; color: #CBD5E1; font-size: 13px; line-height: 1.8;">
              <li>Log into TradingView with account: <code style="color: #FBE178;">${tradingViewUsername}</code></li>
              <li>Open any chart, click <strong>Indicators & Strategies</strong> at top</li>
              <li>Select <strong>Invite-Only Scripts</strong> in the sidebar to add your suite!</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 32px 0 12px 0;">
            <a href="https://www.tradingview.com" style="background: linear-gradient(135deg, #2962FF 0%, #1D4ED8 100%); color: #FFFFFF; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 4px 15px rgba(41, 98, 255, 0.4);">
              Open TradingView Charts →
            </a>
          </div>
        </div>
      `;
      break;

    case "payment_rejected":
      subject = `[Ichimoku Edge] Payment Verification Notice (ID: ${paymentId.slice(-6)})`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <div style="display: inline-block; padding: 4px 12px; background-color: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; margin-bottom: 16px;">
            <span style="color: #EF4444; font-family: monospace; font-size: 11px; font-weight: bold;">✕ REJECTED</span>
          </div>

          <h2 style="color: #EF4444; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Payment Could Not Be Verified
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 24px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>, we were unable to verify your submitted crypto transfer for the <strong>${plan} Plan</strong> ($${amount} ${currency}).
          </p>

          <div style="background-color: #1E293B; border: 1px solid #EF4444; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #94A3B8;">Payment Reference ID: <span style="color: #FFFFFF; font-family: monospace;">${paymentId}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #94A3B8;">Plan & Amount: <span style="color: #FBE178; font-family: monospace; font-weight: bold;">${plan} — $${amount} ${currency}</span></p>
            ${adminNotes ? `<p style="margin: 12px 0 0 0; font-size: 13px; color: #FCA5A5; line-height: 1.6;"><strong>Reason for Rejection:</strong> ${adminNotes}</p>` : ""}
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #94A3B8;">
            If you believe this is an error or need help re-submitting your TXID, please contact our support team at <a href="mailto:support@ichimokuedge.com" style="color: #FBE178; font-weight: bold; text-decoration: none;">support@ichimokuedge.com</a>.
          </p>
        </div>
      `;
      break;

    case "subscription_expiring":
      subject = `[Ichimoku Edge] Notice: Your ${plan} subscription expires soon`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #F59E0B; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Subscription Expiring Soon
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 24px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>, your <strong>${plan}</strong> subscription will expire on <strong style="color: #FBE178;">${expiryDate}</strong>.
          </p>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 28px;">
            To maintain uninterrupted access to your invite-only TradingView indicators and scanners, please renew your plan.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://ichimokuedge.com/pricing" style="background: linear-gradient(135deg, #FBE178 0%, #EAB308 100%); color: #000000; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              Renew Subscription →
            </a>
          </div>
        </div>
      `;
      break;

    case "subscription_expired":
      subject = `[Ichimoku Edge] Your ${plan} subscription has expired`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #EF4444; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Subscription Expired
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 24px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>, your subscription for the <strong>${plan}</strong> expired on <strong>${expiryDate}</strong>.
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin-bottom: 28px;">
            Your premium indicator access has been paused. You can renew at any time to reactivate instant access.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://ichimokuedge.com/pricing" style="background-color: #2962FF; color: #FFFFFF; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              Reactivate Access →
            </a>
          </div>
        </div>
      `;
      break;

    case "refund_processed":
      subject = `[Ichimoku Edge] Refund Processed (ID: ${paymentId.slice(-6)})`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #A855F7; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Refund Processed
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 20px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>, a refund of <strong style="color: #FBE178;">$${amount} ${currency}</strong> has been processed for your payment (ID: ${paymentId}).
          </p>
          ${refundReason ? `<div style="background-color: #1E293B; border-left: 3px solid #A855F7; padding: 16px; margin: 20px 0; font-size: 13px; color: #CBD5E1;"><strong>Reason:</strong> ${refundReason}</div>` : ""}
        </div>
      `;
      break;

    case "support_reply":
      subject = `[Ichimoku Edge Support] Reply to Ticket #${ticketId.slice(-6)}`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #38BDF8; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            Support Team Response
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 20px;">
            Hello <strong style="color: #FFFFFF;">${customerName}</strong>,
          </p>
          ${supportMessage ? `<div style="background-color: #1E293B; border-left: 3px solid #64748B; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #94A3B8; border-radius: 0 8px 8px 0;"><em>Your message: ${supportMessage}</em></div>` : ""}

          <div style="background-color: #1E293B; border: 1px solid #38BDF8; border-radius: 12px; padding: 20px; margin-bottom: 24px; color: #FFFFFF; font-size: 14px; line-height: 1.7;">
            <strong style="color: #38BDF8; font-family: monospace; font-size: 11px; text-transform: uppercase;">Official Response:</strong>
            <p style="margin-top: 10px; margin-bottom: 0;">${replyMessage || "Thank you for reaching out. Your request has been processed."}</p>
          </div>
        </div>
      `;
      break;

    case "admin_new_payment":
      subject = `[ADMIN ALERT] New Crypto Payment Submitted (${plan} - $${amount})`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <div style="display: inline-block; padding: 4px 12px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; margin-bottom: 16px;">
            <span style="color: #F59E0B; font-family: monospace; font-size: 11px; font-weight: bold;">⚡ ACTION REQUIRED</span>
          </div>

          <h2 style="color: #FBE178; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            New Payment Submitted for Verification
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 20px;">
            A user has submitted a crypto transfer request on the platform:
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1E293B; border: 1px solid #F59E0B; border-radius: 12px; margin-bottom: 28px; font-size: 13px;">
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">Customer Name</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #FFFFFF; font-weight: bold;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">Customer Email</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #38BDF8; font-family: monospace;">${payload.toEmail}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">TradingView Username</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #10B981; font-family: monospace; font-weight: bold;">${tradingViewUsername}</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #94A3B8; font-weight: bold;">Plan & Amount</td>
              <td style="padding: 14px 20px; border-bottom: 1px solid #334155; color: #FBE178; font-family: monospace; font-weight: bold;">${plan} — $${amount} ${currency} (${paymentMethod} on ${network})</td>
            </tr>
            <tr>
              <td style="padding: 14px 20px; color: #94A3B8; font-weight: bold;">Payment ID</td>
              <td style="padding: 14px 20px; color: #CBD5E1; font-family: monospace;">${paymentId}</td>
            </tr>
          </table>

          <div style="text-align: center; margin: 32px 0 12px 0;">
            <a href="https://ichimokuedge.com/admin/payments" style="background: linear-gradient(135deg, #FBE178 0%, #EAB308 100%); color: #000000; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              Review & Approve Payment →
            </a>
          </div>
        </div>
      `;
      break;

    case "admin_new_ticket":
      subject = `[ADMIN ALERT] New Support Ticket #${ticketId.slice(-6)}`;
      bodyContent = `
        <div style="padding: 36px 28px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; background-color: #0F172A;">
          <h2 style="color: #38BDF8; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
            📥 New Support Ticket Received
          </h2>
          <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin-bottom: 20px;">
            A support inquiry has been submitted by <strong style="color: #FFFFFF;">${customerName}</strong> (<span style="color: #38BDF8; font-family: monospace;">${payload.toEmail}</span>):
          </p>

          <div style="background-color: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px; font-size: 13px;">
            <p style="margin: 0 0 6px 0;"><strong>Ticket ID:</strong> <span style="font-family: monospace; color: #38BDF8;">${ticketId}</span></p>
            <p style="margin: 0 0 6px 0;"><strong>TradingView Username:</strong> <span style="font-family: monospace; color: #10B981;">${tradingViewUsername || "N/A"}</span></p>
            <p style="margin: 0 0 12px 0; color: #FBE178;"><strong>Subject:</strong> ${payload.adminNotes || "Support Request"}</p>
            <div style="background-color: #0F172A; border: 1px solid #334155; padding: 14px; border-radius: 8px; color: #E2E8F0; line-height: 1.6;">
              ${supportMessage}
            </div>
          </div>

          <div style="text-align: center; margin: 28px 0 12px 0;">
            <a href="https://ichimokuedge.com/admin/content" style="background-color: #2962FF; color: #FFFFFF; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              View Support Dashboard →
            </a>
          </div>
        </div>
      `;
      break;
  }

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #07090E; color: #E2E8F0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #07090E; padding: 24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <tr>
                  <td>
                    ${brandHeader}
                    ${bodyContent}
                    ${brandFooter}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { subject, html: fullHtml };
}

/**
 * Dispatch system email notification.
 */
export async function sendEmailNotification(payload: GenericEmailPayload): Promise<{ success: boolean; messageId?: string }> {
  try {
    const { subject, html } = generateEmailHtml(payload);

    console.log(`\n================ EMAIL NOTIFICATION LOG ================`);
    console.log(`TO: ${payload.toEmail}`);
    console.log(`TYPE: ${payload.type}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`=======================================================\n`);

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const port = parseInt(process.env.SMTP_PORT || "587");
        const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port,
          secure: isSecure,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
        });

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Ichimoku Edge" <${process.env.SMTP_USER}>`,
          to: payload.toEmail,
          subject,
          html,
        });

        console.log(`✅ LIVE SMTP EMAIL SENT SUCCESSFULLY to ${payload.toEmail} | Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (smtpErr: any) {
        console.error("❌ LIVE SMTP EMAIL ERROR:", smtpErr?.message || smtpErr);
      }
    }

    return { success: true, messageId: `logged-simulated-${Date.now()}` };
  } catch (error: any) {
    console.error("sendEmailNotification error:", error);
    return { success: false };
  }
}

// Legacy wrapper for backwards compatibility
export async function sendPaymentStatusEmail(payload: PaymentEmailPayload): Promise<{ success: boolean; messageId?: string }> {
  let emailType: EmailType = "payment_submitted";

  if (payload.status === "Approved") emailType = "payment_approved";
  else if (payload.status === "Rejected") emailType = "payment_rejected";
  else if (payload.status === "Refunded") emailType = "refund_processed";

  return sendEmailNotification({
    ...payload,
    type: emailType,
  });
}
