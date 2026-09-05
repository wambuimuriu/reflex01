import db from '@/lib/db'
import { cookies } from 'next/headers'
import { isRole, type Role } from './status'

export type SessionUser = { id: string; name: string; role: Role; initials: string }

export async function getSessionUser(): Promise<SessionUser | null> {
  const id = (await cookies()).get('session-user')?.value
  if (!id) return null
  const user = db.prepare('SELECT id, name, role, initials FROM users WHERE id = ?').get(id) as { id: string; name: string; role: string; initials: string } | undefined
  return user && isRole(user.role) ? { ...user, role: user.role } : null
}

export function canAccessDelivery(user: SessionUser, delivery: { retailer_id?: string | null; rider_id?: string | null }) {
  return user.role === 'dispatcher' || (user.role === 'retailer' && delivery.retailer_id === user.id) || (user.role === 'rider' && delivery.rider_id === user.id)
}

export function requireRole(user: SessionUser | null, roles: Role[]) {
  if (!user) return { ok: false as const, status: 401, error: 'Authentication required.' }
  if (!roles.includes(user.role)) return { ok: false as const, status: 403, error: 'You are not authorized to perform this action.' }
  return { ok: true as const, user }
}

export function userById(id: string | null | undefined) {
  return id ? db.prepare('SELECT id, name, role, initials FROM users WHERE id = ?').get(id) as SessionUser | undefined : undefined
}
