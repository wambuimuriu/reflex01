'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Eye, EyeOff, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const response = await fetch('/api/auth/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Unable to sign in.')
      window.location.assign('/dashboard')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in.')
      setPending(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <div className="brand auth-brand"><div className="brand-mark"><Truck /></div><div><strong>reflex</strong><span>delivery operations</span></div></div>
        <div className="auth-copy"><p className="eyebrow">One workspace, every handoff</p><h1>Move with clarity.</h1><p>Reflex brings dispatchers, retailers, and riders into the same live delivery picture.</p></div>
        <div className="auth-footnote"><span className="status-dot status-live" />Trusted by teams who deliver on promise.</div>
      </section>
      <section className="auth-panel"><div className="auth-card"><div className="mobile-auth-brand brand"><div className="brand-mark"><Truck /></div><div><strong>reflex</strong><span>delivery operations</span></div></div><p className="eyebrow">Welcome back</p><h2>Sign in to Reflex</h2><p className="auth-subtitle">Use your workspace credentials to continue.</p><form onSubmit={submit} className="auth-form"><label htmlFor="email">Email address</label><Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /><label htmlFor="password">Password</label><div className="password-wrap"><Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff /> : <Eye />}</button></div>{error && <p className="auth-error" role="alert">{error}</p>}<Button type="submit" disabled={pending} className="auth-submit">{pending ? 'Signing in…' : 'Continue'}{!pending && <ArrowRight data-icon="inline-end" />}</Button></form><div className="demo-note"><strong>Demo access</strong><span>dispatcher@reflex.dev · Demo1234!</span><span>rider1@reflex.dev · Demo1234!</span></div></div></section>
    </main>
  )
}

export default SignInForm
