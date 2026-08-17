import { calculateTrialPeriod } from "../lib/subscription";

console.log("Testing 7-Day Trial Period Calculation...");

const { startDate, expiryDate } = calculateTrialPeriod(7);
console.log("Start Date:", startDate.toISOString());
console.log("Expiry Date:", expiryDate.toISOString());

const diffDays = Math.round((expiryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
console.log("Calculated Trial Duration in Days:", diffDays);

if (diffDays === 7) {
  console.log("✅ 7-Day Trial Calculation Passed!");
} else {
  console.error("❌ Test Failed! Expected 7 days, got", diffDays);
  process.exit(1);
}
