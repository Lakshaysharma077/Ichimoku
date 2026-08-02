/**
 * Modular Blockchain Explorer Registry for Ichimoku Edge Payment System
 * Easily extendable to add new blockchain networks.
 */

export interface ExplorerConfig {
  name: string;
  txUrlPattern: string; // e.g. "https://etherscan.io/tx/{txHash}"
  addressUrlPattern?: string;
  icon?: string;
}

export const BLOCKCHAIN_EXPLORERS: Record<string, ExplorerConfig> = {
  ethereum: {
    name: "Etherscan",
    txUrlPattern: "https://etherscan.io/tx/{txHash}",
    addressUrlPattern: "https://etherscan.io/address/{address}",
  },
  arbitrum: {
    name: "Arbiscan",
    txUrlPattern: "https://arbiscan.io/tx/{txHash}",
    addressUrlPattern: "https://arbiscan.io/address/{address}",
  },
  bsc: {
    name: "BscScan",
    txUrlPattern: "https://bscscan.com/tx/{txHash}",
    addressUrlPattern: "https://bscscan.com/address/{address}",
  },
  bnb: {
    name: "BscScan",
    txUrlPattern: "https://bscscan.com/tx/{txHash}",
    addressUrlPattern: "https://bscscan.com/address/{address}",
  },
  tron: {
    name: "TronScan",
    txUrlPattern: "https://tronscan.org/#/transaction/{txHash}",
    addressUrlPattern: "https://tronscan.org/#/address/{address}",
  },
  trc20: {
    name: "TronScan",
    txUrlPattern: "https://tronscan.org/#/transaction/{txHash}",
    addressUrlPattern: "https://tronscan.org/#/address/{address}",
  },
  polygon: {
    name: "PolygonScan",
    txUrlPattern: "https://polygonscan.com/tx/{txHash}",
    addressUrlPattern: "https://polygonscan.com/address/{address}",
  },
  solana: {
    name: "Solscan",
    txUrlPattern: "https://solscan.io/tx/{txHash}",
    addressUrlPattern: "https://solscan.io/account/{address}",
  },
  avalanche: {
    name: "Snowtrace",
    txUrlPattern: "https://snowtrace.io/tx/{txHash}",
    addressUrlPattern: "https://snowtrace.io/address/{address}",
  },
};

/**
 * Returns explorer URL for a given network and transaction hash.
 */
export function getExplorerTxUrl(networkName: string, txHash: string): { url: string; explorerName: string } {
  if (!txHash) {
    return { url: "#", explorerName: "Explorer" };
  }

  const normalized = networkName.toLowerCase().trim();

  // Find matching key in dictionary
  let matchedKey = Object.keys(BLOCKCHAIN_EXPLORERS).find(
    (key) => normalized.includes(key) || key.includes(normalized)
  );

  const config = matchedKey ? BLOCKCHAIN_EXPLORERS[matchedKey] : {
    name: "BlockExplorer",
    txUrlPattern: `https://etherscan.io/tx/{txHash}`,
  };

  const cleanHash = txHash.trim();
  const url = config.txUrlPattern.replace("{txHash}", cleanHash);

  return { url, explorerName: config.name };
}
