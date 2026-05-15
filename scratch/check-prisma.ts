import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function checkPrisma() {
  console.log("Prisma keys:", Object.keys(prisma).filter(k => !k.startsWith("_")));
  try {
    const count = await (prisma as any).customer.count();
    console.log("Customer count:", count);
  } catch (e: any) {
    console.error("Error accessing customer:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrisma();
