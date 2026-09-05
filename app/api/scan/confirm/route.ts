import { NextResponse } from 'next/server'
import { getSessionUser, requireRole } from '@/lib/authz'
import { confirmScannedOrder } from '@/lib/confirmation'

export async function POST(request: Request) {
  const auth = requireRole(await getSessionUser(), ['rider'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { code } = await request.json().catch(() => ({})) as { code?: string }
  if (!code) return NextResponse.json({ error: 'Confirmation code is required.' }, { status: 400 })
  if (!confirmScannedOrder(code, auth.user.id)) return NextResponse.json({ error: 'This order was not found or has already been confirmed.' }, { status: 409 })
  return NextResponse.json({ confirmed: true })
}
