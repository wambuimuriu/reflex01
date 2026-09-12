import { redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { DeliveryDashboard } from '@/components/delivery-dashboard'
import { SiteNavigation } from '@/components/site-navigation'
import { getSessionUser } from '@/lib/authz'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = { title: 'Dashboard — Reflex', description: 'Your Reflex delivery operations dashboard.' }

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) redirect('/sign-in')
  const where = user.role === 'retailer' ? 'WHERE d.retailer_id = $1' : user.role === 'rider' ? 'WHERE d.rider_id = $1' : ''
  const args = user.role === 'dispatcher' ? [] : [user.id]
  const { rows: deliveries } = await query(`SELECT d.*, u.name as rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id ${where} ORDER BY d.created_at DESC`, args)
  return <main className="dashboard-page"><SiteNavigation showSignIn={false} authenticated /><DeliveryDashboard initialRole={user.role} initialDeliveries={deliveries as never} /></main>
}
