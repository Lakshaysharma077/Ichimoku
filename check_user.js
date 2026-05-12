const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'arno@admin.com' } });
  console.log('USER_CHECK:', JSON.stringify(user, null, 2));
  process.exit(0);
}
main();
