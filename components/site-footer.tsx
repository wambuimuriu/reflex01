'use client'

import Link from 'next/link'

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-footer-brand"><span className="footer-mark">R</span><div><strong>Reflex</strong><span>Delivery operations, clarified.</span></div></div><div className="site-footer-links"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/dashboard">Dashboard</Link><Link href="/sign-in">Sign in</Link></div><span className="site-footer-meta">© 2024 Reflex</span></footer>
}
