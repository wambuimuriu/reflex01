import { getSessionUser } from './authz'
import type { Role } from './status'
export const DEMO_USERS = { retailer: 'u-retailer-1', dispatcher: 'u-dispatcher', rider: 'u-rider-1' } as const
export async function getDevRole(): Promise<Role> { return (await getSessionUser())?.role ?? 'dispatcher' }
export function userForRole(role: Role) { return DEMO_USERS[role] }
