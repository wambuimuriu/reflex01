import type { Metadata } from 'next'
import { SignInForm } from '@/components/sign-in-form'

export const metadata: Metadata = { title: 'Sign in — Reflex', description: 'Sign in to your Reflex delivery operations workspace.' }

export default function SignInPage() {
  return <SignInForm />
}
