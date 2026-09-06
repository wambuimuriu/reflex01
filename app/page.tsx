import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, Route, ShieldCheck, Zap } from 'lucide-react'

const benefits = [
  { icon: Route, title: 'One operational view', text: 'Replace scattered WhatsApp threads with a shared delivery workspace.' },
  { icon: Clock3, title: 'Fewer follow-ups', text: 'See what is pending, assigned, picked up, or delivered at a glance.' },
  { icon: ShieldCheck, title: 'Proof that travels', text: 'Keep confirmation details attached to every delivery record.' },
]

export default function Page() {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link href="/" className="landing-brand" aria-label="Reflex home"><span className="brand-mark" aria-hidden="true"><Zap /></span><span>Reflex</span></Link>
        <Link href="/sign-in" className="landing-nav-link">Sign in <ArrowRight aria-hidden="true" /></Link>
      </header>
      <section className="landing-hero">
        <div className="landing-copy"><p className="eyebrow">Delivery operations, clarified</p><h1>Move deliveries forward without the <em>message chase.</em></h1><p className="landing-lede">Reflex replaces WhatsApp-based coordination with one calm, connected workspace for retailers, dispatchers, and riders.</p><div className="landing-actions"><Link href="/sign-in" className="landing-primary">Sign in to Reflex <ArrowRight aria-hidden="true" /></Link><span className="landing-note"><CheckCircle2 aria-hidden="true" /> Built for daily operations</span></div></div>
        <div className="landing-visual" aria-label="Reflex delivery operations preview"><div className="visual-window-bar"><span /><span /><span /><small>Today&apos;s network</small></div><div className="visual-window-body"><div className="visual-topline"><span>Delivery command center</span><strong>Live</strong></div><div className="visual-stats"><div><small>Active deliveries</small><b>24</b></div><div><small>On route</small><b>18</b></div><div><small>Delivered</small><b>86%</b></div></div><div className="visual-route"><div className="route-line"><span /><span /><span /></div><div><small>Next handoff</small><strong>Nairobi CBD → Kilimani</strong></div><span className="route-status">On time</span></div><div className="visual-list"><div><span className="list-dot green" /><span>REF-1003</span><small>Picked up</small></div><div><span className="list-dot amber" /><span>REF-1008</span><small>Awaiting rider</small></div><div><span className="list-dot blue" /><span>REF-1012</span><small>Delivered</small></div></div></div></div>
      </section>
      <section className="landing-benefits" aria-label="Reflex benefits">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><span className="benefit-icon"><Icon aria-hidden="true" /></span><div><h2>{title}</h2><p>{text}</p></div></article>)}</section>
      <footer className="landing-footer"><span>Reflex</span><span>Delivery coordination for teams that move.</span></footer>
    </main>
  )
}
