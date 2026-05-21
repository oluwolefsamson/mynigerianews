import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MessageSquare } from 'lucide-react'

import { ArticleMeta } from '@/components/article-meta'
import { ArticleShareActions } from '@/components/article-share-actions'
import { NewsImage } from '@/components/news-image'
import { NewsCard } from '@/components/news-card'
import { AdvertBlock, MostReadList, NewsletterCard, SocialFollowCard } from '@/components/sidebar-widget'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { articles, getArticleBySlug, getRelatedArticles } from '@/data/news'
import { absoluteUrl } from '@/lib/metadata'


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
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
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = getRelatedArticles(article).slice(0, 3)
  const mostRead = articles.slice(0, 4).map((item) => ({
    title: item.title,
    href: `/article/${item.slug}`,
    time: item.readTime,
  }))
  const date = new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt))

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-950">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${article.categorySlug}`} className="hover:text-neutral-950">
          {article.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-950">{article.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <header className="max-w-4xl">
            <Badge className="border-[#0a8f07]/20 bg-[#0a8f07]/5 text-[#0a8f07]">{article.category}</Badge>
            <h1 className="mt-4 text-[2.05rem] font-bold leading-[1.07] tracking-[-0.04em] text-neutral-950 sm:text-[3rem]">
              {article.title}
            </h1>
            <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-neutral-600">{article.excerpt}</p>
            <div className="mt-5">
              <ArticleMeta
                category={article.category}
                author={article.author}
                authorRole={article.authorRole}
                publishedAt={article.publishedAt}
                readTime={article.readTime}
                location={article.location}
              />
            </div>
          </header>

          <div className="mt-7 overflow-hidden rounded-[2px] border border-neutral-200">
            <div className="relative aspect-[16/9]">
              <NewsImage
                src={article.image}
                alt={article.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <div className="article-content max-w-3xl">
                {article.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {article.bullets ? (
                  <ul>
                    {article.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-neutral-700">Share:</span>
                <ArticleShareActions url={absoluteUrl(`/article/${article.slug}`)} title={article.title} />
              </div>

              <section className="mt-10">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">Related</p>
                    <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-neutral-950">More from this desk</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {related.map((item) => (
                    <NewsCard key={item.slug} article={item} compact />
                  ))}
                </div>
              </section>

              <section className="mt-10">
                <Card className="border-neutral-200">
                  <CardHeader className="border-b border-neutral-200">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="h-5 w-5 text-[#0a8f07]" />
                      Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <p className="text-sm leading-6 text-neutral-600">
                      Join the conversation. Be concise, respectful and relevant to the story.
                    </p>
                    <form className="mt-4 space-y-3" action="mailto:editor@mynigeria.news" method="post" encType="text/plain">
                      <Textarea name="comment" placeholder="Write your comment" />
                      <div className="flex justify-end">
                        <Button type="submit">Post comment</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </section>
            </div>

            <aside className="space-y-4">
              <Card className="border-neutral-200">
                <CardHeader className="border-b border-neutral-200">
                  <CardTitle className="text-sm uppercase tracking-[0.14em] text-neutral-900">Article Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4 text-sm text-neutral-600">
                  <p><span className="font-medium text-neutral-950">Published:</span> {date}</p>
                  <p><span className="font-medium text-neutral-950">Reading time:</span> {article.readTime}</p>
                  <p><span className="font-medium text-neutral-950">Tags:</span> {article.tags.join(', ')}</p>
                </CardContent>
              </Card>
              <MostReadList items={mostRead} />
              <AdvertBlock />
              <NewsletterCard />
              <SocialFollowCard />
            </aside>
          </div>
        </article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.excerpt,
            image: [article.image],
            datePublished: article.publishedAt,
            author: {
              '@type': 'Person',
              name: article.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'MyNigeriaNews',
              logo: {
                '@type': 'ImageObject',
                url: absoluteUrl('/logo.png'),
              },
            },
            mainEntityOfPage: absoluteUrl(`/article/${article.slug}`),
          }),
        }}
      />
    </main>
  )
}
