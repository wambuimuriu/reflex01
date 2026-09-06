import Link from 'next/link'
import { redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { DeliveryDashboard } from '@/components/delivery-dashboard'
import { SiteNavigation } from '@/components/site-navigation'
import { getSessionUser } from '@/lib/authz'

export const metadata = { title: 'Dashboard — Reflex', description: 'Your Reflex delivery operations dashboard.' }

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) {
    return <main className="dashboard-gate"><SiteNavigation /><section className="dashboard-gate-card"><p className="eyebrow">Reflex workspace</p><h1>Your delivery operation, in one view.</h1><p>Sign in to see the deliveries, handoffs, and proof relevant to your role.</p><div><Link href="/sign-in" className="landing-primary">Sign in to continue</Link><Link href="/about" className="dashboard-secondary-link">Learn about Reflex</Link></div></section></main>
  }
  const where = user.role === 'retailer' ? 'WHERE d.retailer_id = $1' : user.role === 'rider' ? 'WHERE d.rider_id = $1' : ''
  const args = user.role === 'dispatcher' ? [] : [user.id]
  const { rows: deliveries } = await query(`SELECT d.*, u.name as rider_name FROM deliveries d LEFT JOIN users u ON u.id = d.rider_id ${where} ORDER BY d.created_at DESC`, args)
  return <main className="dashboard-page"><SiteNavigation /><DeliveryDashboard initialRole={user.role} initialDeliveries={deliveries as never} /></main>
}
