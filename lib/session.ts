import { cookies } from 'next/headers'
import { isRole, type Role } from './status'
export const DEMO_USERS = { retailer: 'u-retailer-1', dispatcher: 'u-dispatcher', rider: 'u-rider-1' } as const
export async function getDevRole(): Promise<Role> { const value = (await cookies()).get('dev-role')?.value; return isRole(value) ? value : 'dispatcher' }
export function userForRole(role: Role) { return DEMO_USERS[role] }
