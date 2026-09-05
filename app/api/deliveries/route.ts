import { NextResponse } from 'next/server'
import { query, pool } from '@/lib/db'
import { getSessionUser, requireRole } from '@/lib/authz'
import { validateTransition, nextStatus } from '@/lib/status'

async function list(user: Awaited<ReturnType<typeof getSessionUser>>) {
  if (!user) return []
  const filter = user.role === 'retailer' ? 'WHERE d.retailer_id = $1' : user.role === 'rider' ? 'WHERE d.rider_id = $1' : ''
  const values = user.role === 'dispatcher' ? [] : [user.id]
  const { rows } = await query(`SELECT d.*, u.name AS rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id ${filter} ORDER BY d.created_at DESC`, values)
  return rows
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  return NextResponse.json({ role: user.role, user, deliveries: await list(user) })
}

export async function POST(request: Request) {
  const auth = requireRole(await getSessionUser(), ['retailer'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({})) as { address?: string; reference?: string; eta?: string }
  if (!body.address?.trim() || !body.reference?.trim()) return NextResponse.json({ error: 'Reference and address are required.' }, { status: 400 })
  const id = `del-${Date.now()}`
  await query('INSERT INTO deliveries (id, reference, retailer, retailer_id, address, status, rider_id, eta, created_at, confirmation_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id, body.reference.trim(), auth.user.name, auth.user.id, body.address.trim(), 'Pending', null, body.eta?.trim() || 'Today', new Date(), 'pending'])
  return NextResponse.json({ id }, { status: 201 })
}

export async function PATCH(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const body = await request.json().catch(() => ({})) as { id?: string; action?: string; riderId?: string }
  if (!body.id) return NextResponse.json({ error: 'Delivery id is required.' }, { status: 400 })
  const { rows } = await query<{ id: string; status: string; retailer_id: string | null; rider_id: string | null }>('SELECT id, status, retailer_id, rider_id FROM deliveries WHERE id = $1', [body.id])
  const delivery = rows[0]
  if (!delivery) return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 })
  if (body.action === 'assign') {
    if (user.role !== 'dispatcher') return NextResponse.json({ error: 'Dispatcher access required.' }, { status: 403 })
    const rider = await query('SELECT id FROM users WHERE id = $1 AND role = $2', [body.riderId, 'rider'])
    if (!rider.rowCount) return NextResponse.json({ error: 'A valid rider is required.' }, { status: 400 })
    await query("UPDATE deliveries SET rider_id = $1, status = 'Assigned' WHERE id = $2 AND status = 'Pending'", [body.riderId, delivery.id])
    return NextResponse.json({ ok: true })
  }
  if (user.role === 'retailer') return NextResponse.json({ error: 'Retailer staff cannot advance delivery status.' }, { status: 403 })
  if (user.role === 'rider' && delivery.rider_id !== user.id) return NextResponse.json({ error: 'This delivery is not assigned to you.' }, { status: 403 })
  const requested = nextStatus(delivery.status as Parameters<typeof nextStatus>[0])
  const result = validateTransition(delivery.status, requested)
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 409 })
  if (!pool) throw new Error('DATABASE_URL is required at request time')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('UPDATE deliveries SET status = $1 WHERE id = $2 AND status = $3', [result.status, delivery.id, delivery.status])
    await client.query('INSERT INTO status_history (delivery_id, from_status, to_status, actor_id, created_at) VALUES ($1, $2, $3, $4, $5)', [delivery.id, delivery.status, result.status, user.id, new Date()])
    await client.query('COMMIT')
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  return NextResponse.json({ ok: true, status: result.status })
}
