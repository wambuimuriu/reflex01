import { NextResponse } from 'next/server'
import { query, pool } from '@/lib/db'
import { deliveryScope, getSessionUser, requireRole } from '@/lib/authz'
import { validateTransition, nextStatus } from '@/lib/status'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const scope = deliveryScope(user)
  const { rows } = await query(`SELECT d.*, u.name AS rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id WHERE ${scope.clause} ORDER BY d.created_at DESC`, scope.values)
  return NextResponse.json({ role: user.role, user, deliveries: rows })
}

export async function POST(request: Request) {
  const auth = requireRole(await getSessionUser(), ['retailer'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({})) as { address?: string; reference?: string; eta?: string }
  if (!body.address?.trim() || !body.reference?.trim()) return NextResponse.json({ error: 'Reference and address are required.' }, { status: 400 })
  const id = `del-${crypto.randomUUID()}`
  await query('INSERT INTO deliveries (id, reference, retailer, retailer_id, address, status, rider_id, eta, created_at, confirmation_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id, body.reference.trim(), auth.user.name, auth.user.id, body.address.trim(), 'Pending', null, body.eta?.trim() || 'Today', new Date(), 'pending'])
  return NextResponse.json({ id }, { status: 201 })
}

export async function PATCH(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const body = await request.json().catch(() => ({})) as { id?: string; action?: string; riderId?: string }
  if (!body.id) return NextResponse.json({ error: 'Delivery id is required.' }, { status: 400 })
  if (!pool) throw new Error('DATABASE_URL is required at request time')

  if (body.action === 'assign') {
    const auth = requireRole(user, ['dispatcher'])
    if (!auth.ok) return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 })
    if (!body.riderId) return NextResponse.json({ error: 'A valid rider is required.' }, { status: 400 })
    const rider = await query('SELECT id FROM users WHERE id = $1 AND role = $2', [body.riderId, 'rider'])
    if (!rider.rowCount) return NextResponse.json({ error: 'A valid rider is required.' }, { status: 400 })
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const result = await client.query("UPDATE deliveries SET rider_id = $1, status = 'Assigned' WHERE id = $2 AND status = 'Pending' RETURNING id", [body.riderId, body.id])
      if (result.rowCount !== 1) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 }) }
      await client.query('INSERT INTO status_history (delivery_id, from_status, to_status, actor_id, created_at) VALUES ($1, $2, $3, $4, $5)', [body.id, 'Pending', 'Assigned', user.id, new Date()])
      await client.query('COMMIT')
      return NextResponse.json({ ok: true })
    } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  }

  const auth = requireRole(user, ['rider'])
  if (!auth.ok) return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const current = await client.query<{ status: string }>('SELECT status FROM deliveries WHERE id = $1 AND rider_id = $2 FOR UPDATE', [body.id, user.id])
    const delivery = current.rows[0]
    if (!delivery) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 }) }
    const requested = nextStatus(delivery.status as Parameters<typeof nextStatus>[0])
    const transition = validateTransition(delivery.status, requested)
    if (!transition.ok) { await client.query('ROLLBACK'); return NextResponse.json({ error: transition.reason }, { status: 409 }) }
    const result = await client.query('UPDATE deliveries SET status = $1 WHERE id = $2 AND rider_id = $3 AND status = $4', [transition.status, body.id, user.id, delivery.status])
    if (result.rowCount !== 1) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 }) }
    await client.query('INSERT INTO status_history (delivery_id, from_status, to_status, actor_id, created_at) VALUES ($1, $2, $3, $4, $5)', [body.id, delivery.status, transition.status, user.id, new Date()])
    await client.query('COMMIT')
    return NextResponse.json({ ok: true, status: transition.status })
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}
