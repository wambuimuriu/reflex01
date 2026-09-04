import { NextResponse } from 'next/server'
import { scryptSync, timingSafeEqual } from 'node:crypto'
import db from '@/lib/db'

function validPassword(password: string, stored: string | null) {
  if (!stored) return false
  const value = stored.split(':').at(-1)
  const salt = stored.split(':').at(-2)
  if (!value || !salt) return false
  const expected = Buffer.from(value, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string }
  const email = body.email?.trim().toLowerCase()
  if (!email || !body.password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  const user = db.prepare(`SELECT id, name, role, initials, password_hash FROM users WHERE lower(id) = lower(?) OR lower(name) = lower(?)`).get(email, email) as { id: string; name: string; role: string; initials: string; password_hash: string | null } | undefined
  // Demo accounts use the email as a lookup key stored in the seed registry below.
  const account = ({ '1retailer@reflex.dev': 'u-retailer-1', 'retailer2@reflex.dev': 'u-retailer-2', 'dispatcher@reflex.dev': 'u-dispatcher', 'rider1@reflex.dev': 'u-rider-1', 'rider2@reflex.dev': 'u-rider-2' } as Record<string, string>)[email ?? '']
  const found = account ? db.prepare('SELECT id, name, role, initials, password_hash FROM users WHERE id = ?').get(account) as typeof user : user
  if (!found || !validPassword(body.password, found.password_hash)) return NextResponse.json({ error: 'Invalid demo credentials.' }, { status: 401 })
  const response = NextResponse.json({ user: { id: found.id, name: found.name, role: found.role, initials: found.initials } })
  response.cookies.set('session-user', found.id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 })
  response.cookies.set('dev-role', found.role, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
