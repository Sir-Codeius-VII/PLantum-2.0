import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = prisma
  }
} 