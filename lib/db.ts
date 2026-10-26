import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: (PrismaClient & { indicatorAccessRequest: any }) | undefined;
};

export const prisma: PrismaClient & { indicatorAccessRequest: any } =
  (globalForPrisma.prisma ??
  new PrismaClient()) as any;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
