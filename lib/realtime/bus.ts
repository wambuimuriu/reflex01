import { EventEmitter } from 'node:events'

// This process-local bus is suitable for the single-instance demo. Production serverless deployments need a shared pub/sub transport.
const globalBus = globalThis as typeof globalThis & { __waypointBus?: EventEmitter }
export const deliveryBus = globalBus.__waypointBus ??= new EventEmitter()
export type DeliveryChangedEvent = { deliveryId: string; retailer: string; riderId: string | null; status: string }
export function emitDeliveryChanged(event: DeliveryChangedEvent) { deliveryBus.emit('delivery-changed', event) }
