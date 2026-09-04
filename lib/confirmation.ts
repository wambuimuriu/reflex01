import db from '@/lib/db'

export function lookupDeliveryByConfirmationCode(code: string, riderId: string) {
  return db.prepare(`SELECT id, reference, retailer, address, status FROM deliveries WHERE confirmation_code = ? AND rider_id = ? AND confirmation_status = 'pending'`).get(code.trim(), riderId) as { id: string; reference: string; retailer: string; address: string; status: string } | undefined
}

export function confirmScannedOrder(code: string, riderId: string) {
  const result = db.prepare(`UPDATE deliveries SET confirmation_status = 'confirmed', confirmed_at = ? WHERE confirmation_code = ? AND rider_id = ? AND confirmation_status = 'pending'`).run(new Date().toISOString(), code.trim(), riderId)
  return result.changes === 1
}
