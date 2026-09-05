import { randomBytes, scryptSync } from 'node:crypto'
import { query, pool } from '../lib/db'

const password = 'Demo1234!'
const hash = () => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}` }
const users = [
  ['u-retailer-1', 'Wanjiku Mwangi', 'retailer', 'WM', '1retailer@reflex.dev'],
  ['u-retailer-2', 'Muranga Pharmacy Desk', 'retailer', 'MP', 'retailer2@reflex.dev'],
  ['u-dispatcher', 'Dispatch Central', 'dispatcher', 'DC', 'dispatcher@reflex.dev'],
  ['u-rider-1', 'Kevin Otieno', 'rider', 'KO', 'rider1@reflex.dev'],
  ['u-rider-2', 'Faith Wambui', 'rider', 'FW', 'rider2@reflex.dev'],
] as const

async function main() {
  for (const [id, name, role, initials, email] of users) {
    await query('INSERT INTO users (id, name, role, initials, password_hash) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, initials = EXCLUDED.initials, password_hash = EXCLUDED.password_hash', [id, name, role, initials, `${email}:${hash()}`])
  }
  await query('UPDATE deliveries SET retailer_id = (SELECT id FROM users WHERE users.name = deliveries.retailer) WHERE retailer_id IS NULL')
  const { rows } = await query<{ count: string }>('SELECT count(*)::text AS count FROM deliveries')
  if (rows[0]?.count === '0') {
    const deliveries = [
      ['del-jane-wanjiku', 'REF-1001', 'Wanjiku Mwangi', 'u-retailer-1', 'Kutus, Kirinyaga', 'Pending', 'u-rider-1', 'Today, 3:00 PM', 'REF-1001'],
      ['del-ret-1-2', 'REF-1002', 'Wanjiku Mwangi', 'u-retailer-1', 'Nairobi CBD', 'Pending', null, 'Today, 4:00 PM', 'REF-1002'],
      ['del-ret-1-3', 'REF-1003', 'Wanjiku Mwangi', 'u-retailer-1', 'Embu Town', 'Assigned', 'u-rider-1', 'Today, 2:00 PM', 'REF-1003'],
      ['del-ret-1-4', 'REF-1004', 'Wanjiku Mwangi', 'u-retailer-1', 'Nyeri Road', 'Picked Up', 'u-rider-1', 'Today, 1:00 PM', 'REF-1004'],
      ['del-ret-2-1', 'REF-2001', 'Muranga Pharmacy Desk', 'u-retailer-2', 'Murang’a Town', 'Delivered', 'u-rider-2', 'Yesterday', 'REF-2001'],
    ] as const
    for (const [id, reference, retailer, retailerId, address, status, riderId, eta, code] of deliveries) await query('INSERT INTO deliveries (id, reference, retailer, retailer_id, address, status, rider_id, eta, created_at, confirmation_code, confirmation_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [id, reference, retailer, retailerId, address, status, riderId, eta, new Date(), code, 'pending'])
  }
  await pool.end()
  console.log('Seeded Postgres demo users and deliveries. Password: Demo1234!')
}

main().catch(async (error) => { console.error(error); await pool.end(); process.exitCode = 1 })
