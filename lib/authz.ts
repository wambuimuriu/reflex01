import { cookies } from 'next/headers'
import { query } from './db'
import { isRole, type Role } from './status'

export type SessionUser = { id: string; name: string; role: Role; initials: string }

export async function getSessionUser(): Promise<SessionUser | null> {
  const id = (await cookies()).get('session-user')?.value
  if (!id) return null
  const { rows } = await query<{ id: string; name: string; role: string; initials: string }>('SELECT id, name, role, initials FROM users WHERE id = $1', [id])
  const user = rows[0]
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

export async function userById(id: string | null | undefined) {
  if (!id) return undefined
  const { rows } = await query<SessionUser>('SELECT id, name, role, initials FROM users WHERE id = $1', [id])
  return rows[0]
}
