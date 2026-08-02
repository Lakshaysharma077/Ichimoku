/**
 * TypeScript Interfaces for Modular Payment Architecture
 * Supports current Manual Crypto flow and ready for future Automated Payment Gateways (NOWPayments, Coinbase Commerce, etc.)
 */

export type PaymentStatus = "Pending" | "Approved" | "Rejected" | "Processing" | "Refunded";

export type PaymentMethod = "USDT" | "USDC";

export type NetworkId = "ethereum" | "arbitrum" | "avalanche" | "solana" | "trc20" | "polygon";

export interface CryptoNetworkOption {
  id: NetworkId;
  name: string;
  badge: string;
  color: string;
  borderColor: string;
  activeBorderColor: string;
  hoverBgColor: string;
  glowClass: string;
}

export interface CreatePaymentInput {
  plan: string;
  amount: number;
  currency?: string;
  billingPeriod: "monthly" | "yearly";
  paymentMethod: PaymentMethod;
  network: string;
  walletAddressUsed: string;
  customerName: string;
  customerEmail: string;
  tradingViewUsername: string;
  country?: string;
  txnHash?: string;
  userId?: string;
}

export interface CreatePaymentResult {
  success: boolean;
  paymentId?: string;
  status: PaymentStatus;
  message: string;
  error?: string;
}

export interface RefundPaymentResult {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  refundedAt: Date;
  refundReason?: string;
  message: string;
  error?: string;
}

export interface PaymentGatewayAdapter {
  providerName: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  getPaymentStatus(paymentId: string): Promise<{ status: PaymentStatus; details?: any }>;
  refundPayment(paymentId: string, reason?: string): Promise<RefundPaymentResult>;
}
