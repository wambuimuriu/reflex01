import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'

export default async function Page() {
  const id = (await cookies()).get('session-user')?.value
  const user = id ? db.prepare('SELECT id FROM users WHERE id = ?').get(id) : null
  redirect(user ? '/dashboard' : '/sign-in')
}
