'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { ArrowRight, Search, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { articles, navCategories } from '@/data/news'
import { cn } from '@/lib/utils'

type GlobalSearchProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return {
        articles: articles.slice(0, 6),
        categories: navCategories,
      }
    }

    return {
      articles: articles.filter((article) =>
        [article.title, article.excerpt, article.category, article.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(normalized),
      ),
      categories: navCategories.filter((category) =>
        [category.label, category.description].join(' ').toLowerCase().includes(normalized),
      ),
    }
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        aria-label="Close search overlay"
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative mx-auto mt-16 w-[min(92vw,860px)] rounded-[2px] border border-neutral-200 bg-white shadow-[0_20px_80px_rgba(17,17,17,0.18)]">
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-4">
          <Search className="h-5 w-5 text-neutral-400" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search headlines, categories or topics"
            className="h-11 border-0 px-0 text-base shadow-none ring-0 focus-visible:ring-0"
          />
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close search">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Latest Stories</h2>
                <span className="text-xs text-neutral-500">{results.articles.length} results</span>
              </div>
              <div className="space-y-3">
                {results.articles.slice(0, 8).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/article/${article.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="block rounded-[2px] border border-neutral-200 p-4 transition-colors hover:border-[#0a8f07]/25 hover:bg-[#0a8f07]/4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Badge className="mb-2 border-neutral-200 bg-neutral-50 text-neutral-700">{article.category}</Badge>
                        <h3 className="text-[1.02rem] font-semibold leading-tight tracking-[-0.02em] text-neutral-950">{article.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{article.excerpt}</p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400" />
                    </div>
                  </Link>
                ))}
                {!results.articles.length ? (
                  <div className="rounded-[2px] border border-dashed border-neutral-300 p-6 text-sm text-neutral-500">
                    No stories match your search.
                  </div>
                ) : null}
              </div>
            </section>

            <aside>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Categories</h2>
              <div className="space-y-2">
                {results.categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      'block rounded-[2px] border border-neutral-200 p-4 transition-colors hover:border-[#0a8f07]/25 hover:bg-[#0a8f07]/4',
                    )}
                  >
                    <p className="font-medium text-neutral-950">{category.label}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{category.description}</p>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
