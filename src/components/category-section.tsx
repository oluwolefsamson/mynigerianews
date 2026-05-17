import Image from 'next/image'
import Link from 'next/link'

import { ChevronRight, Clock3 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CategoryDefinition, NewsArticle } from '@/types/news'

type CategorySectionProps = {
  category: CategoryDefinition
  featured: NewsArticle
  secondary: NewsArticle[]
  miniStories: NewsArticle[]
}

export function CategorySection({ category, featured, secondary, miniStories }: CategorySectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[1rem] font-semibold uppercase tracking-[0.16em] text-neutral-950">
          {category.label}
        </h2>
        <Button asChild variant="ghost" className="h-auto px-0 text-[0.78rem] font-medium text-neutral-500">
          <Link href={`/category/${category.slug}`} className="inline-flex items-center gap-1">
            Show All <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
        <Link href={`/article/${featured.slug}`} className="group block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-neutral-100">
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 38vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="mt-3">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#0a8f07]">{featured.category}</p>
            <h3 className="mt-1 text-[1rem] font-semibold leading-[1.3] tracking-[-0.02em] text-neutral-950">
              {featured.title}
            </h3>
            <p className="mt-2 text-[0.9rem] leading-6 text-neutral-600">{featured.excerpt}</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
              <Clock3 className="h-3.5 w-3.5" />
              <span>{featured.readTime}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span>{new Intl.DateTimeFormat('en-NG', { month: 'short', day: 'numeric' }).format(new Date(featured.publishedAt))}</span>
            </div>
          </div>
        </Link>

        <div className="space-y-4">
          {secondary.map((item) => (
            <Link key={item.slug} href={`/article/${item.slug}`} className="group block border-b border-neutral-200 pb-4 last:border-0 last:pb-0">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 36vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#0a8f07]">{item.category}</p>
              <h3 className="mt-1 text-[0.98rem] font-semibold leading-[1.3] tracking-[-0.02em] text-neutral-950">
                {item.title}
              </h3>
              <p className="mt-1 text-[0.9rem] leading-6 text-neutral-600">{item.excerpt}</p>
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          {miniStories.map((item) => (
            <Link key={item.slug} href={`/article/${item.slug}`} className="block border-b border-neutral-200 pb-3 last:border-0 last:pb-0">
              <Badge>{item.category}</Badge>
              <p className="mt-2 text-[0.92rem] font-medium leading-6 text-neutral-950">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
