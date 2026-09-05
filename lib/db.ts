import { Pool, type QueryResultRow } from 'pg'

const globalForDb = globalThis as typeof globalThis & { pgPool?: Pool }

const connectionString = process.env.DATABASE_URL

export const pool = globalForDb.pgPool ?? (connectionString ? new Pool({ connectionString, max: 5, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined }) : null)

if (pool && process.env.NODE_ENV !== 'production') globalForDb.pgPool = pool

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  if (!pool) throw new Error('DATABASE_URL is required at request time')
  return pool.query<T>(text, values)
}

export default pool
