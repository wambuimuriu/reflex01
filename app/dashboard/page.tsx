import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { DeliveryDashboard } from '@/components/delivery-dashboard'
import { isRole, type Role } from '@/lib/status'

export default async function DashboardPage() {
  const id = (await cookies()).get('session-user')?.value
  const user = id ? db.prepare('SELECT role FROM users WHERE id = ?').get(id) as { role?: string } | undefined : undefined
  if (!user || !isRole(user.role)) redirect('/sign-in')
  return <DeliveryDashboard initialRole={user.role as Role} />
}
