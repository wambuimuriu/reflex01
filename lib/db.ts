import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(process.cwd(), '.data')
mkdirSync(dir, { recursive: true })
const db = new Database(join(dir, 'courier.db'))
db.pragma('journal_mode = WAL')
db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, initials TEXT NOT NULL, password_hash TEXT); CREATE TABLE IF NOT EXISTS deliveries (id TEXT PRIMARY KEY, reference TEXT NOT NULL, retailer TEXT NOT NULL, address TEXT NOT NULL, status TEXT NOT NULL, rider_id TEXT, eta TEXT NOT NULL, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS status_history (id INTEGER PRIMARY KEY AUTOINCREMENT, delivery_id TEXT NOT NULL, from_status TEXT, to_status TEXT NOT NULL, actor_id TEXT NOT NULL, created_at TEXT NOT NULL);`)
const count = db.prepare('SELECT count(*) as count FROM deliveries').get() as { count: number }
if (!count.count) {
  const insertUser = db.prepare('INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?)')
  insertUser.run('u-retailer', 'Maya Chen', 'retailer', 'MC'); insertUser.run('u-dispatcher', 'Jordan Lee', 'dispatcher', 'JL'); insertUser.run('u-rider', 'Alex Rivera', 'rider', 'AR'); insertUser.run('u-rider-2', 'Sam Okafor', 'rider', 'SO')
  const insert = db.prepare('INSERT INTO deliveries VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  insert.run('del-1048', 'DLV-1048', 'Northstar Market', '240 King Street, San Francisco', 'Pending', null, 'Today, 2:30 PM', new Date().toISOString())
  insert.run('del-1047', 'DLV-1047', 'Juniper & Co.', '88 Valencia Street, San Francisco', 'Assigned', 'u-rider', 'Today, 1:15 PM', new Date().toISOString())
  insert.run('del-1046', 'DLV-1046', 'Harbor Goods', '501 Battery Street, San Francisco', 'Picked Up', 'u-rider', 'Today, 12:45 PM', new Date().toISOString())
  insert.run('del-1045', 'DLV-1045', 'Good Day Coffee', '16th Street, San Francisco', 'Delivered', 'u-rider-2', 'Yesterday', new Date().toISOString())
}
export default db
