'use client'

import Link from 'next/link'

import { Clock3, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { NewsImage } from '@/components/news-image'
import { cn } from '@/lib/utils'
import { fadeInUp } from '@/lib/motion'
import type { NewsArticle } from '@/types/news'

type NewsCardProps = {
  article: NewsArticle
  compact?: boolean
}

function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return ''
  }
}

export function NewsCard({ article, compact }: NewsCardProps) {
  const date = formatShortDate(article.publishedAt)

  if (compact) {
    return (
      <motion.div variants={fadeInUp}>
        <Link href={`/article/${article.slug}`} className="group block select-none">
          <div className="overflow-hidden rounded-[2px] bg-neutral-100">
            <div className="relative aspect-[4/3]">
              <NewsImage
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="font-semibold uppercase tracking-[0.14em] text-[#0a8f07]">{article.category}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <Clock3 className="h-3.5 w-3.5" />
              <span>{article.readTime}</span>
            </div>
            {date && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                <CalendarDays className="h-3 w-3" />
                <span suppressHydrationWarning>{date}</span>
              </div>
            )}
            <h3 className="mt-1.5 text-[0.96rem] font-medium leading-6 tracking-[-0.01em] text-neutral-950 transition-colors duration-200 group-hover:text-[#0a8f07]">
              {article.title}
            </h3>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/article/${article.slug}`} className="group block select-none">
        <div className="overflow-hidden rounded-[2px] bg-neutral-100">
          <div className="relative aspect-[16/10]">
            <NewsImage
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <Badge>{article.category}</Badge>
            <Clock3 className="h-3.5 w-3.5" />
            <span>{article.readTime}</span>
          </div>
          {date && (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
              <CalendarDays className="h-3 w-3" />
              <span suppressHydrationWarning>{date}</span>
            </div>
          )}
          <h3 className={cn('mt-1.5 text-[0.98rem] font-semibold leading-[1.35] tracking-[-0.02em] text-neutral-950 transition-colors duration-200 group-hover:text-[#0a8f07]')}>
            {article.title}
          </h3>
          <p className="mt-2 text-[0.92rem] leading-6 text-neutral-600">{article.excerpt}</p>
        </div>
      </Link>
    </motion.div>
  )
}
