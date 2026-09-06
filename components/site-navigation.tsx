'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' },
]

export function SiteNavigation({ showSignIn = true }: { showSignIn?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="site-navigation" aria-label="Primary navigation">
      <Link href="/" className="site-navigation-brand" onClick={() => setOpen(false)}>
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Reflex</span>
      </Link>
      <div className="site-navigation-links">
        {links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>{link.label}</Link>)}
      </div>
      {showSignIn && <Link href="/sign-in" className="site-navigation-cta">Sign in</Link>}
      <button type="button" className="site-navigation-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen((value) => !value)}>
        {open ? <X /> : <Menu />}
      </button>
      {open && <div id="mobile-navigation" className="site-navigation-mobile">{links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''} onClick={() => setOpen(false)}>{link.label}</Link>)}{showSignIn && <Link href="/sign-in" className="site-navigation-mobile-cta" onClick={() => setOpen(false)}>Sign in</Link>}</div>}
    </nav>
  )
}
