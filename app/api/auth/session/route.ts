import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession, getSessionUser, SESSION_COOKIE } from '@/lib/session'

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return NextResponse.json({ user: await getSessionUser(token) })
}

export async function DELETE() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  await deleteSession(token)
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(SESSION_COOKIE)
  return response
}
