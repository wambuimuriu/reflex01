import { redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { DeliveryDashboard } from '@/components/delivery-dashboard'
import { getSessionUser } from '@/lib/authz'

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) redirect('/sign-in')
  const where = user.role === 'retailer' ? 'WHERE d.retailer_id = $1' : user.role === 'rider' ? 'WHERE d.rider_id = $1' : ''
  const args = user.role === 'dispatcher' ? [] : [user.id]
  const { rows: deliveries } = await query(`SELECT d.*, u.name as rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id ${where} ORDER BY d.created_at DESC`, args)
  return <DeliveryDashboard initialRole={user.role} initialDeliveries={deliveries as never} />
}
