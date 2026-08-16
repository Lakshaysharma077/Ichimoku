import { CryptoNetworkOption, NetworkId, PaymentMethod } from "./types";

/**
 * OFFICIAL CLIENT RECEIVING WALLET ADDRESSES
 * Single source of truth across both client-side UI and server-side verification.
 */
export const OFFICIAL_WALLETS = {
  // EVM address shared for Ethereum, Arbitrum, and Avalanche (USDT & USDC)
  EVM: "0x1c9b33ee3ce959a55b1fb148b383fcd087e01680",
  // TRON address (USDT only)
  TRON: "TMbyjr1ShhWcT3RzRdXQZpU5ueZxmS2LgM",
  // Solana address (USDC only)
  SOLANA: "8NzzF11sxfuYCEqKxGqQQMHSeYNQkVuBPWA1TRKZmcyN",
} as const;

/**
 * Official Pricing Structure in USD
 */
export const OFFICIAL_PRICING = {
  currency: "USD",
  monthly: {
    amount: 22,
    display: "$22 USD / month",
    label: "/ month",
  },
  yearly: {
    amount: 220,
    display: "$220 USD / year",
    label: "/ year",
    savingsBadge: "2 months free",
    effectiveMonthlyDisplay: "$18.33 / mo",
  },
} as const;

/**
 * Valid token and network matrix.
 * Enforces that only confirmed combinations can be selected or processed.
 * 
 * Valid combinations:
 * - USDT + Ethereum
 * - USDT + Arbitrum
 * - USDT + Avalanche
 * - USDT + TRON
 * 
 * - USDC + Ethereum
 * - USDC + Arbitrum
 * - USDC + Avalanche
 * - USDC + Solana
 */
export const SUPPORTED_PAYMENT_COMBINATIONS: Record<PaymentMethod, NetworkId[]> = {
  USDT: ["ethereum", "arbitrum", "avalanche", "trc20"],
  USDC: ["ethereum", "arbitrum", "avalanche", "solana"],
};

/**
 * Deposit wallet mapping for all valid combinations.
 */
export const CRYPTO_WALLETS: Record<NetworkId, Partial<Record<PaymentMethod, string>>> = {
  ethereum: {
    USDT: OFFICIAL_WALLETS.EVM,
    USDC: OFFICIAL_WALLETS.EVM,
  },
  arbitrum: {
    USDT: OFFICIAL_WALLETS.EVM,
    USDC: OFFICIAL_WALLETS.EVM,
  },
  avalanche: {
    USDT: OFFICIAL_WALLETS.EVM,
    USDC: OFFICIAL_WALLETS.EVM,
  },
  trc20: {
    USDT: OFFICIAL_WALLETS.TRON,
    // USDC is NOT supported on TRON
  },
  solana: {
    USDC: OFFICIAL_WALLETS.SOLANA,
    // USDT is NOT supported on Solana
  },
};

/**
 * Supported Blockchain Networks Display Configuration
 */
export const NETWORK_OPTIONS: CryptoNetworkOption[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    badge: "ERC-20",
    color: "text-[#627EEA]",
    borderColor: "border-[#627EEA]/20",
    activeBorderColor: "border-[#627EEA]",
    hoverBgColor: "hover:bg-[#627EEA]/5",
    glowClass: "shadow-[0_0_15px_rgba(98,126,234,0.15)]",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    badge: "Arbitrum One",
    color: "text-[#28A0F0]",
    borderColor: "border-[#28A0F0]/20",
    activeBorderColor: "border-[#28A0F0]",
    hoverBgColor: "hover:bg-[#28A0F0]/5",
    glowClass: "shadow-[0_0_15px_rgba(40,160,240,0.15)]",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    badge: "C-Chain",
    color: "text-[#E84142]",
    borderColor: "border-[#E84142]/20",
    activeBorderColor: "border-[#E84142]",
    hoverBgColor: "hover:bg-[#E84142]/5",
    glowClass: "shadow-[0_0_15px_rgba(232,65,66,0.15)]",
  },
  {
    id: "trc20",
    name: "TRON",
    badge: "TRC-20",
    color: "text-[#FF0013]",
    borderColor: "border-[#FF0013]/20",
    activeBorderColor: "border-[#FF0013]",
    hoverBgColor: "hover:bg-[#FF0013]/5",
    glowClass: "shadow-[0_0_15px_rgba(255,0,19,0.15)]",
  },
  {
    id: "solana",
    name: "Solana",
    badge: "SPL",
    color: "text-[#14F195]",
    borderColor: "border-[#14F195]/20",
    activeBorderColor: "border-[#14F195]",
    hoverBgColor: "hover:bg-[#14F195]/5",
    glowClass: "shadow-[0_0_15px_rgba(20,241,149,0.15)]",
  },
];

/**
 * Validates whether a token + network combination is allowed.
 */
export function isSupportedPaymentCombination(token: PaymentMethod, network: NetworkId): boolean {
  const allowedNetworks = SUPPORTED_PAYMENT_COMBINATIONS[token];
  return Boolean(allowedNetworks && allowedNetworks.includes(network));
}

/**
 * Retrieves the official deposit address for a given token and network.
 * Returns null if the combination is invalid.
 */
export function getOfficialDepositAddress(token: PaymentMethod, network: NetworkId): string | null {
  if (!isSupportedPaymentCombination(token, network)) {
    return null;
  }
  return CRYPTO_WALLETS[network]?.[token] || null;
}

/**
 * Returns the list of network options available for a given token.
 */
export function getValidNetworksForToken(token: PaymentMethod): CryptoNetworkOption[] {
  const allowedNetworks = SUPPORTED_PAYMENT_COMBINATIONS[token] || [];
  return NETWORK_OPTIONS.filter((net) => allowedNetworks.includes(net.id));
}

/**
 * Standard Network Warning Message
 */
export function getNetworkWarning(token: PaymentMethod): string {
  return `Only send ${token} on the selected network to this address. Sending through another network may result in permanent loss of funds.`;
}

/**
 * Validates and returns the official price for a plan and billing period.
 */
export function getOfficialPlanPrice(plan: string, billingPeriod: "monthly" | "yearly"): number {
  const isYearly = billingPeriod === "yearly";
  const normalizedPlan = plan.toLowerCase().trim();

  if (normalizedPlan === "explorer" || normalizedPlan === "free") {
    return 0;
  }

  // Samurai & Daimyo
  if (isYearly) {
    return OFFICIAL_PRICING.yearly.amount; // $220 USD
  }
  return OFFICIAL_PRICING.monthly.amount; // $22 USD
}
