import 'dotenv/config'
import { PrismaClient } from '@prisma/my-client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaPg } from '@prisma/adapter-pg'
import { dbProvider } from './dbProvider'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const adapter =
  dbProvider === 'sqlite'
    ? new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' })
    : new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

export default prisma
