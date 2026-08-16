import {
  OFFICIAL_WALLETS,
  OFFICIAL_PRICING,
  SUPPORTED_PAYMENT_COMBINATIONS,
  getOfficialDepositAddress,
  isSupportedPaymentCombination,
  getOfficialPlanPrice,
  getNetworkWarning,
  PaymentMethod,
  NetworkId,
} from "../lib/payments";
import { verifyCryptoTransaction } from "../lib/payments/verificationService";

async function runTests() {
  console.log("=== ICHIMOKU EDGE CRYPTO PAYMENT SYSTEM TESTS ===");

  // 1. Check Official Wallets
  console.log("\n[TEST 1] Official Wallet Addresses:");
  console.log("EVM Address:", OFFICIAL_WALLETS.EVM);
  console.log("TRON Address:", OFFICIAL_WALLETS.TRON);
  console.log("SOLANA Address:", OFFICIAL_WALLETS.SOLANA);

  if (OFFICIAL_WALLETS.EVM !== "0x1c9b33ee3ce959a55b1fb148b383fcd087e01680") {
    throw new Error("EVM Address mismatch!");
  }
  if (OFFICIAL_WALLETS.TRON !== "TMbyjr1ShhWcT3RzRdXQZpU5ueZxmS2LgM") {
    throw new Error("TRON Address mismatch!");
  }
  if (OFFICIAL_WALLETS.SOLANA !== "8NzzF11sxfuYCEqKxGqQQMHSeYNQkVuBPWA1TRKZmcyN") {
    throw new Error("SOLANA Address mismatch!");
  }
  console.log("✓ All official wallet addresses match client specifications exactly.");

  // 2. Check Valid Combinations Matrix
  console.log("\n[TEST 2] Valid Payment Combinations Matrix:");
  const expectedValidPairs: [PaymentMethod, NetworkId, string][] = [
    ["USDT", "ethereum", OFFICIAL_WALLETS.EVM],
    ["USDT", "arbitrum", OFFICIAL_WALLETS.EVM],
    ["USDT", "avalanche", OFFICIAL_WALLETS.EVM],
    ["USDT", "trc20", OFFICIAL_WALLETS.TRON],
    ["USDC", "ethereum", OFFICIAL_WALLETS.EVM],
    ["USDC", "arbitrum", OFFICIAL_WALLETS.EVM],
    ["USDC", "avalanche", OFFICIAL_WALLETS.EVM],
    ["USDC", "solana", OFFICIAL_WALLETS.SOLANA],
  ];

  for (const [token, network, expectedAddr] of expectedValidPairs) {
    const isValid = isSupportedPaymentCombination(token, network);
    const addr = getOfficialDepositAddress(token, network);
    if (!isValid || addr !== expectedAddr) {
      throw new Error(`Failed valid combination test: ${token} on ${network} (got addr: ${addr}, expected: ${expectedAddr})`);
    }
    console.log(`✓ ${token} + ${network} -> ${addr}`);
  }

  // 3. Check Invalid Combinations are Rejected
  console.log("\n[TEST 3] Invalid Payment Combinations Blocked:");
  const invalidPairs: [PaymentMethod, NetworkId][] = [
    ["USDT", "solana"], // USDT on Solana is NOT allowed
    ["USDC", "trc20"],  // USDC on TRON is NOT allowed
  ];

  for (const [token, network] of invalidPairs) {
    const isValid = isSupportedPaymentCombination(token, network);
    const addr = getOfficialDepositAddress(token, network);
    if (isValid || addr !== null) {
      throw new Error(`Invalid combination was incorrectly permitted: ${token} on ${network}`);
    }
    console.log(`✓ ${token} + ${network} -> BLOCKED (Valid: ${isValid}, Address: ${addr})`);
  }

  // 4. Check Pricing
  console.log("\n[TEST 4] Pricing in USD:");
  const monthlyPrice = getOfficialPlanPrice("Samurai", "monthly");
  const yearlyPrice = getOfficialPlanPrice("Samurai", "yearly");
  console.log(`Monthly: $${monthlyPrice} USD / month`);
  console.log(`Yearly: $${yearlyPrice} USD / year (2 months free)`);

  if (monthlyPrice !== 22) throw new Error("Monthly price should be 22");
  if (yearlyPrice !== 220) throw new Error("Yearly price should be 220");
  console.log("✓ Pricing calculations validated: $22/mo and $220/yr.");

  // 5. Test Live On-Chain Verification Engine with Dummy Hash
  console.log("\n[TEST 5] Live Blockchain Verification Engine (Invalid Hash Check):");
  const dummyVerifyResult = await verifyCryptoTransaction({
    id: "test-id-123",
    txnHash: "0x0000000000000000000000000000000000000000000000000000000000000001",
    amount: 22,
    paymentMethod: "USDT",
    network: "Arbitrum One (Arbitrum One)",
    walletAddressUsed: OFFICIAL_WALLETS.EVM,
  });

  console.log("Verification Status:", dummyVerifyResult.statusText);
  console.log("Is Verified:", dummyVerifyResult.isVerified);
  console.log("Failure Reason:", dummyVerifyResult.failureReason);

  if (dummyVerifyResult.isVerified === true || dummyVerifyResult.statusText === "VERIFIED") {
    throw new Error("Dummy unmined hash was falsely marked as VERIFIED!");
  }
  console.log("✓ Non-mock verification correctly identified invalid/unmined transaction and rejected verification.");

  console.log("\n=== ALL UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
