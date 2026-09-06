import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSessionUser, SESSION_COOKIE } from '@/lib/session'
import { query } from '@/lib/db'
import { DeliveryDashboard } from '@/components/delivery-dashboard'

export default async function RetailerPage() {
  const user = await getSessionUser((await cookies()).get(SESSION_COOKIE)?.value)
  if (!user) redirect('/sign-in')
  if (user.role !== 'retailer') redirect(`/${user.role}`)
  const { rows } = await query('SELECT d.*, u.name AS rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id WHERE d.retailer_id = $1 ORDER BY d.created_at DESC', [user.id])
  return <DeliveryDashboard initialRole="retailer" initialDeliveries={rows} />
}
