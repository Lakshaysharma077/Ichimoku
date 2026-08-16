import { getExplorerTxUrl } from "./explorers";
import { OFFICIAL_WALLETS } from "./config";

export interface VerificationDetails {
  isVerified: boolean;
  statusText: "VERIFIED" | "FAILED" | "NOT_VERIFIED";
  amountReceived: number;
  recipientWallet: string;
  confirmationCount: number;
  failureReason?: string;
  verifiedAt: string;
  explorerUrl?: string;
}

export interface VerifyPaymentInput {
  id: string;
  txnHash?: string | null;
  amount: number;
  paymentMethod: string;
  network: string;
  walletAddressUsed: string;
  paymentScreenshot?: string | null;
}

// Known Contract Addresses & Decimals
const EVM_CONTRACTS: Record<string, Record<string, { address: string; decimals: number }[]>> = {
  ethereum: {
    USDT: [{ address: "0xdac17f958d2ee523a2206206994597c13d831ec7", decimals: 6 }],
    USDC: [{ address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 }],
  },
  arbitrum: {
    USDT: [{ address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", decimals: 6 }],
    USDC: [
      { address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831", decimals: 6 }, // Native USDC
      { address: "0xff970a61a04b1ca14834a43f5de4533ebdcb5cc8", decimals: 6 }, // Bridged USDC.e
    ],
  },
  avalanche: {
    USDT: [{ address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7", decimals: 6 }],
    USDC: [{ address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e", decimals: 6 }],
  },
};

// Public RPC endpoints with fallbacks
const EVM_RPCS: Record<string, string[]> = {
  ethereum: [
    "https://cloudflare-eth.com",
    "https://rpc.ankr.com/eth",
    "https://eth.llamarpc.com",
  ],
  arbitrum: [
    "https://arb1.arbitrum.io/rpc",
    "https://rpc.ankr.com/arbitrum",
    "https://arbitrum.llamarpc.com",
  ],
  avalanche: [
    "https://api.avax.network/ext/bc/C/rpc",
    "https://rpc.ankr.com/avalanche",
    "https://avalanche.llamarpc.com",
  ],
};

const SOLANA_RPCS = [
  "https://api.mainnet-beta.solana.com",
  "https://rpc.ankr.com/solana",
];

const SOLANA_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

/**
 * Execute an EVM JSON-RPC call with failover across multiple public RPC nodes.
 */
async function callEvmRpc(networkKey: string, method: string, params: any[]): Promise<any> {
  const rpcs = EVM_RPCS[networkKey] || EVM_RPCS.ethereum;
  let lastError: any = null;

  for (const rpcUrl of rpcs) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method,
          params,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${rpcUrl}`);
      }

      const json = await response.json();
      if (json.error) {
        throw new Error(json.error.message || "RPC returned error");
      }

      return json.result;
    } catch (err: any) {
      lastError = err;
      // Try next RPC node
    }
  }

  throw lastError || new Error(`All RPC nodes failed for ${networkKey}`);
}

/**
 * Verify EVM Blockchain Transaction (Ethereum, Arbitrum, Avalanche).
 */
async function verifyEvmTransaction(
  networkKey: string,
  txHash: string,
  expectedToken: string,
  expectedAmount: number
): Promise<{
  isVerified: boolean;
  amountReceived: number;
  confirmations: number;
  reason?: string;
}> {
  // 1. Fetch Transaction Receipt
  const receipt = await callEvmRpc(networkKey, "eth_getTransactionReceipt", [txHash]);
  if (!receipt) {
    return {
      isVerified: false,
      amountReceived: 0,
      confirmations: 0,
      reason: "Transaction not found or pending in mempool. Has not been mined yet.",
    };
  }

  // 2. Check Execution Status (0x1 = Success, 0x0 = Reverted)
  if (receipt.status !== "0x1") {
    return {
      isVerified: false,
      amountReceived: 0,
      confirmations: 0,
      reason: "Transaction execution reverted or failed on the blockchain.",
    };
  }

  // 3. Calculate Confirmation Count
  let confirmations = 1;
  try {
    const currentBlockHex = await callEvmRpc(networkKey, "eth_blockNumber", []);
    const currentBlock = parseInt(currentBlockHex, 16);
    const txBlock = parseInt(receipt.blockNumber, 16);
    if (!isNaN(currentBlock) && !isNaN(txBlock)) {
      confirmations = Math.max(1, currentBlock - txBlock + 1);
    }
  } catch {}

  // 4. Verify ERC-20 Transfer Logs
  const expectedRecipient = OFFICIAL_WALLETS.EVM.toLowerCase();
  const tokenConfigs = EVM_CONTRACTS[networkKey]?.[expectedToken.toUpperCase()] || [];
  const validContractAddresses = tokenConfigs.map((c) => c.address.toLowerCase());

  const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"; // Transfer(address,address,uint256)

  let totalReceivedTokens = 0;
  let foundValidRecipientLog = false;
  let contractMatched = false;

  for (const log of receipt.logs || []) {
    const logAddress = (log.address || "").toLowerCase();
    const topics = log.topics || [];

    if (topics.length >= 3 && topics[0].toLowerCase() === transferTopic) {
      // Check recipient in topic[2]
      const toAddress = "0x" + topics[2].slice(-40).toLowerCase();

      if (toAddress === expectedRecipient) {
        foundValidRecipientLog = true;

        if (validContractAddresses.includes(logAddress)) {
          contractMatched = true;
          // Parse value from data hex
          const dataHex = log.data || "0x0";
          const rawValue = BigInt(dataHex.startsWith("0x") ? dataHex : "0x" + dataHex);
          // USDT & USDC use 6 decimals on EVM
          const tokenAmount = Number(rawValue) / 1_000_000;
          totalReceivedTokens += tokenAmount;
        }
      }
    }
  }

  if (!foundValidRecipientLog) {
    return {
      isVerified: false,
      amountReceived: 0,
      confirmations,
      reason: `No ERC-20 Transfer log found paying to official address ${OFFICIAL_WALLETS.EVM}.`,
    };
  }

  if (!contractMatched) {
    return {
      isVerified: false,
      amountReceived: 0,
      confirmations,
      reason: `Tokens were transferred, but contract address did not match official ${expectedToken} token contract on ${networkKey}.`,
    };
  }

  // 5. Amount check (Allow 0.5% tolerance for slippage/micro rounding if applicable)
  if (totalReceivedTokens < expectedAmount * 0.995) {
    return {
      isVerified: false,
      amountReceived: totalReceivedTokens,
      confirmations,
      reason: `Amount received ($${totalReceivedTokens.toFixed(2)}) is less than required plan amount ($${expectedAmount.toFixed(2)}).`,
    };
  }

  return {
    isVerified: true,
    amountReceived: totalReceivedTokens,
    confirmations,
  };
}

/**
 * Verify TRON (TRC-20) Blockchain Transaction.
 */
async function verifyTronTransaction(
  txHash: string,
  expectedAmount: number
): Promise<{
  isVerified: boolean;
  amountReceived: number;
  confirmations: number;
  reason?: string;
}> {
  const cleanHash = txHash.startsWith("0x") ? txHash.slice(2) : txHash;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    // Query TronGrid for transaction info
    const infoRes = await fetch("https://api.trongrid.io/wallet/gettransactioninfobyid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: cleanHash }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!infoRes.ok) {
      throw new Error(`TronGrid HTTP ${infoRes.status}`);
    }

    const txInfo = await infoRes.json();

    if (!txInfo || Object.keys(txInfo).length === 0 || !txInfo.id) {
      return {
        isVerified: false,
        amountReceived: 0,
        confirmations: 0,
        reason: "Transaction not found on TRON blockchain. Ensure the TXID is confirmed.",
      };
    }

    // Check execution status
    if (txInfo.result && txInfo.result === "FAILED") {
      return {
        isVerified: false,
        amountReceived: 0,
        confirmations: 0,
        reason: "TRON transaction failed or reverted.",
      };
    }

    // Check TRC-20 logs
    const expectedRecipient = OFFICIAL_WALLETS.TRON; // TMbyjr1ShhWcT3RzRdXQZpU5ueZxmS2LgM
    const logList = txInfo.log || [];
    let receivedAmount = 0;
    let foundRecipient = false;

    for (const log of logList) {
      const topics = log.topics || [];
      // TRC-20 Transfer topic
      if (topics.length >= 3 && topics[0].toLowerCase().includes("ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")) {
        // Hex address of TMbyjr1ShhWcT3RzRdXQZpU5ueZxmS2LgM is 417f54c25f4fe6b2a0c64898115502fc809a48d601
        const toTopicHex = topics[2].toLowerCase();
        if (toTopicHex.includes("7f54c25f4fe6b2a0c64898115502fc809a48d601")) {
          foundRecipient = true;
          const dataHex = log.data || "0";
          const rawValue = BigInt("0x" + dataHex);
          receivedAmount += Number(rawValue) / 1_000_000;
        }
      }
    }

    // Also check event API if log format is compact
    if (!foundRecipient || receivedAmount === 0) {
      try {
        const eventsRes = await fetch(`https://api.trongrid.io/v1/transactions/${cleanHash}/events`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          for (const ev of eventsData.data || []) {
            if (ev.event_name === "Transfer" && (ev.result?.to === expectedRecipient || ev.result?.to_address === expectedRecipient)) {
              foundRecipient = true;
              const val = Number(ev.result?.value || ev.result?.amount || 0) / 1_000_000;
              receivedAmount += val;
            }
          }
        }
      } catch {}
    }

    if (!foundRecipient) {
      return {
        isVerified: false,
        amountReceived: 0,
        confirmations: 1,
        reason: `Transaction does not transfer USDT to official TRON wallet ${expectedRecipient}.`,
      };
    }

    if (receivedAmount < expectedAmount * 0.995) {
      return {
        isVerified: false,
        amountReceived: receivedAmount,
        confirmations: 1,
        reason: `Amount received ($${receivedAmount.toFixed(2)}) is less than required plan amount ($${expectedAmount.toFixed(2)}).`,
      };
    }

    return {
      isVerified: true,
      amountReceived: receivedAmount,
      confirmations: 12,
    };
  } catch (err: any) {
    return {
      isVerified: false,
      amountReceived: 0,
      confirmations: 0,
      reason: `TRON verification error: ${err.message || "Failed to contact TronGrid API"}`,
    };
  }
}

/**
 * Verify Solana (SPL Token) Blockchain Transaction.
 */
async function verifySolanaTransaction(
  txHash: string,
  expectedAmount: number
): Promise<{
  isVerified: boolean;
  amountReceived: number;
  confirmations: number;
  reason?: string;
}> {
  let lastError: any = null;

  for (const rpcUrl of SOLANA_RPCS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "getTransaction",
          params: [
            txHash,
            {
              encoding: "jsonParsed",
              maxSupportedTransactionVersion: 0,
              commitment: "confirmed",
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Solana RPC HTTP ${response.status}`);
      }

      const data = await response.json();
      const tx = data.result;

      if (!tx) {
        return {
          isVerified: false,
          amountReceived: 0,
          confirmations: 0,
          reason: "Transaction not found on Solana blockchain. It may still be confirming.",
        };
      }

      if (tx.meta?.err) {
        return {
          isVerified: false,
          amountReceived: 0,
          confirmations: 0,
          reason: `Solana transaction failed: ${JSON.stringify(tx.meta.err)}`,
        };
      }

      // Check Token Balance changes for the recipient wallet
      const expectedRecipient = OFFICIAL_WALLETS.SOLANA;
      const preBalances = tx.meta?.preTokenBalances || [];
      const postBalances = tx.meta?.postTokenBalances || [];

      let netUsdcReceived = 0;
      let foundAccount = false;

      for (const post of postBalances) {
        if (post.owner === expectedRecipient && post.mint === SOLANA_USDC_MINT) {
          foundAccount = true;
          const postAmt = post.uiTokenAmount?.uiAmount || 0;
          const matchingPre = preBalances.find(
            (pre: any) => pre.accountIndex === post.accountIndex
          );
          const preAmt = matchingPre?.uiTokenAmount?.uiAmount || 0;
          const delta = postAmt - preAmt;
          if (delta > 0) {
            netUsdcReceived += delta;
          }
        }
      }

      // If token balances are not present in header, check instruction transfer
      if (!foundAccount || netUsdcReceived === 0) {
        const instructions = tx.transaction?.message?.instructions || [];
        for (const ix of instructions) {
          if (ix.program === "spl-token" && ix.parsed) {
            const info = ix.parsed.info;
            if (info && (info.destination === expectedRecipient || info.authority === expectedRecipient || info.mint === SOLANA_USDC_MINT)) {
              foundAccount = true;
              const amt = Number(info.amount || info.tokenAmount?.uiAmount || 0);
              if (amt > 0) {
                netUsdcReceived += amt > 1000 ? amt / 1_000_000 : amt;
              }
            }
          }
        }
      }

      if (!foundAccount || netUsdcReceived === 0) {
        return {
          isVerified: false,
          amountReceived: 0,
          confirmations: 1,
          reason: `No USDC transfer to official Solana wallet (${expectedRecipient}) found in this transaction.`,
        };
      }

      if (netUsdcReceived < expectedAmount * 0.995) {
        return {
          isVerified: false,
          amountReceived: netUsdcReceived,
          confirmations: 1,
          reason: `Amount received ($${netUsdcReceived.toFixed(2)}) is less than required plan amount ($${expectedAmount.toFixed(2)}).`,
        };
      }

      return {
        isVerified: true,
        amountReceived: netUsdcReceived,
        confirmations: 32,
      };
    } catch (err: any) {
      lastError = err;
    }
  }

  return {
    isVerified: false,
    amountReceived: 0,
    confirmations: 0,
    reason: `Solana verification error: ${lastError?.message || "Could not reach Solana RPC"}`,
  };
}

/**
 * Live Blockchain Verification Engine
 * Performs live, non-mock blockchain checks for Ethereum, Arbitrum, Avalanche, TRON, and Solana.
 */
export async function verifyCryptoTransaction(input: VerifyPaymentInput): Promise<VerificationDetails> {
  const verifiedAt = new Date().toISOString();
  const txHash = input.txnHash?.trim();
  const expectedAmount = input.amount;
  const networkName = (input.network || "").toLowerCase();
  const paymentMethod = (input.paymentMethod || "USDT").toUpperCase();

  const { url: explorerUrl } = getExplorerTxUrl(networkName, txHash || "");

  // 1. Transaction Hash Existence Check
  if (!txHash || txHash.length < 8) {
    return {
      isVerified: false,
      statusText: "FAILED",
      amountReceived: 0,
      recipientWallet: "None",
      confirmationCount: 0,
      failureReason: "Transaction Hash (TXID) was not provided or is invalid.",
      verifiedAt,
      explorerUrl,
    };
  }

  // 2. Identify Network & Validate Format
  const isArbitrum = networkName.includes("arbitrum");
  const isAvalanche = networkName.includes("avalanche") || networkName.includes("avax");
  const isEthereum = networkName.includes("ethereum") || networkName.includes("erc-20") || networkName.includes("eth");
  const isTron = networkName.includes("tron") || networkName.includes("trc") || networkName.includes("trc-20");
  const isSolana = networkName.includes("solana") || networkName.includes("spl");

  // Format checks
  if ((isEthereum || isArbitrum || isAvalanche) && (!txHash.startsWith("0x") || txHash.length !== 66)) {
    return {
      isVerified: false,
      statusText: "FAILED",
      amountReceived: 0,
      recipientWallet: OFFICIAL_WALLETS.EVM,
      confirmationCount: 0,
      failureReason: "Invalid EVM Transaction Hash format (expected 0x followed by 64 hexadecimal characters).",
      verifiedAt,
      explorerUrl,
    };
  }

  if (isTron && txHash.length < 60) {
    return {
      isVerified: false,
      statusText: "FAILED",
      amountReceived: 0,
      recipientWallet: OFFICIAL_WALLETS.TRON,
      confirmationCount: 0,
      failureReason: "Invalid TRON Transaction Hash format (expected 64 character hex hash).",
      verifiedAt,
      explorerUrl,
    };
  }

  // 3. Execute Real On-Chain Blockchain Check
  try {
    if (isArbitrum) {
      const res = await verifyEvmTransaction("arbitrum", txHash, paymentMethod, expectedAmount);
      return {
        isVerified: res.isVerified,
        statusText: res.isVerified ? "VERIFIED" : "FAILED",
        amountReceived: res.amountReceived,
        recipientWallet: OFFICIAL_WALLETS.EVM,
        confirmationCount: res.confirmations,
        failureReason: res.reason,
        verifiedAt,
        explorerUrl,
      };
    } else if (isAvalanche) {
      const res = await verifyEvmTransaction("avalanche", txHash, paymentMethod, expectedAmount);
      return {
        isVerified: res.isVerified,
        statusText: res.isVerified ? "VERIFIED" : "FAILED",
        amountReceived: res.amountReceived,
        recipientWallet: OFFICIAL_WALLETS.EVM,
        confirmationCount: res.confirmations,
        failureReason: res.reason,
        verifiedAt,
        explorerUrl,
      };
    } else if (isEthereum) {
      const res = await verifyEvmTransaction("ethereum", txHash, paymentMethod, expectedAmount);
      return {
        isVerified: res.isVerified,
        statusText: res.isVerified ? "VERIFIED" : "FAILED",
        amountReceived: res.amountReceived,
        recipientWallet: OFFICIAL_WALLETS.EVM,
        confirmationCount: res.confirmations,
        failureReason: res.reason,
        verifiedAt,
        explorerUrl,
      };
    } else if (isTron) {
      const res = await verifyTronTransaction(txHash, expectedAmount);
      return {
        isVerified: res.isVerified,
        statusText: res.isVerified ? "VERIFIED" : "FAILED",
        amountReceived: res.amountReceived,
        recipientWallet: OFFICIAL_WALLETS.TRON,
        confirmationCount: res.confirmations,
        failureReason: res.reason,
        verifiedAt,
        explorerUrl,
      };
    } else if (isSolana) {
      const res = await verifySolanaTransaction(txHash, expectedAmount);
      return {
        isVerified: res.isVerified,
        statusText: res.isVerified ? "VERIFIED" : "FAILED",
        amountReceived: res.amountReceived,
        recipientWallet: OFFICIAL_WALLETS.SOLANA,
        confirmationCount: res.confirmations,
        failureReason: res.reason,
        verifiedAt,
        explorerUrl,
      };
    } else {
      return {
        isVerified: false,
        statusText: "FAILED",
        amountReceived: 0,
        recipientWallet: "Unknown",
        confirmationCount: 0,
        failureReason: `Unsupported blockchain network: ${input.network}`,
        verifiedAt,
        explorerUrl,
      };
    }
  } catch (error: any) {
    return {
      isVerified: false,
      statusText: "FAILED",
      amountReceived: 0,
      recipientWallet: input.walletAddressUsed || "N/A",
      confirmationCount: 0,
      failureReason: error?.message || "Blockchain node connection timeout or query failed.",
      verifiedAt,
      explorerUrl,
    };
  }
}
