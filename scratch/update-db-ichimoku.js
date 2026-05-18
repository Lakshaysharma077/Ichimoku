const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const meaningSection = {
  heading: "Ichimoku Kinkō Hyō — 一目均衡表",
  subheading: "Ichimoku Kinkō Hyō is written in Japanese as:",
  japaneseText: "一目均衡表",
  translationLabel: "It is commonly translated as:",
  translations: [
    "“One-glance equilibrium chart”",
    "“At-a-glance balance chart”"
  ],
  purpose: "The name reflects the original purpose of Ichimoku: to help traders understand market structure, trend, balance, support, resistance, and momentum with a single visual reading of the chart.",
  characterTitle: "Meaning of Each Character",
  characters: [
    { char: "一", name: "One", desc: "Represents the idea of seeing the market in one look." },
    { char: "目", name: "Eye / glance", desc: "Together with 一, it forms 一目, meaning “one glance” or “at a glance.”" },
    { char: "均衡", name: "Balance / equilibrium", desc: "Refers to the balance between price, time, and market structure." },
    { char: "表", name: "Chart / table", desc: "Refers to a visual chart or display." }
  ],
  breakdownTitle: "Full Breakdown",
  breakdowns: [
    { key: "一目", val: "one glance / at a glance" },
    { key: "均衡", val: "balance / equilibrium" },
    { key: "表", val: "chart / table" }
  ],
  conclusion: "So 一目均衡表 can be understood as: “A chart that shows market equilibrium at a glance.”",
  whyTitle: "Why This Matters",
  whyText1: "Ichimoku is not just a set of lines on a chart. Its name already explains its philosophy: the trader should be able to read the market structure quickly and clearly.",
  whyText2: "The character 一 is especially important because it represents simplicity, clarity, and instant visual understanding — the core idea behind Ichimoku."
};

async function main() {
  try {
    console.log('Fetching existing ichimoku content from database...');
    const record = await prisma.contentSection.findUnique({
      where: { key: 'ichimoku' }
    });

    if (!record) {
      console.log('No database record found for ichimoku. Creating a new one...');
      await prisma.contentSection.create({
        data: {
          key: 'ichimoku',
          value: JSON.stringify({ meaningSection })
        }
      });
      console.log('Database record created successfully!');
      return;
    }

    const dbValue = JSON.parse(record.value);
    console.log('Merging meaningSection into existing database content...');
    
    const mergedValue = {
      ...dbValue,
      meaningSection
    };

    console.log('Updating database record...');
    await prisma.contentSection.update({
      where: { key: 'ichimoku' },
      data: { value: JSON.stringify(mergedValue) }
    });

    console.log('Database updated successfully with the new meaningSection!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating database:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
