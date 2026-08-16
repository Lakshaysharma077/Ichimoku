import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Initiating Supabase Keep-Alive ping...`);

  try {
    // Perform raw SQL ping query
    await prisma.$queryRaw`SELECT 1;`;
    const latency = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✅ Supabase Database ping successful (${latency}ms)`);
    process.exit(0);
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] ❌ Supabase Database ping failed:`, error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
