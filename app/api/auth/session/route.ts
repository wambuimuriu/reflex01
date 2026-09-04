import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import db from '@/lib/db'

export async function GET() {
  const id = (await cookies()).get('session-user')?.value
  const user = id ? db.prepare('SELECT id, name, role, initials FROM users WHERE id = ?').get(id) : null
  return NextResponse.json({ user: user ?? null })
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('session-user')
  response.cookies.delete('dev-role')
  return response
}
