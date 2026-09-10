import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/session'

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/sign-in', request.url))
  response.cookies.set(SESSION_COOKIE, '', { expires: new Date(0), httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })
  return response
}
