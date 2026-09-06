export type UserRow = { id: string; name: string; role: string; initials: string; password_hash: string | null }
export type DeliveryRow = { id: string; reference: string; retailer: string; retailer_id: string | null; address: string; status: string; rider_id: string | null; eta: string; created_at: Date; confirmation_code: string | null; confirmation_status: string; confirmed_at: Date | null }
export type StatusHistoryRow = { id: number; delivery_id: string; from_status: string | null; to_status: string; actor_id: string; created_at: Date }
export const sessionTableSql = `CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL)`
