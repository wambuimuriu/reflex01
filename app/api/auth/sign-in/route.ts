import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { createSession, verifyPassword, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'

const accountAliases: Record<string, string> = {
  '1retailer@reflex.dev': 'u-retailer-1',
  'retailer2@reflex.dev': 'u-retailer-2',
  'dispatcher@reflex.dev': 'u-dispatcher',
  'rider1@reflex.dev': 'u-rider-1',
  'rider2@reflex.dev': 'u-rider-2',
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string }
  const email = body.email?.trim().toLowerCase()
  const password = body.password ?? ''
  if (!email || !password) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  const accountId = accountAliases[email]
  const result = await query<{ id: string; name: string; role: string; initials: string; password_hash: string | null }>(
    'SELECT id, name, role, initials, password_hash FROM users WHERE id = $1 OR password_hash LIKE $2',
    [accountId ?? email, `${email}:%`],
  )
  const user = result.rows[0]
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = await createSession(user.id)
  const response = NextResponse.json({ user: { id: user.id, name: user.name, role: user.role, initials: user.initials } })
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: SESSION_MAX_AGE })
  return response
}
