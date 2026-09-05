import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '@/lib/db'

export default async function Page() {
  const id = (await cookies()).get('session-user')?.value
  const result = id ? await query('SELECT id FROM users WHERE id = $1', [id]) : null
  redirect(result?.rows[0] ? '/dashboard' : '/sign-in')
}
