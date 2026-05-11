import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const automations = await prisma.automation.findMany();
  console.log("Total automations in DB:", automations.length);
  console.dir(automations, { depth: null });
  
  const orgs = await prisma.organization.findMany();
  console.log("Total orgs in DB:", orgs.length);
  console.dir(orgs, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
