'use client'

import { useEffect, useState } from 'react'
import { Clock4, Megaphone } from 'lucide-react'
import { motion } from 'framer-motion'

import { breakingItems as staticBreakingItems } from '@/data/news'

export function BreakingTicker() {
  const [items, setItems] = useState<string[]>(staticBreakingItems)

  useEffect(() => {
    async function fetchBreaking() {
      try {
        const res = await fetch('/api/breaking-news')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setItems(data)
          }
        }
      } catch {
        // Keep static fallback
      }
    }
    fetchBreaking()
  }, [])

  return (
    <motion.div
      className="border-b border-neutral-200 bg-white"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
    >
      <div className="mx-auto flex max-w-7xl items-stretch gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-[2px] bg-[#ecf6eb] px-4 py-3 text-[12px] font-semibold text-neutral-950">
          <Megaphone className="h-3.5 w-3.5 text-[#0a8f07]" />
          Breaking News
        </div>
        <div className="min-w-0 flex-1 overflow-hidden rounded-[2px] border border-neutral-200 bg-white px-4 py-3">
          <div className="ticker flex min-w-max items-center gap-10 text-[13px] text-neutral-700">
            {items.map((item) => (
              <span key={item} className="flex items-center gap-3 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0a8f07]" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-neutral-400 md:inline-flex">
          {/* Animated pulse dot */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0a8f07] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0a8f07]" />
          </span>
          <Clock4 className="h-3.5 w-3.5" />
          Live
        </div>
      </div>
    </motion.div>
  )
}
