import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const members = await prisma.organizationMember.findMany();
  console.log("Total members in DB:", members.length);
  console.dir(members, { depth: null });
  
  const users = await prisma.user.findMany();
  console.log("Total users in DB:", users.length);
  console.dir(users, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
