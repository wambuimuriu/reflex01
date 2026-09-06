import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import './globals.css'

export const metadata: Metadata = { title: 'Reflex — Delivery operations', description: 'Replace WhatsApp-based delivery coordination with one clear operational workspace.', generator: 'v0.app' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, colorScheme: 'light', themeColor: '#f4f6f5' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
