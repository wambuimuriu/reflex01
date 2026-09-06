import { ArrowRight, CheckCircle2, ShieldCheck, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { SiteNavigation } from '@/components/site-navigation'

export const metadata = {
  title: 'About Reflex — Delivery operations',
  description: 'Learn how Reflex brings retailers, dispatchers, and riders into one delivery operations workspace.',
}

const principles = [
  { icon: Zap, title: 'Clarity over chatter', text: 'Every handoff, status, and exception has one visible home instead of getting buried in group messages.' },
  { icon: Users, title: 'One shared operation', text: 'Retailers, dispatchers, and riders work from the same operational truth, with the access each role needs.' },
  { icon: ShieldCheck, title: 'Trust by design', text: 'Role-aware access and delivery ownership keep sensitive customer and route details in the right hands.' },
]

export default function AboutPage() {
  return <main className="about-page"><SiteNavigation /><section className="about-hero"><p className="eyebrow">Why Reflex exists</p><h1>Delivery coordination should feel like a system, not a conversation.</h1><p className="about-lede">Reflex replaces fragmented WhatsApp workflows with a calm operational workspace that keeps every delivery moving from request to proof.</p><Link href="/sign-in" className="landing-primary">See Reflex in action <ArrowRight /></Link></section><section className="about-principles"><div className="about-section-heading"><p className="eyebrow">Built for the handoff</p><h2>Less chasing. More certainty.</h2></div><div className="principles-grid">{principles.map(({ icon: Icon, title, text }) => <article key={title}><span className="benefit-icon"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div><CheckCircle2 className="principle-check" /></article>)}</div></section><section className="about-callout"><p className="eyebrow">A better daily rhythm</p><h2>Make the next delivery the easiest one to coordinate.</h2><Link href="/dashboard">Open the dashboard <ArrowRight /></Link></section><footer className="landing-footer"><span>Reflex</span><span>Delivery operations, without the noise.</span></footer></main>
}
