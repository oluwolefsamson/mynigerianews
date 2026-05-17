import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ChevronRight } from 'lucide-react'

import { NewsCard } from '@/components/news-card'
import { AdvertBlock, MostReadList, NewsletterCard, SocialFollowCard } from '@/components/sidebar-widget'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getCategoryPageContent } from '@/services/cms'
import { getArticlesByCategory } from '@/data/news'
import { absoluteUrl } from '@/lib/metadata'

export function generateStaticParams() {
  return getCategoryPageContent().map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryPageContent().find((item) => item.slug === slug)
  if (!category) return {}

  return {
    title: `${category.label} News`,
    description: category.description,
    openGraph: {
      title: `${category.label} News | MyNigeriaNews`,
      description: category.description,
      url: absoluteUrl(`/category/${category.slug}`),
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryPageContent().find((item) => item.slug === slug)
  if (!category) notFound()

  const articles = getArticlesByCategory(category.slug)
  const lead = articles[0]
  const rest = articles.slice(1)
  const mostRead = articles.slice(0, 4).map((article) => ({
    title: article.title,
    href: `/article/${article.slug}`,
    time: article.readTime,
  }))

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-neutral-950">
          Home
        </Link>
        <ChevronRight className="mx-1 inline h-4 w-4" />
        <span className="text-neutral-950">{category.label}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="border border-neutral-200 bg-white p-5">
            <Badge className="border-[#0a8f07]/20 bg-[#0a8f07]/5 text-[#0a8f07]">{category.label}</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-neutral-950 sm:text-4xl">{category.label} coverage</h1>
            <p className="mt-3 max-w-3xl text-[0.96rem] leading-7 text-neutral-600">{category.description}</p>
          </div>

          {lead ? <NewsCard article={lead} /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <MostReadList items={mostRead} />
          <AdvertBlock />
          <NewsletterCard />
          <SocialFollowCard />
        </aside>
      </div>

      <Card className="mt-8 border-neutral-200" id="more-stories">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">More stories</p>
              <h2 className="mt-1 text-lg font-bold text-neutral-950">Dig deeper into the archive</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="#more-stories">Load more</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
