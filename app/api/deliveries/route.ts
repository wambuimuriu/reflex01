import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSessionUser, requireRole } from '@/lib/authz'
import { validateTransition, nextStatus } from '@/lib/status'

function list(user: Awaited<ReturnType<typeof getSessionUser>>) {
  if (!user) return []
  const where = user.role === 'retailer' ? 'WHERE d.retailer_id = ?' : user.role === 'rider' ? 'WHERE d.rider_id = ?' : ''
  const args = user.role === 'dispatcher' ? [] : [user.id]
  return db.prepare(`SELECT d.*, u.name as rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id ${where} ORDER BY d.created_at DESC`).all(...args)
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  return NextResponse.json({ role: user.role, user, deliveries: list(user) })
}

export async function POST(request: Request) {
  const auth = requireRole(await getSessionUser(), ['retailer'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({})) as { address?: string; reference?: string; eta?: string }
  if (!body.address?.trim() || !body.reference?.trim()) return NextResponse.json({ error: 'Reference and address are required.' }, { status: 400 })
  const id = `del-${Date.now()}`
  db.prepare('INSERT INTO deliveries (id, reference, retailer, retailer_id, address, status, rider_id, eta, created_at, confirmation_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, body.reference.trim(), auth.user.name, auth.user.id, body.address.trim(), 'Pending', null, body.eta?.trim() || 'Today', new Date().toISOString(), 'pending')
  return NextResponse.json({ id }, { status: 201 })
}

export async function PATCH(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const body = await request.json().catch(() => ({})) as { id?: string; action?: string; riderId?: string }
  if (!body.id) return NextResponse.json({ error: 'Delivery id is required.' }, { status: 400 })
  const delivery = db.prepare('SELECT * FROM deliveries WHERE id = ?').get(body.id) as { id: string; status: string; retailer_id: string | null; rider_id: string | null } | undefined
  if (!delivery) return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 })
  if (body.action === 'assign') {
    if (user.role !== 'dispatcher') return NextResponse.json({ error: 'Dispatcher access required.' }, { status: 403 })
    const rider = db.prepare("SELECT id FROM users WHERE id = ? AND role = 'rider'").get(body.riderId)
    if (!rider) return NextResponse.json({ error: 'A valid rider is required.' }, { status: 400 })
    db.prepare("UPDATE deliveries SET rider_id = ?, status = 'Assigned' WHERE id = ? AND status = 'Pending'").run(body.riderId, delivery.id)
    return NextResponse.json({ ok: true })
  }
  if (user.role === 'retailer') return NextResponse.json({ error: 'Retailer staff cannot advance delivery status.' }, { status: 403 })
  if (user.role === 'rider' && delivery.rider_id !== user.id) return NextResponse.json({ error: 'This delivery is not assigned to you.' }, { status: 403 })
  const requested = nextStatus(delivery.status as Parameters<typeof nextStatus>[0])
  const result = validateTransition(delivery.status, requested)
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 409 })
  db.transaction(() => { db.prepare('UPDATE deliveries SET status = ? WHERE id = ? AND status = ?').run(result.status, delivery.id, delivery.status); db.prepare('INSERT INTO status_history (delivery_id, from_status, to_status, actor_id, created_at) VALUES (?, ?, ?, ?, ?)').run(delivery.id, delivery.status, result.status, user.id, new Date().toISOString()) })()
  return NextResponse.json({ ok: true, status: result.status })
}
