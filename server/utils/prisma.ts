import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../prisma/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing required env: DATABASE_URL')
    }
    // Prisma 7 requires a driver adapter — `new PrismaClient()` without one throws.
    const adapter = new PrismaPg({ connectionString })
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
    })
  }
  return globalForPrisma.prisma
}

// MOCK/PREVIEW MODE: construct the Prisma client lazily on first use.
// Nitro auto-imports this module everywhere, so building the client at import
// time crashes the whole server when no database/driver adapter is configured.
// The Proxy defers construction until a query is actually made.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value
  },
})
