import 'dotenv/config'

export type DbProvider = 'sqlite' | 'postgresql'

export function detectProviderFromUrl(url: string): DbProvider {
  const u = url.toLowerCase()
  if (u.startsWith('file:')) return 'sqlite'
  if (u.startsWith('postgres://') || u.startsWith('postgresql://') || u.startsWith('prisma+postgres://')) {
    return 'postgresql'
  }
  return 'sqlite'
}

export const dbProvider: DbProvider = detectProviderFromUrl(process.env.DATABASE_URL ?? '')
