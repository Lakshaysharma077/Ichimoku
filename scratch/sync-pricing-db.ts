import { prisma } from "../lib/db";
import { staticContent } from "../lib/content";

async function main() {
  console.log("Checking ContentSection table for 'pricing'...");

  const existingContent = await prisma.contentSection.findUnique({
    where: { key: "pricing" },
  });

  if (existingContent) {
    console.log("Found existing ContentSection for pricing:");
    console.log(existingContent.value);

    let parsed = JSON.parse(existingContent.value);
    if (parsed.tiers) {
      parsed.tiers = parsed.tiers.map((t: any) => {
        if (t.name === "Samurai" || t.name?.toLowerCase().includes("samurai")) {
          return {
            ...t,
            monthlyPrice: "$22",
            yearlyPrice: "$18.33",
            subtext: "Then $22/mo. Cancel anytime.",
          };
        }
        return t;
      });
    }

    await prisma.contentSection.update({
      where: { key: "pricing" },
      data: { value: JSON.stringify(parsed) },
    });
    console.log("Updated ContentSection 'pricing' with Samurai $22/mo!");
  } else {
    console.log("No existing ContentSection for 'pricing' in DB. Upserting fresh staticContent.pricing...");
    await prisma.contentSection.upsert({
      where: { key: "pricing" },
      update: { value: JSON.stringify(staticContent.pricing) },
      create: { key: "pricing", value: JSON.stringify(staticContent.pricing) },
    });
  }

  // Also check and update Plan table
  const plans = await prisma.plan.findMany();
  console.log("Found plans in DB:", plans);
  for (const p of plans) {
    if (p.name.toLowerCase().includes("samurai")) {
      await prisma.plan.update({
        where: { id: p.id },
        data: { price: 22.0 },
      });
      console.log(`Updated plan ${p.name} price to 22.0`);
    }
  }

  // Also check PricingTier table if any
  try {
    const tiers = await (prisma as any).pricingTier.findMany();
    console.log("Found pricingTiers in DB:", tiers);
    for (const t of tiers) {
      if (t.name.toLowerCase().includes("samurai")) {
        await (prisma as any).pricingTier.update({
          where: { id: t.id },
          data: {
            monthlyPrice: "$22",
            yearlyPrice: "$18.33",
            ctaText: "Get Samurai Access",
            isTrial: false,
          },
        });
        console.log(`Updated pricingTier ${t.name} to $22/mo and $18.33/mo!`);
      }
    }
  } catch (e) {
    console.log("PricingTier check note:", e);
  }

  console.log("Pricing sync complete!");
}

main()
  .catch((err) => console.error("Error in sync-pricing-db:", err))
  .finally(() => prisma.$disconnect());
