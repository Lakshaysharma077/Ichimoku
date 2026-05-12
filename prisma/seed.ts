import 'dotenv/config';
import { prisma } from '../lib/db';
import bcrypt from 'bcryptjs';
import { content } from '../lib/content';

async function main() {
  console.log('Seed: Starting...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('arno@123', 10);
  await prisma.user.upsert({
    where: { email: 'arno@admin.com' },
    update: {},
    create: {
      email: 'arno@admin.com',
      password: adminPassword,
      name: 'Arno Admin',
      role: 'ADMIN',
    },
  });
  console.log('Seed: Admin user created/verified');

  // 1b. Create Regular User
  const userPassword = await bcrypt.hash('user@123', 10);
  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log('Seed: Regular user created/verified');

  // 2. Seed Content Sections
  const sections = [
    { key: 'navbar', value: JSON.stringify(content.navbar) },
    { key: 'hero', value: JSON.stringify(content.hero) },
    { key: 'philosophy', value: JSON.stringify(content.philosophy) },
    { key: 'dashboard', value: JSON.stringify(content.dashboard) },
    { key: 'footer', value: JSON.stringify(content.footer) },
    { key: 'ichimoku', value: JSON.stringify(content.ichimoku) },
    { key: 'education', value: JSON.stringify(content.education) },
    { key: 'legal', value: JSON.stringify(content.legal) },
    { key: 'tools', value: JSON.stringify(content.tools) },
    { key: 'pricing', value: JSON.stringify(content.pricing) },
  ];

  for (const section of sections) {
    await prisma.contentSection.upsert({
      where: { key: section.key },
      update: { value: section.value },
      create: section,
    });
  }
  console.log('Seed: Content sections seeded');

  // 3. Seed Glossary
  await prisma.glossaryTerm.deleteMany();
  for (let i = 0; i < content.glossary.data.length; i++) {
    const term = content.glossary.data[i];
    await prisma.glossaryTerm.create({
      data: {
        romanized: term.romanized,
        japanese: term.japanese,
        english: term.english,
        isMain: content.glossary.mainWords.includes(term.romanized),
        order: i,
      },
    });
  }
  console.log('Seed: Glossary terms seeded');

  // 4. Seed FAQ
  await prisma.faqItem.deleteMany();
  for (let i = 0; i < content.faq.data.length; i++) {
    const item = content.faq.data[i];
    await prisma.faqItem.create({
      data: {
        question: item.question,
        answer: item.answer,
        categories: JSON.stringify(item.categories),
        order: i,
      },
    });
  }
  console.log('Seed: FAQ items seeded');

  // 5. Seed Pricing
  await prisma.pricingTier.deleteMany();
  for (let i = 0; i < content.pricing.tiers.length; i++) {
    const tier = content.pricing.tiers[i];
    const createdTier = await prisma.pricingTier.create({
      data: {
        name: tier.name,
        monthlyPrice: tier.monthlyPrice,
        yearlyPrice: tier.yearlyPrice,
        tagline: tier.tagline,
        ctaText: tier.ctaText,
        isFeatured: 'isFeatured' in tier ? (tier as any).isFeatured : false,
        isTrial: 'isTrial' in tier ? (tier as any).isTrial : false,
        order: i,
      },
    });

    for (const feature of tier.features) {
      await prisma.pricingFeature.create({
        data: {
          text: feature.text,
          included: feature.included,
          tierId: createdTier.id,
        },
      });
    }
  }
  console.log('Seed: Pricing tiers seeded');

  // 6. Seed Stats
  await prisma.stat.deleteMany();
  for (let i = 0; i < content.stats.length; i++) {
    const stat = content.stats[i];
    await prisma.stat.create({
      data: {
        label: stat.label,
        value: stat.value,
        suffix: stat.suffix,
        order: i,
      },
    });
  }
  console.log('Seed: Stats seeded');

  console.log('Seed: Finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
