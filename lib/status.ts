export const DELIVERY_STATUSES = ['Pending', 'Assigned', 'Picked Up', 'Delivered'] as const
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number]

export const STATUS_META: Record<DeliveryStatus, { label: string; tone: string }> = {
  Pending: { label: 'Pending', tone: 'status-pending' },
  Assigned: { label: 'Assigned', tone: 'status-assigned' },
  'Picked Up': { label: 'Picked Up', tone: 'status-picked' },
  Delivered: { label: 'Delivered', tone: 'status-delivered' },
}

export function isDeliveryStatus(value: unknown): value is DeliveryStatus {
  return typeof value === 'string' && DELIVERY_STATUSES.includes(value as DeliveryStatus)
}

export function validateTransition(current: unknown, requested: unknown) {
  if (!isDeliveryStatus(current) || !isDeliveryStatus(requested)) return { ok: false, reason: 'Unknown status.' }
  const currentIndex = DELIVERY_STATUSES.indexOf(current)
  const requestedIndex = DELIVERY_STATUSES.indexOf(requested)
  if (requestedIndex !== currentIndex + 1) return { ok: false, reason: `Only the next status after ${current} is allowed.` }
  return { ok: true as const, status: requested }
}

export function nextStatus(status: DeliveryStatus) {
  return DELIVERY_STATUSES[DELIVERY_STATUSES.indexOf(status) + 1] ?? null
}

export const ROLES = ['retailer', 'dispatcher', 'rider'] as const
export type Role = (typeof ROLES)[number]
export const ROLE_LABELS: Record<Role, string> = { retailer: 'Retailer staff', dispatcher: 'Dispatcher', rider: 'Rider' }
export const ROLE_DESCRIPTIONS: Record<Role, string> = { retailer: 'Create and track your deliveries', dispatcher: 'Coordinate the whole fleet', rider: 'Your assigned route, on the go' }
export function isRole(value: unknown): value is Role { return typeof value === 'string' && ROLES.includes(value as Role) }
