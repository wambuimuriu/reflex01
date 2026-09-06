import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSessionUser, SESSION_COOKIE } from '@/lib/session'
import { DeliveryDashboard } from '@/components/delivery-dashboard'

export default async function RetailerPage() {
  const user = await getSessionUser((await cookies()).get(SESSION_COOKIE)?.value)
  if (!user) redirect('/sign-in')
  if (user.role !== 'retailer') redirect(`/${user.role}`)
  return <DeliveryDashboard initialRole="retailer" />
}
