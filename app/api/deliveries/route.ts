import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import db from '@/lib/db'
import { getDevRole, userForRole } from '@/lib/session'
import { validateTransition, nextStatus } from '@/lib/status'

function list(role: string, userId?: string) { const rows = db.prepare(`SELECT d.*, u.name as rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id ${role === 'retailer' ? 'WHERE d.retailer = (SELECT name FROM users WHERE id = ?)' : role === 'rider' ? 'WHERE d.rider_id = ?' : ''} ORDER BY d.created_at DESC`).all(...(role === 'retailer' || role === 'rider' ? [userId ?? userForRole(role as any)] : [])); return rows }
export async function GET() { const role = await getDevRole(); const userId = (await cookies()).get('session-user')?.value; return NextResponse.json({ role, deliveries: list(role, userId) }) }
export async function POST(request: Request) {
  const role = await getDevRole(); if (role !== 'retailer') return NextResponse.json({ error: 'Only retailer staff can create deliveries.' }, { status: 403 })
  const body = await request.json(); if (!body.address || !body.reference) return NextResponse.json({ error: 'Reference and address are required.' }, { status: 400 })
  const id = `del-${Date.now()}`; db.prepare('INSERT INTO deliveries VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, body.reference, 'Northstar Market', body.address, 'Pending', null, body.eta ?? 'Today', new Date().toISOString()); return NextResponse.json({ id }, { status: 201 })
}
export async function PATCH(request: Request) {
  const role = await getDevRole(); const body = await request.json(); const delivery = db.prepare('SELECT * FROM deliveries WHERE id = ?').get(body.id) as any
  if (!delivery) return NextResponse.json({ error: 'Delivery not found.' }, { status: 404 })
  const actor = userForRole(role)
  if (body.action === 'assign') { if (role !== 'dispatcher') return NextResponse.json({ error: 'Dispatcher access required.' }, { status: 403 }); db.prepare('UPDATE deliveries SET rider_id = ?, status = ? WHERE id = ? AND status = ?').run(body.riderId, 'Assigned', delivery.id, 'Pending'); return NextResponse.json({ ok: true }) }
  if (role === 'rider' && delivery.rider_id !== actor) return NextResponse.json({ error: 'This delivery is not assigned to you.' }, { status: 403 })
  if (role === 'retailer') return NextResponse.json({ error: 'Retailer staff cannot advance delivery status.' }, { status: 403 })
  const requested = nextStatus(delivery.status); const result = validateTransition(delivery.status, requested)
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 409 })
  db.transaction(() => { db.prepare('UPDATE deliveries SET status = ? WHERE id = ? AND status = ?').run(result.status, delivery.id, delivery.status); db.prepare('INSERT INTO status_history (delivery_id, from_status, to_status, actor_id, created_at) VALUES (?, ?, ?, ?, ?)').run(delivery.id, delivery.status, result.status, actor, new Date().toISOString()) })()
  return NextResponse.json({ ok: true, status: result.status })
}
