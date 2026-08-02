import { prisma } from "@/lib/db";
import { CreatePaymentInput, CreatePaymentResult, PaymentGatewayAdapter, PaymentStatus } from "./types";

export class ManualCryptoGatewayAdapter implements PaymentGatewayAdapter {
  providerName = "MANUAL";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    try {
      let validUserId: string | null = null;

      if (input.userId) {
        const userById = await prisma.user.findUnique({ where: { id: input.userId } });
        if (userById) {
          validUserId = userById.id;
        }
      }

      if (!validUserId && input.customerEmail) {
        const userByEmail = await prisma.user.findUnique({
          where: { email: input.customerEmail.trim().toLowerCase() },
        });
        if (userByEmail) {
          validUserId = userByEmail.id;
        }
      }

      const payment = await prisma.payment.create({
        data: {
          plan: input.plan,
          amount: input.amount,
          currency: input.currency || "USD",
          billingPeriod: input.billingPeriod,
          paymentMethod: input.paymentMethod,
          network: input.network,
          walletAddressUsed: input.walletAddressUsed,
          customerName: input.customerName.trim(),
          customerEmail: input.customerEmail.trim().toLowerCase(),
          tradingViewUsername: input.tradingViewUsername.trim(),
          country: input.country?.trim() || null,
          status: "Pending",
          txnHash: input.txnHash?.trim() || null,
          gatewayProvider: this.providerName,
          userId: validUserId,
        },
      });

      return {
        success: true,
        paymentId: payment.id,
        status: payment.status as PaymentStatus,
        message: "Payment request successfully registered. Pending admin verification.",
      };
    } catch (error: any) {
      console.error("ManualCryptoGateway createPayment error:", error);
      return {
        success: false,
        status: "Pending",
        message: "Failed to create payment record.",
        error: error?.message || "Internal server error",
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: PaymentStatus; details?: any }> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error("Payment record not found");
      }

      return {
        status: payment.status as PaymentStatus,
        details: payment,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async refundPayment(paymentId: string, reason?: string) {
    try {
      const refundedAt = new Date();
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "Refunded",
          refundedAt,
          refundReason: reason?.trim() || "Manual refund processed by admin",
        },
      });

      return {
        success: true,
        paymentId: payment.id,
        status: payment.status as PaymentStatus,
        refundedAt,
        refundReason: payment.refundReason || undefined,
        message: "Payment successfully marked as Refunded.",
      };
    } catch (error: any) {
      console.error("ManualCryptoGateway refundPayment error:", error);
      throw error;
    }
  }
}
