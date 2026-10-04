import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, MapPin, Route, ShieldCheck, Truck, Users } from 'lucide-react'
import { SiteNavigation } from '@/components/site-navigation'
import { SiteFooter } from '@/components/site-footer'
import { ParticleSwarm } from '@/components/particle-swarm'

const benefits = [
  { icon: Route, title: 'Create delivery requests', text: 'Retailers record the address, recipient, and delivery details in one request.' },
  { icon: Clock3, title: 'Assign a rider', text: 'Dispatchers assign each request and track whether it is pending, assigned, picked up, or delivered.' },
  { icon: ShieldCheck, title: 'Track delivery status', text: 'Retailers can see the current status and confirmation details for each delivery.' },
]

const workflow = [
  { number: '01', title: 'Retailer creates a request', text: 'The retailer enters the delivery address, recipient, and other required details.' },
  { number: '02', title: 'Dispatcher assigns a rider', text: 'The dispatcher selects a rider and the request appears in the rider workspace.' },
  { number: '03', title: 'Rider updates the status', text: 'The rider advances the delivery status so the retailer can follow its progress.' },
]

export default function Page() {
  return <main className="landing-page">
    <SiteNavigation />
    <section className="landing-hero">
      <div className="landing-copy"><h1>Delivery coordination and tracking for small Kenyan retailers.</h1><p className="landing-lede">Reflex is a delivery coordination and tracking tool for electronics shops, pharmacies, and hardware stores. A retailer creates a delivery request, a dispatcher assigns a rider, the rider updates the status, and the retailer sees the live status.</p><div className="landing-actions"><Link href="/sign-in" className="landing-primary">Sign in to Reflex <ArrowRight aria-hidden="true" /></Link><Link href="/about" className="landing-secondary">See how it works</Link></div><span className="landing-note"><CheckCircle2 aria-hidden="true" /> Four roles, one delivery record</span></div>
      <div className="landing-route-column"><div className="landing-route-visual" aria-hidden="true"><ParticleSwarm /><div className="route-map-lines"><span /><span /><span /><span /></div><div className="route-origin"><span className="route-origin-dot" /></div><div className="route-path"><span className="route-path-dash route-path-dash-one" /><span className="route-path-dash route-path-dash-two" /><span className="route-path-dash route-path-dash-three" /><span className="route-path-dash route-path-dash-four" /></div><div className="route-truck"><Truck /></div><div className="route-destination"><MapPin /><span /></div><p className="route-caption">Live delivery route</p></div></div>
    </section>
    <section className="landing-benefits" aria-label="Reflex benefits">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><span className="benefit-icon"><Icon aria-hidden="true" /></span><div><h2>{title}</h2><p>{text}</p></div></article>)}</section>
    <section className="landing-workflow"><div className="section-heading"><p className="eyebrow">How a delivery moves</p><h2>From request to delivery status.</h2></div><div className="workflow-grid">{workflow.map((step) => <article key={step.number}><span className="workflow-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
    <section className="landing-trust"><div><p className="eyebrow">For Kenyan retail teams</p><h2>Retailer, dispatcher, and rider updates in one delivery record.</h2></div><div className="trust-copy"><Users aria-hidden="true" /><p>Use one record to create a request, assign a rider, update the delivery status, and review confirmation details.</p><Link href="/dashboard">Open the dashboard <ArrowRight aria-hidden="true" /></Link></div></section>
    <SiteFooter />
  </main>
}
