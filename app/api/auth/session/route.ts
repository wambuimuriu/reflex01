import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'

export async function GET() {
  const id = (await cookies()).get('session-user')?.value
  const result = id ? await query('SELECT id, name, role, initials FROM users WHERE id = $1', [id]) : null
  return NextResponse.json({ user: result?.rows[0] ?? null })
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('session-user')
  response.cookies.delete('dev-role')
  return response
}
