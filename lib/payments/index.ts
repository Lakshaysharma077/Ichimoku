import { ManualCryptoGatewayAdapter } from "./manualGateway";
import { PaymentGatewayAdapter } from "./types";

/**
 * Factory function to retrieve active payment gateway adapter.
 * Easily swappable to NOWPaymentsGatewayAdapter or CoinbaseCommerceGatewayAdapter in the future.
 */
export function getPaymentGateway(): PaymentGatewayAdapter {
  const provider = process.env.PAYMENT_GATEWAY_PROVIDER || "MANUAL";

  switch (provider.toUpperCase()) {
    case "MANUAL":
    default:
      return new ManualCryptoGatewayAdapter();
  }
}

export * from "./types";
export * from "./config";
export * from "./explorers";
export * from "./verificationService";
