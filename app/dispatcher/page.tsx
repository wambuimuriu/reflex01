import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSessionUser, SESSION_COOKIE } from '@/lib/session'
import { query } from '@/lib/db'
import { DeliveryDashboard } from '@/components/delivery-dashboard'

export default async function DispatcherPage() {
  const user = await getSessionUser((await cookies()).get(SESSION_COOKIE)?.value)
  if (!user) redirect('/sign-in')
  if (user.role !== 'dispatcher') redirect(`/${user.role}`)
  const { rows } = await query('SELECT d.*, u.name AS rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id ORDER BY d.created_at DESC')
  return <DeliveryDashboard initialRole="dispatcher" initialDeliveries={rows} />
}
