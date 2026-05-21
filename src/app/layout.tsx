import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { BreakingTicker } from '@/components/breaking-ticker'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { siteName } from '@/data/news'
import { absoluteUrl } from '@/lib/metadata'
import './globals.css'

export const dynamic = 'force-dynamic'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}
export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: `${siteName} - Nigerian News, Politics, Business and Sports`,
    template: `%s | ${siteName}`,
  },
  description:
    'A modern Nigerian news platform covering politics, business, sports, technology, health, entertainment and education.',
  openGraph: {
    title: `${siteName} - Nigerian News`,
    description:
      'Daily Nigerian and African news coverage with a clean editorial reading experience.',
    url: absoluteUrl('/'),
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Nigerian News`,
    description:
      'Daily Nigerian and African news coverage with a clean editorial reading experience.',
  },
}

import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get('x-current-path') ?? ''
  const isAdmin = pathname.startsWith('/admin')
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const hideShell = isAdmin || isAuthPage

  return (
    <html lang="en-NG">



      <body className="min-h-screen bg-white text-neutral-950 antialiased">
        {!hideShell && <SiteHeader />}
        {!hideShell && <BreakingTicker />}
        {children}
        {!hideShell && <SiteFooter />}
      </body>
    </html>
  )
}
