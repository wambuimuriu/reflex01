import { query, pool } from '../lib/db'

async function main() {
  await query('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, initials TEXT NOT NULL, password_hash TEXT)')
  await query("CREATE TABLE IF NOT EXISTS deliveries (id TEXT PRIMARY KEY, reference TEXT NOT NULL, retailer TEXT NOT NULL, retailer_id TEXT, address TEXT NOT NULL, status TEXT NOT NULL, rider_id TEXT, eta TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, confirmation_code TEXT, confirmation_status TEXT NOT NULL DEFAULT 'pending', confirmed_at TIMESTAMPTZ)")
  await query('CREATE TABLE IF NOT EXISTS status_history (id BIGSERIAL PRIMARY KEY, delivery_id TEXT NOT NULL, from_status TEXT, to_status TEXT NOT NULL, actor_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL)')
  await query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS retailer_id TEXT')
  await query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS confirmation_code TEXT')
  await query("ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS confirmation_status TEXT NOT NULL DEFAULT 'pending'")
  await query('ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ')
  await query('UPDATE deliveries SET retailer_id = (SELECT id FROM users WHERE users.name = deliveries.retailer) WHERE retailer_id IS NULL')
  await pool.end()
  console.log('Postgres schema is ready.')
}

main().catch(async (error) => { console.error(error); await pool.end(); process.exitCode = 1 })
