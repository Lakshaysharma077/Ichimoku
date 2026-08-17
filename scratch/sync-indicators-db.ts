import { prisma } from "../lib/db";

async function main() {
  const indicators = await prisma.indicatorItem.findMany();
  console.log(`Found ${indicators.length} indicators in DB:`);
  for (const ind of indicators) {
    if (ind.priceLabel?.includes("29")) {
      await prisma.indicatorItem.update({
        where: { id: ind.id },
        data: { priceLabel: "$22/mo" },
      });
      console.log(`Updated indicator ${ind.name} priceLabel from ${ind.priceLabel} to $22/mo`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
