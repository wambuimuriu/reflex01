import { ArrowRight, CheckCircle2, ShieldCheck, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { SiteNavigation } from '@/components/site-navigation'
import { SiteFooter } from '@/components/site-footer'

export const metadata = { title: 'About Reflex | Delivery coordination', description: 'Learn how Reflex helps Kenyan retailers create, assign, and track deliveries.' }

const principles = [
  { icon: Zap, title: 'Delivery requests', text: 'Retailers create a record with the address, recipient, and delivery details their team needs.' },
  { icon: Users, title: 'Role-based workflow', text: 'Retailers, dispatchers, and riders use the same delivery record for the work each role owns.' },
  { icon: ShieldCheck, title: 'Status and confirmation', text: 'Riders update progress and retailers can review the latest status and confirmation details.' },
]

export default function AboutPage() {
  return <main className="about-page"><SiteNavigation /><section className="about-hero"><p className="eyebrow">About the product</p><h1>One tool for creating, assigning, and tracking local deliveries.</h1><p className="about-lede">Reflex is built for small Kenyan retailers such as electronics shops, pharmacies, and hardware stores. Retailers create requests, dispatchers assign riders, riders update status, and retailers follow progress.</p><Link href="/sign-in" className="landing-primary">See Reflex in action <ArrowRight /></Link></section><section className="about-principles"><div className="about-section-heading"><p className="eyebrow">What Reflex handles</p><h2>Each delivery has a clear next action.</h2></div><div className="principles-grid">{principles.map(({ icon: Icon, title, text }) => <article key={title}><span className="benefit-icon"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div><CheckCircle2 className="principle-check" /></article>)}</div></section><section className="about-audience"><div><p className="eyebrow">One workspace, three perspectives</p><h2>Designed around the work each role owns.</h2></div><div className="audience-list"><article><strong>Retailers</strong><span>Create requests, see status, and know when proof is complete.</span></article><article><strong>Dispatchers</strong><span>Assign the next delivery and keep the operation balanced.</span></article><article><strong>Riders</strong><span>Follow a focused route with only the information needed to move.</span></article></div></section><section className="about-callout"><p className="eyebrow">A better daily rhythm</p><h2>Make the next delivery the easiest one to coordinate.</h2><Link href="/dashboard">Open the dashboard <ArrowRight /></Link></section><SiteFooter /></main>
}
