import { cookies } from 'next/headers'
import { deliveryBus, type DeliveryChangedEvent } from '@/lib/realtime/bus'
import db from '@/lib/db'

export async function GET() {
  const userId = (await cookies()).get('session-user')?.value
  const user = userId ? db.prepare('SELECT role, name FROM users WHERE id = ?').get(userId) as { role: string; name: string } | undefined : undefined
  if (!user) return new Response('Unauthorized', { status: 401 })
  const encoder = new TextEncoder()
  let heartbeat: ReturnType<typeof setInterval>
  let handler: (event: DeliveryChangedEvent) => void
  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      handler = (event) => {
        const relevant = user.role === 'dispatcher' || (user.role === 'rider' && event.riderId === userId) || (user.role === 'retailer' && event.retailer === user.name)
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
