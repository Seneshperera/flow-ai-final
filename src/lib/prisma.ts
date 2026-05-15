import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  flowPilotPrisma: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.flowPilotPrisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.flowPilotPrisma = prisma
