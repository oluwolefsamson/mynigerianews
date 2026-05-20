'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Facebook, Instagram, Mail, MessageSquare, Twitter, Youtube } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { navCategories } from '@/data/news'
import { getFooterContent } from '@/services/cms'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

export function SiteFooter() {
  const footer = getFooterContent()

  return (
    <footer className="bg-[#0a8f07] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-start">
            <Image
              src="/logo.png"
              alt="MyNigeria News"
              width={160}
              height={54}
              className="h-auto w-[160px] object-contain brightness-0 invert"
            />
          </motion.div>
          <motion.p variants={fadeInUp} className="max-w-5xl text-[0.96rem] leading-8 text-white/95">
            {footer.description}
          </motion.p>
        </motion.div>

        <div className="my-8 h-px bg-white/30" />

        <motion.div
          className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h3 className="section-title text-[1rem] font-semibold uppercase text-white">Most Viewed Posts</h3>
            <div className="mt-5 space-y-4">
              {footer.mostViewed.map((item) => (
                <Link key={item.href} href={item.href} className="block border-b border-white/15 pb-4 last:border-0 last:pb-0 transition-opacity duration-200 hover:opacity-80">
                  <p className="text-[0.96rem] font-semibold leading-7 text-white">{item.title}</p>
                  <p className="mt-1 text-[0.75rem] text-white/70">{item.date}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="section-title text-[1rem] font-semibold uppercase text-white">News</h3>
            <ul className="mt-5 space-y-3 text-[0.96rem] text-white/95">
              {navCategories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link href={`/category/${category.slug}`} className="transition-all duration-200 hover:text-white hover:pl-1">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="section-title text-[1rem] font-semibold uppercase text-white">About</h3>
            <ul className="mt-5 space-y-3 text-[0.96rem] text-white/95">
              {[
                { href: '/about', label: 'Home' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/advertise', label: 'Advertise' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-all duration-200 hover:text-white hover:pl-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="section-title text-[1rem] font-semibold uppercase text-white">News Tags</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {footer.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[2px] border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white/95 transition-all duration-200 hover:bg-white/10 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-[2px] border border-white/20 bg-white/5 p-4">
              <label className="block text-[0.8rem] font-medium text-white/90">Newsletter</label>
              <div className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-11 border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/65 focus-visible:ring-white/20"
                  />
                </div>
                <Button asChild className="h-11 rounded-[2px] bg-white px-4 text-[0.9rem] font-semibold text-[#0a8f07] hover:bg-white/95 transition-transform duration-200 hover:scale-105">
                  <Link href="/contact?topic=newsletter">Subscribe Now</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/30 pt-5 text-sm text-white/85 sm:flex-row sm:items-center sm:justify-between">
          <p>2026 All rights reserved MyNigeriaNews</p>
          <div className="flex items-center gap-3">
            {[
              { href: 'https://facebook.com', label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
              { href: 'https://x.com', label: 'X', icon: <Twitter className="h-4 w-4" /> },
              { href: 'https://instagram.com', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
              { href: 'https://youtube.com', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
              { href: '/contact', label: 'Contact', icon: <MessageSquare className="h-4 w-4" /> },
            ].map((s) => (
              <Link key={s.label} href={s.href} aria-label={s.label} className="transition-all duration-200 hover:text-white hover:scale-110">
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
