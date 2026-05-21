import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleMeta } from '@/components/article-meta'
import { ArticleShareActions } from '@/components/article-share-actions'
import { NewsImage } from '@/components/news-image'
import { Badge } from '@/components/ui/badge'

import { articles, getArticleBySlug, getRelatedArticles } from '@/data/news'
import { getArticleBySlugFromDB, getArticlesByCategoryFromDB, findRssArticleBySlug } from '@/services/article-service'
import { absoluteUrl } from '@/lib/metadata'
import { absoluteUrl } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlugFromDB(slug) ?? getArticleBySlug(slug) ?? await findRssArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: absoluteUrl(`/article/${article.slug}`),
      images: [{ url: article.image, width: 1200, height: 630, alt: article.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlugFromDB(slug) ?? getArticleBySlug(slug) ?? await findRssArticleBySlug(slug)
  if (!article) notFound()

  // Increment view count (admin client respects RLS)
  const supabaseAdmin = createAdminClient()
  await supabaseAdmin
    .from('articles')
    .update({ views_count: (article.views_count ?? 0) + 1 })
    .eq('id', article.id)

  // Fetch the updated view count (optional but ensures accuracy)
  const { data: refreshed } = await supabaseAdmin
    .from('articles')
    .select('views_count')
    .eq('id', article.id)
    .single()
  const currentViews = refreshed?.views_count ?? article.views_count ?? 0

  // Related articles handling
  const dbRelated = await getArticlesByCategoryFromDB(article.category, 4)
  const staticRelated = article.related?.length ? getRelatedArticles(article).slice(0, 3) : []
  const related = dbRelated.filter((r) => r.slug !== article.slug).slice(0, 3).length > 0
    ? dbRelated.filter((r) => r.slug !== article.slug).slice(0, 3)
    : staticRelated

  const mostRead = articles.slice(0, 4).map((item) => ({
    title: item.title,
    href: `/article/${item.slug}`,
    time: item.readTime,
  }))

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-950">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${article.categorySlug}`} className="hover:text-neutral-950">{article.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-950">{article.title}</span>
      </nav>

      <article>
        <header className="max-w-4xl">
          <Badge className="border-[#0a8f07]/20 bg-[#0a8f07]/5 text-[#0a8f07]">{article.category}</Badge>
          <h1 className="mt-4 text-[2.05rem] font-bold leading-[1.07] tracking-[-0.04em] text-neutral-950 sm:text-[3rem]">{article.title}</h1>
          <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-neutral-600">{article.excerpt}</p>
          <div className="mt-5">
            <ArticleMeta
              category={article.category}
              author={article.author}
              authorRole={article.authorRole}
              publishedAt={article.publishedAt}
              readTime={article.readTime}
              location={article.location}
              viewsCount={currentViews}
            />
          </div>
        </header>

        {article.video_url ? (
          <div className="mt-7 overflow-hidden rounded-[2px] border border-neutral-200 bg-black aspect-[16/9]">
            <video src={article.video_url} controls className="w-full h-full object-contain" poster={article.image} />
          </div>
        ) : (
          <div className="mt-7 overflow-hidden rounded-[2px] border border-neutral-200">
            <div className="relative aspect-[16/9]">
              <NewsImage src={article.image} alt={article.imageAlt} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 720px" />
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="article-content max-w-3xl">
              {article.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
              {article.bullets && (
                <ul>
                  {article.bullets.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-700">Share:</span>
              <ArticleShareActions url={absoluteUrl(`/article/${article.slug}`)} title={article.title} />
            </div>
          </div>
          {/* Sidebar could host most read, ads, etc. */}
        </div>
      </article>
    </main>
  )
}
