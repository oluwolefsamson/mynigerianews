'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Clock, RefreshCw } from 'lucide-react'
import type { NewsArticle } from '@/types/news'


interface AutoNewsFeedProps {
  articles: NewsArticle[]
}

function getRelativeTimeString(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (isNaN(date.getTime())) return 'Recently'
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  } catch {
    return 'Recently'
  }
}

function getFormattedDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  } catch {
    return ''
  }
}

export function AutoNewsFeed({ articles }: AutoNewsFeedProps) {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<NewsArticle[]>([])

  useEffect(() => {
    setMounted(true)
    // Top 8 articles for a compact, scannable feed
    setItems(articles.slice(0, 8))
  }, [articles])

  // Prevent server-side hydration mismatches for relative times
  if (!mounted) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <span className="h-2 w-2 rounded-full bg-neutral-200 animate-pulse" />
          <h2 className="text-[0.88rem] font-bold uppercase tracking-wide text-neutral-900">Live Feed</h2>
        </div>
        <div className="mt-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-1.5 border-b border-neutral-100 pb-3 last:border-0">
              <div className="h-3 w-1/4 rounded bg-neutral-200" />
              <div className="h-4 w-3/4 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="rounded-lg border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0a8f07] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0a8f07]" />
          </span>
          <h2 className="text-[0.85rem] font-bold uppercase tracking-wide text-neutral-900 inline-flex items-center gap-1.5">
            Live Feed <Radio className="h-3.5 w-3.5 text-[#0a8f07] animate-pulse" />
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
          <RefreshCw className="h-2.5 w-2.5 animate-[spin_4s_linear_infinite]" /> Auto
        </span>
      </div>

      {/* Feed List — height synced with hero grid */}
      <div className="max-h-[295px] overflow-y-auto px-4 py-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[0.92rem] text-neutral-500 font-medium">No live feed available at this time.</p>
            <p className="mt-1 text-[0.8rem] text-neutral-400">Please check back in a few minutes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((article, index) => {
                const relativeTime = getRelativeTimeString(article.publishedAt)
                const formattedDate = getFormattedDate(article.publishedAt)
                
                return (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group border-b border-neutral-100 py-2.5 last:border-0 last:pb-0 first:pt-0"
                  >
                    <Link
                      href={`/article/${article.slug}`}
                      className="block select-none"
                    >
                      {/* Category badge + time */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-[0.08em] bg-[#0a8f07]/10 text-[#0a8f07] border border-[#0a8f07]/20">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium shrink-0">
                          <Clock className="h-3 w-3" />
                          <span>{relativeTime}</span>
                        </div>
                      </div>

                      {/* Formatted date */}
                      {formattedDate && (
                        <p className="mt-1 text-[10px] text-neutral-400">{formattedDate}</p>
                      )}

                      {/* Headline */}
                      <div className="mt-1.5">
                        <h3 className="text-[0.82rem] font-semibold leading-[1.3] text-neutral-900 transition-colors duration-200 group-hover:text-[#0a8f07]">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
