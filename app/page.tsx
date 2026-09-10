import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, MapPin, Route, ShieldCheck, Truck, Users } from 'lucide-react'
import { SiteNavigation } from '@/components/site-navigation'

const benefits = [
  { icon: Route, title: 'One operational view', text: 'Replace scattered WhatsApp threads with a shared delivery workspace.' },
  { icon: Clock3, title: 'Fewer follow-ups', text: 'See what is pending, assigned, picked up, or delivered at a glance.' },
  { icon: ShieldCheck, title: 'Proof that travels', text: 'Keep confirmation details attached to every delivery record.' },
]

const workflow = [
  { number: '01', title: 'Create the request', text: 'Retailers add the delivery once, with the details the team actually needs.' },
  { number: '02', title: 'Move the handoff', text: 'Dispatchers assign work and riders see the next action without another message.' },
  { number: '03', title: 'Close the loop', text: 'Confirm delivery and keep a reliable record of what happened.' },
]

export default function Page() {
  return <main className="landing-page">
    <SiteNavigation />
    <section className="landing-hero">
      <div className="landing-copy"><p className="eyebrow">Delivery operations, clarified</p><div className="landing-headline-row"><div><h1>Move deliveries forward without the <em>message chase.</em></h1><p className="landing-lede">Reflex replaces WhatsApp-based coordination with one calm, connected workspace for retailers, dispatchers, and riders.</p><div className="landing-actions"><Link href="/sign-in" className="landing-primary">Sign in to Reflex <ArrowRight aria-hidden="true" /></Link><Link href="/about" className="landing-secondary">See how it works</Link></div><span className="landing-note"><CheckCircle2 aria-hidden="true" /> Built for daily operations</span></div><div className="landing-route-visual" aria-hidden="true"><div className="route-map-lines"><span /><span /><span /><span /></div><div className="route-origin"><span className="route-origin-dot" /></div><div className="route-path"><span className="route-path-dash route-path-dash-one" /><span className="route-path-dash route-path-dash-two" /><span className="route-path-dash route-path-dash-three" /><span className="route-path-dash route-path-dash-four" /></div><div className="route-truck"><Truck /></div><div className="route-destination"><MapPin /><span /></div><p className="route-caption">Live delivery route</p></div></div></div>
    </section>
    <section className="landing-benefits" aria-label="Reflex benefits">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><span className="benefit-icon"><Icon aria-hidden="true" /></span><div><h2>{title}</h2><p>{text}</p></div></article>)}</section>
    <section className="landing-workflow"><div className="section-heading"><p className="eyebrow">A calmer operating rhythm</p><h2>Every handoff has a next step.</h2></div><div className="workflow-grid">{workflow.map((step) => <article key={step.number}><span className="workflow-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
    <section className="landing-trust"><div><p className="eyebrow">For teams that move</p><h2>One shared truth from request to proof.</h2></div><div className="trust-copy"><Users aria-hidden="true" /><p>Give every role the context they need, without giving anyone another thread to monitor.</p><Link href="/dashboard">Open the workspace <ArrowRight aria-hidden="true" /></Link></div></section>
    <footer className="landing-footer"><span>Reflex</span><span>Delivery coordination for teams that move.</span></footer>
  </main>
}
