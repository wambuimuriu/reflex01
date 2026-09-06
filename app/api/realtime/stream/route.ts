import { deliveryBus, type DeliveryChangedEvent } from '@/lib/realtime/bus'
import { getSessionUser } from '@/lib/authz'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return new Response('Not found', { status: 404 })
  const encoder = new TextEncoder()
  let heartbeat: ReturnType<typeof setInterval>
  let handler: (event: DeliveryChangedEvent) => void
  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      handler = (event) => {
        const relevant = user.role === 'dispatcher' || (user.role === 'rider' && event.riderId === user.id) || (user.role === 'retailer' && event.retailerId === user.id)
        if (relevant) send(event)
      }
      deliveryBus.on('delivery-changed', handler)
      heartbeat = setInterval(() => controller.enqueue(encoder.encode(': heartbeat\n\n')), 20000)
      send({ connected: true })
    },
    cancel() { deliveryBus.off('delivery-changed', handler); clearInterval(heartbeat) },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } })
}
