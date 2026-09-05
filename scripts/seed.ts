import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { scryptSync, randomBytes } from 'node:crypto'

const dir = join(process.cwd(), '.data')
mkdirSync(dir, { recursive: true })
const db = new Database(join(dir, 'courier.db'))
db.pragma('journal_mode = WAL')
db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, initials TEXT NOT NULL, password_hash TEXT); CREATE TABLE IF NOT EXISTS deliveries (id TEXT PRIMARY KEY, reference TEXT NOT NULL, retailer TEXT NOT NULL, retailer_id TEXT, address TEXT NOT NULL, status TEXT NOT NULL, rider_id TEXT, eta TEXT NOT NULL, created_at TEXT NOT NULL, confirmation_code TEXT, confirmation_status TEXT NOT NULL DEFAULT 'pending', confirmed_at TEXT); CREATE TABLE IF NOT EXISTS status_history (id INTEGER PRIMARY KEY AUTOINCREMENT, delivery_id TEXT NOT NULL, from_status TEXT, to_status TEXT NOT NULL, actor_id TEXT NOT NULL, created_at TEXT NOT NULL);`)
try { db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT') } catch {}
for (const statement of [
  'ALTER TABLE deliveries ADD COLUMN retailer_id TEXT',
  'ALTER TABLE deliveries ADD COLUMN confirmation_code TEXT',
  "ALTER TABLE deliveries ADD COLUMN confirmation_status TEXT NOT NULL DEFAULT 'pending'",
  'ALTER TABLE deliveries ADD COLUMN confirmed_at TEXT',
]) { try { db.exec(statement) } catch {} }
const password = 'Demo1234!'
const hash = () => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}` }
const users = [
  ['u-retailer-1', 'Wanjiku Mwangi', 'retailer', 'WM', '1retailer@reflex.dev'],
  ['u-retailer-2', 'Muranga Pharmacy Desk', 'retailer', 'MP', 'retailer2@reflex.dev'],
  ['u-dispatcher', 'Dispatch Central', 'dispatcher', 'DC', 'dispatcher@reflex.dev'],
  ['u-rider-1', 'Kevin Otieno', 'rider', 'KO', 'rider1@reflex.dev'],
  ['u-rider-2', 'Faith Wambui', 'rider', 'FW', 'rider2@reflex.dev'],
] as const
const upsert = db.prepare('INSERT OR REPLACE INTO users (id, name, role, initials, password_hash) VALUES (?, ?, ?, ?, ?)')
for (const [id, name, role, initials, email] of users) upsert.run(id, name, role, initials, `${email}:${hash()}`)
const count = (db.prepare('SELECT count(*) as count FROM deliveries').get() as { count: number }).count
if (!count) {
  db.exec("UPDATE deliveries SET retailer_id = (SELECT id FROM users WHERE users.name = deliveries.retailer) WHERE retailer_id IS NULL")
const insert = db.prepare('INSERT INTO deliveries (id, reference, retailer, retailer_id, address, status, rider_id, eta, created_at, confirmation_code, confirmation_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const now = new Date().toISOString()
  insert.run('del-jane-wanjiku', 'REF-1001', 'Wanjiku Mwangi', 'u-retailer-1', 'Kutus, Kirinyaga', 'Pending', 'u-rider-1', 'Today, 3:00 PM', now, 'REF-1001', 'pending')
  insert.run('del-ret-1-2', 'REF-1002', 'Wanjiku Mwangi', 'u-retailer-1', 'Nairobi CBD', 'Pending', null, 'Today, 4:00 PM', now, 'REF-1002', 'pending')
  insert.run('del-ret-1-3', 'REF-1003', 'Wanjiku Mwangi', 'u-retailer-1', 'Embu Town', 'Assigned', 'u-rider-1', 'Today, 2:00 PM', now, 'REF-1003', 'pending')
  insert.run('del-ret-1-4', 'REF-1004', 'Wanjiku Mwangi', 'u-retailer-1', 'Nyeri Road', 'Picked Up', 'u-rider-1', 'Today, 1:00 PM', now, 'REF-1004', 'pending')
  insert.run('del-ret-2-1', 'REF-2001', 'Muranga Pharmacy Desk', 'u-retailer-2', 'Murang’a Town', 'Delivered', 'u-rider-2', 'Yesterday', now, 'REF-2001', 'pending')
}
db.close()
console.log('Seeded development users and deliveries. Password: Demo1234!')
