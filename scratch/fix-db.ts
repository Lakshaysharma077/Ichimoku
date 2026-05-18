import { PrismaClient } from '@prisma/client';
process.env.DATABASE_URL = "postgresql://postgres:Ichimoku1231@db.jxjqzhvzstediyuhrtgf.supabase.co:5432/postgres";
const prisma = new PrismaClient();

async function fix() {
  const content = await prisma.contentSection.findUnique({ where: { key: 'stats' } });
  if (content) {
    const data = JSON.parse(content.value);
    
    // If it's an object { '0': {...}, '1': {...} }, convert it to an array
    if (!Array.isArray(data) && typeof data === 'object') {
      const fixedData = Object.values(data);
      await prisma.contentSection.update({
        where: { key: 'stats' },
        data: { value: JSON.stringify(fixedData) }
      });
      console.log('Fixed stats array in DB!');
    } else {
      console.log('Stats is already an array:', data);
    }
  }
}
fix().catch(console.error).finally(() => prisma.$disconnect());
