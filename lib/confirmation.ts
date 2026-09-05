import { query } from '@/lib/db'

export async function lookupDeliveryByConfirmationCode(code: string, riderId: string) {
  const { rows } = await query<{ id: string; reference: string; retailer: string; address: string; status: string }>(`SELECT id, reference, retailer, address, status FROM deliveries WHERE confirmation_code = $1 AND rider_id = $2 AND confirmation_status = 'pending'`, [code.trim(), riderId])
  return rows[0]
}

export async function confirmScannedOrder(code: string, riderId: string) {
  const result = await query(`UPDATE deliveries SET confirmation_status = 'confirmed', confirmed_at = $1 WHERE confirmation_code = $2 AND rider_id = $3 AND confirmation_status = 'pending'`, [new Date(), code.trim(), riderId])
  return result.rowCount === 1
}
