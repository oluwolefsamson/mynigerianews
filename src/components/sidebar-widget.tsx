import Link from 'next/link'
import type { ReactNode } from 'react'

import { ArrowRight, Bell, Flame, Megaphone, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { socialLinks } from '@/data/news'

type SidebarWidgetProps = {
  title: string
  icon?: ReactNode
  children: ReactNode
}

export function SidebarWidget({ title, icon, children }: SidebarWidgetProps) {
  return (
    <div className="border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h3 className="flex items-center gap-2 text-[0.96rem] font-semibold uppercase tracking-[0.14em] text-neutral-950">
          {icon}
          {title}
        </h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export function NewsletterCard() {
  return (
    <SidebarWidget title="Newsletter" icon={<Bell className="h-4 w-4 text-[#0a8f07]" />}>
      <p className="text-[0.92rem] leading-6 text-neutral-600">
        Get the day&apos;s top Nigerian headlines, business moves and political updates in one morning briefing.
      </p>
      <div className="mt-4 space-y-3">
        <Input placeholder="Enter your email address" type="email" />
        <Button asChild className="w-full">
          <Link href="/contact?topic=newsletter">Subscribe</Link>
        </Button>
      </div>
    </SidebarWidget>
  )
}

export function SocialFollowCard() {
  return (
    <SidebarWidget title="Follow Us" icon={<Share2 className="h-4 w-4 text-[#0a8f07]" />}>
      <div className="grid grid-cols-2 gap-2">
        {socialLinks.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className="inline-flex select-none items-center justify-between rounded-[2px] border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            <span>{item.label}</span>
            <ArrowRight className="h-4 w-4 text-neutral-400" />
          </Link>
        ))}
      </div>
    </SidebarWidget>
  )
}

export function AdvertBlock() {
  return (
    <div className="border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center">
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        <Megaphone className="h-4 w-4 text-[#0a8f07]" />
        Advertisement
      </span>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Place your campaign here. Reach readers across politics, markets, sports and culture.
      </p>
      <Button asChild variant="outline" className="mt-4 w-full">
        <Link href="/advertise">Advertise with us</Link>
      </Button>
    </div>
  )
}

export function MostReadList({ items }: { items: { title: string; href: string; time: string }[] }) {
  return (
    <SidebarWidget title="Most Read" icon={<Flame className="h-4 w-4 text-[#0a8f07]" />}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.href}>
            <Link href={item.href} className="group block select-none">
              <div className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.92rem] font-medium leading-6 text-neutral-950 transition-colors group-hover:text-[#0a8f07]">
                    {item.title}
                  </p>
                  <span className="text-xs text-neutral-500">{item.time}</span>
                </div>
              </div>
            </Link>
            {index < items.length - 1 ? <Separator className="mt-4" /> : null}
          </div>
        ))}
      </div>
    </SidebarWidget>
  )
}
