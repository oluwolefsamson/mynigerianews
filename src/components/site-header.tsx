'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { Search, Send, Menu, User, X, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

import { BreakingTicker } from '@/components/breaking-ticker'
import { GlobalSearch } from '@/components/global-search'
import { Button } from '@/components/ui/button'
import { getHeaderContent } from '@/services/cms'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { navItems, promos } = getHeaderContent()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const activeLabel = useMemo(
    () => navItems.find((item) => item.href === pathname)?.label ?? 'Home',
    [navItems, pathname],
  )

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="bg-[#151515] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[11px] font-medium sm:px-6 lg:px-8">
          <span className="text-neutral-300">
            {new Intl.DateTimeFormat('en-NG', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'Africa/Lagos',
            }).format(now)}
          </span>
          <div className="flex items-center gap-3 text-neutral-300">
            <span>
              {new Intl.DateTimeFormat('en-NG', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'Africa/Lagos',
              }).format(now)}
            </span>
            <span className="h-4 w-px bg-white/25" />
            <Link href="https://facebook.com" aria-label="Facebook" className="select-none hover:text-white">
              <Facebook className="h-3.5 w-3.5" />
            </Link>
            <Link href="https://x.com" aria-label="X" className="select-none hover:text-white">
              <Twitter className="h-3.5 w-3.5" />
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram" className="select-none hover:text-white">
              <Instagram className="h-3.5 w-3.5" />
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn" className="select-none hover:text-white">
              <span className="text-[11px] font-semibold">in</span>
            </Link>
            <Link href="https://youtube.com" aria-label="YouTube" className="select-none hover:text-white">
              <Youtube className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex select-none items-center">
              <Image
                src="/logo.png"
                alt="MyNigeria News"
                width={160}
                height={54}
                priority
                className="h-auto w-[160px] object-contain"
              />
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-neutral-200 lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div className="hidden gap-3 lg:grid lg:grid-cols-2">
            {promos.map((promo, index) => (
              <Link
                key={promo.title}
                href="/contact"
                className={cn(
                  'flex h-full select-none items-center gap-4 rounded-[2px] border border-neutral-200 bg-[#f7f7f3] px-4 py-3 transition-colors hover:bg-[#f3f3ee]',
                  index === 0 && 'min-w-[270px]',
                )}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px] bg-white text-xl">
                  {promo.icon === 'search' ? <Search className="h-5 w-5 text-[#0a8f07]" /> : <Send className="h-5 w-5 text-[#0a8f07]" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold leading-5 text-neutral-950">{promo.title}</span>
                  <span className="mt-0.5 block text-[0.76rem] leading-5 text-neutral-500">{promo.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-[#0a8f07] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <nav className="hidden flex-1 items-center gap-1 py-3 lg:flex">
            {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-[2px] px-3 py-2 text-[13px] font-medium text-white/95 transition-colors hover:bg-white/10 hover:text-white select-none',
                    pathname === item.href && 'bg-white/10 text-white',
                  )}
                >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={cn(
            'fixed inset-0 z-[60] min-h-screen overflow-y-auto bg-[#0a8f07] lg:hidden',
            'origin-left transition-all duration-300 ease-out',
            open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none',
          )}
        >
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-6 pt-4 sm:px-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-white/15 bg-white/5 text-white"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 grid gap-2 sm:grid-cols-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-[2px] border border-white/15 bg-white/5 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 select-none',
                    pathname === item.href && 'bg-white/10',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <BreakingTicker />
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="sr-only">Active section {activeLabel}</div>
    </header>
  )
}
