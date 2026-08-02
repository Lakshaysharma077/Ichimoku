import { CryptoNetworkOption, NetworkId, PaymentMethod } from "./types";

export interface CryptoWalletConfig {
  address: string;
  qrValuePattern: string; // e.g. "ethereum:{address}?amount={amount}"
}

// Deposit Wallet Addresses by Network
export const CRYPTO_WALLETS: Record<NetworkId, Record<PaymentMethod, string>> = {
  arbitrum: {
    USDC: "0x27f1cEb56F88E09BDefb751b7401b5f6D8976fC7",
    USDT: "0x27f1cEb56F88E09BDefb751b7401b5f6D8976fC7",
  },
  ethereum: {
    USDC: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    USDT: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  solana: {
    USDC: "SolEdge111111111111111111111111111111111111",
    USDT: "SolEdge111111111111111111111111111111111111",
  },
  avalanche: {
    USDC: "0xe841C7656EC7AB88B098dEfB751b7401b5f6D897",
    USDT: "0xe841C7656EC7AB88B098dEfB751b7401b5f6D897",
  },
  trc20: {
    USDC: "TEdgeIchimoku1111111111111111111111111",
    USDT: "TEdgeIchimoku1111111111111111111111111",
  },
  polygon: {
    USDC: "0x27f1cEb56F88E09BDefb751b7401b5f6D8976fC7",
    USDT: "0x27f1cEb56F88E09BDefb751b7401b5f6D8976fC7",
  },
};

// Supported Networks display config
export const NETWORK_OPTIONS: CryptoNetworkOption[] = [
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
    id: "solana",
    name: "Solana",
    badge: "SPL",
    color: "text-[#14F195]",
    borderColor: "border-[#14F195]/20",
    activeBorderColor: "border-[#14F195]",
    hoverBgColor: "hover:bg-[#14F195]/5",
    glowClass: "shadow-[0_0_15px_rgba(20,241,149,0.15)]",
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
    id: "avalanche",
    name: "Avalanche",
    badge: "C-Chain",
    color: "text-[#E84142]",
    borderColor: "border-[#E84142]/20",
    activeBorderColor: "border-[#E84142]",
    hoverBgColor: "hover:bg-[#E84142]/5",
    glowClass: "shadow-[0_0_15px_rgba(232,65,66,0.15)]",
  },
];
