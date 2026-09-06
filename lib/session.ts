import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { query } from '@/lib/db'
import type { Role } from './status'

const scrypt = promisify(scryptCallback)
export const SESSION_COOKIE = 'reflex-session'
export const SESSION_MAX_AGE = 60 * 60 * 8

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scrypt(password, salt, 64) as Buffer
  return `scrypt:${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string | null) {
  const credentialHash = storedHash.includes(':scrypt:') ? storedHash.split(':scrypt:')[1] ? `scrypt:${storedHash.split(':scrypt:')[1]}` : storedHash : storedHash
  if (!credentialHash.startsWith('scrypt:')) return false
  const [, salt, hash] = credentialHash.split(':')
  if (!salt || !hash) return false
  const derivedKey = await scrypt(password, salt, 64) as Buffer
  const expected = Buffer.from(hash, 'hex')
  return expected.length === derivedKey.length && timingSafeEqual(expected, derivedKey)
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url')
  await query("INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '8 hours')", [token, userId])
  return token
}

export async function getSessionUser(token: string | undefined) {
  if (!token) return null
  const result = await query<{ id: string; name: string; role: Role; initials: string }>(`SELECT u.id, u.name, u.role, u.initials FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = $1 AND s.expires_at > NOW()`, [token])
  return result.rows[0] ?? null
}

export async function deleteSession(token: string | undefined) {
  if (token) await query('DELETE FROM sessions WHERE token = $1', [token])
}

export const DEMO_USERS = { retailer: 'u-retailer-1', dispatcher: 'u-dispatcher', rider: 'u-rider-1' } as const
export function userForRole(role: Role) { return DEMO_USERS[role] }
