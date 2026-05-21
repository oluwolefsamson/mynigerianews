'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Search, Send, Menu, User, X, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

import { GlobalSearch } from '@/components/global-search'
import { Button } from '@/components/ui/button'
import { getHeaderContent } from '@/services/cms'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { navItems, promos } = getHeaderContent()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 64)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const activeLabel = useMemo(
    () => navItems.find((item) => item.href === pathname)?.label ?? 'Home',
    [navItems, pathname],
  )

  return (
    <>
      <motion.header
        className="bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
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
              {[
                { href: 'https://facebook.com', label: 'Facebook', icon: <Facebook className="h-3.5 w-3.5" /> },
                { href: 'https://x.com', label: 'X', icon: <Twitter className="h-3.5 w-3.5" /> },
                { href: 'https://instagram.com', label: 'Instagram', icon: <Instagram className="h-3.5 w-3.5" /> },
                { href: 'https://linkedin.com', label: 'LinkedIn', icon: <span className="text-[11px] font-semibold">in</span> },
                { href: 'https://youtube.com', label: 'YouTube', icon: <Youtube className="h-3.5 w-3.5" /> },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="select-none transition-all duration-200 hover:text-white hover:scale-110"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className={cn(
                  'flex select-none items-center transition-all duration-300',
                  hasScrolled ? 'pointer-events-none -translate-y-2 scale-95 opacity-0' : 'opacity-100',
                )}
              >
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
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-neutral-200 transition-all duration-300 lg:hidden',
                  hasScrolled ? 'pointer-events-none translate-y-2 scale-90 opacity-0' : 'opacity-100',
                )}
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
                <motion.div
                  key={promo.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href="/contact"
                    className={cn(
                      'flex h-full select-none items-center gap-4 rounded-[2px] border border-neutral-200 bg-[#f7f7f3] px-4 py-3 transition-all duration-200 hover:bg-[#f3f3ee] hover:shadow-sm hover:-translate-y-0.5',
                      index === 0 && 'min-w-[270px]',
                    )}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px] bg-white text-xl shadow-sm">
                      {promo.icon === 'search' ? <Search className="h-5 w-5 text-[#0a8f07]" /> : <Send className="h-5 w-5 text-[#0a8f07]" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-semibold leading-5 text-neutral-950">{promo.title}</span>
                      <span className="mt-0.5 block text-[0.76rem] leading-5 text-neutral-500">{promo.description}</span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="sticky top-0 z-50 bg-[#0a8f07] text-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className={cn(
              'flex select-none items-center transition-all duration-300 lg:hidden',
              hasScrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
            )}
          >
            <Image
              src="/logo.png"
              alt="MyNigeria News"
              width={132}
              height={44}
              className="h-auto w-[132px] object-contain brightness-0 invert"
            />
          </Link>
          <nav className="hidden flex-1 items-center gap-1 py-3 lg:flex">
            {navItems.map((item, i) => (
              <motion.div
                key={`${item.label}-${item.href}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'relative rounded-[2px] px-3 py-2 text-[13px] font-medium text-white/95 transition-colors hover:bg-white/10 hover:text-white select-none group',
                    pathname === item.href && 'bg-white/10 text-white',
                  )}
                >
                  {item.label}
                  {/* Underline slide effect */}
                  <span
                    className={cn(
                      'absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-white transition-all duration-300',
                      pathname === item.href ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100',
                    )}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white transition-all duration-200 hover:scale-105"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white transition-all duration-200 hover:scale-105"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Button>
            <button
              type="button"
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-white/20 bg-white/10 text-white transition-all duration-300 lg:hidden',
                hasScrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
              )}
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-navigation"
              className="fixed inset-0 z-[60] min-h-screen overflow-y-auto bg-[#0a8f07] lg:hidden"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-6 pt-4 sm:px-6">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Menu</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="mt-4 grid gap-2 sm:grid-cols-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={`${item.label}-${item.href}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'block rounded-[2px] border border-white/15 bg-white/5 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 select-none',
                          pathname === item.href && 'bg-white/10',
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="sr-only">Active section {activeLabel}</div>
    </>
  )
}
