import { NextResponse } from 'next/server'
import { getSessionUser, requireRole } from '@/lib/authz'
import { lookupDeliveryByConfirmationCode } from '@/lib/confirmation'

export async function POST(request: Request) {
  const auth = requireRole(await getSessionUser(), ['rider'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { code } = await request.json().catch(() => ({})) as { code?: string }
  if (!code) return NextResponse.json({ error: 'Confirmation code is required.' }, { status: 400 })
  const delivery = lookupDeliveryByConfirmationCode(code, auth.user.id)
  return delivery ? NextResponse.json({ delivery }) : NextResponse.json({ error: 'Confirmation code not found.' }, { status: 404 })
}
