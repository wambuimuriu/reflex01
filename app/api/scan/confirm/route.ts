import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import db from '@/lib/db'
import { confirmScannedOrder } from '@/lib/confirmation'

export async function POST(request: Request) {
  const userId = (await cookies()).get('session-user')?.value
  const user = userId ? db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as { role: string } | undefined : undefined
  if (user?.role !== 'rider') return NextResponse.json({ error: 'Rider access required.' }, { status: 403 })
  const { code } = await request.json().catch(() => ({})) as { code?: string }
  if (!code) return NextResponse.json({ error: 'Confirmation code is required.' }, { status: 400 })
  if (!confirmScannedOrder(code, userId!)) return NextResponse.json({ error: 'This order was not found or has already been confirmed.' }, { status: 409 })
  return NextResponse.json({ confirmed: true })
}
