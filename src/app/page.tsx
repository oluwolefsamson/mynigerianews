import Link from 'next/link'

import type { LucideIcon } from 'lucide-react'
import { Building2, CarFront, ChevronRight, Play, Briefcase } from 'lucide-react'

import { NewsCard } from '@/components/news-card'
import { NewsImage } from '@/components/news-image'
import { AdvertBlock, NewsletterCard } from '@/components/sidebar-widget'
import { Button } from '@/components/ui/button'
import { getHomePageContent } from '@/services/cms'
import { articles, getArticleBySlug, navCategories } from '@/data/news'
import { absoluteUrl } from '@/lib/metadata'
import type { NewsArticle } from '@/types/news'

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

type PortalCategoryBlockData = {
  slug: string
  label: string
  featured: NewsArticle
  list: NewsArticle[]
}

type SponsoredBannerData = {
  label: string
  title: string
  description: string
  href: string
  icon: LucideIcon
  accent: string
}

const sponsoredBanners: SponsoredBannerData[] = [
  {
    label: 'Real estate',
    title: "We're Best Real Estate Agency",
    description: 'Buy, sell and promote property listings with premium visibility.',
    href: '/advertise',
    icon: Building2,
    accent: 'from-[#0a8f07] to-[#067203]',
  },
  {
    label: 'Job platform',
    title: 'Recruitment banners that convert',
    description: 'Reach readers looking for work, hiring updates and career moves.',
    href: '/advertise',
    icon: Briefcase,
    accent: 'from-[#0f172a] to-[#334155]',
  },
  {
    label: 'Car rental platform',
    title: 'Travel and mobility bookings',
    description: 'Promote car rentals, airport pickups and short-term vehicle offers.',
    href: '/advertise',
    icon: CarFront,
    accent: 'from-[#1f2937] to-[#111827]',
  },
]

function SectionTitle({
  title,
  actionHref,
  actionLabel = 'Show All',
}: {
  title: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">{title}</h2>
      {actionHref ? (
        <Button asChild variant="ghost" className="h-auto px-0 text-[0.76rem] font-medium uppercase tracking-[0.1em] text-neutral-500">
          <Link href={actionHref} className="inline-flex select-none items-center gap-1">
            {actionLabel} <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  )
}

function StoryStack({ items }: { items: NewsArticle[] }) {
  return (
    <div className="space-y-4">
      {items.map((article, index) => (
        <Link key={article.slug} href={`/article/${article.slug}`} className="group block select-none border-b border-neutral-200 pb-4 last:border-0 last:pb-0">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#0a8f07]">{article.category}</p>
          <h3 className={index === 0 ? 'mt-1 text-[1rem] font-semibold leading-6 text-neutral-950' : 'mt-1 text-[0.94rem] font-medium leading-6 text-neutral-950'}>
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[0.88rem] leading-6 text-neutral-600">{article.excerpt}</p>
        </Link>
      ))}
    </div>
  )
}

function PortalCategoryBlock({ block }: { block: PortalCategoryBlockData }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">{block.label}</h3>
        <span className="text-[0.72rem] uppercase tracking-[0.1em] text-neutral-400">Show All -&gt;</span>
      </div>
      <div className="space-y-4">
        <Link href={`/article/${block.featured.slug}`} className="group block select-none">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-neutral-100">
            <NewsImage
              src={block.featured.image}
              alt={block.featured.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="mt-2">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#0a8f07]">{block.featured.category}</p>
            <h4 className="mt-1 text-[0.96rem] font-semibold leading-6 text-neutral-950">{block.featured.title}</h4>
          </div>
        </Link>
        <div className="space-y-3">
          {block.list.map((item) => (
            <Link key={item.slug} href={`/article/${item.slug}`} className="group block select-none border-b border-neutral-200 pb-3 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center border border-neutral-300">
                  <span className="h-2.5 w-2.5 bg-neutral-900" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.86rem] leading-6 text-neutral-950 transition-colors group-hover:text-[#0a8f07]">{item.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function SponsoredBannerCard({ banner, compact = false }: { banner: SponsoredBannerData; compact?: boolean }) {
  return (
    <Link
      href={banner.href}
      className={`group block select-none overflow-hidden border border-neutral-200 bg-white transition-transform duration-300 hover:-translate-y-0.5 hover:border-neutral-300 ${
        compact ? 'p-4' : ''
      }`}
      aria-label={`${banner.label} advertising banner`}
    >
      <div className={`rounded-[2px] bg-gradient-to-br ${banner.accent} p-4 text-white ${compact ? '' : 'sm:p-5'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/80">{banner.label}</p>
            <h3 className={`mt-2 font-semibold leading-[1.05] tracking-[-0.04em] ${compact ? 'text-[1.05rem]' : 'text-[1.4rem] sm:text-[1.75rem]'}`}>
              {banner.title}
            </h3>
            <p className={`mt-3 text-white/80 ${compact ? 'text-[0.88rem] leading-6' : 'text-[0.92rem] leading-7'}`}>
              {banner.description}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <banner.icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const home = getHomePageContent()
  const lead = getArticleBySlug(home.hero.leadSlug)
  const leadRight = home.hero.sideSlugs.map((slug) => getArticleBySlug(slug)).filter(isDefined)

  const trending = home.trending.slugs.map((slug) => getArticleBySlug(slug)).filter(isDefined)
  const sports = home.sports.slugs.map((slug) => getArticleBySlug(slug)).filter(isDefined)
  const editorPicks = home.editorPicks.slugs.map((slug) => getArticleBySlug(slug)).filter(isDefined)
  const featuredPosts = home.featuredPosts.slugs.map((slug) => getArticleBySlug(slug)).filter(isDefined)
  const weeklyArticles = editorPicks.slice(0, 4)

  const portalCategoryBlocks: PortalCategoryBlockData[] = home.categoryBlocks.map((block) => ({
    slug: block.slug,
    label: block.label,
    featured: getArticleBySlug(block.featuredSlug) ?? articles[0],
    list: block.listSlugs.map((slug) => getArticleBySlug(slug)).filter(isDefined),
  }))

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            {lead ? (
              <Link href={`/article/${lead.slug}`} className="group block select-none h-full">
                <div className="relative h-full min-h-[320px] overflow-hidden bg-neutral-100 lg:min-h-[340px]">
                  <NewsImage
                    src={lead.image}
                    alt={lead.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-white/90">{lead.category}</p>
                    <h1 className="mt-2 max-w-2xl text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.4rem]">
                      {lead.title}
                    </h1>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {leadRight.map((article) => (
                <Link key={article.slug} href={`/article/${article.slug}`} className="group block select-none h-full">
                  <div className="relative h-full min-h-[145px] overflow-hidden bg-neutral-100">
                    <NewsImage
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      sizes="(max-width: 768px) 50vw, 22vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/8 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/28 p-2.5 backdrop-blur-[1px]">
                      <h3 className="line-clamp-2 text-[0.88rem] font-semibold leading-5 text-white">{article.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border border-neutral-200 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 items-center border-r border-neutral-200 pr-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#0a8f07]">
                  Breaking News
                </span>
                <p className="min-w-0 text-[0.92rem] leading-6 text-neutral-700">
                  Saraki Foundation to provide Ramadan Iftar meals in seven states, 52 Mosques in Kwara
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <StoryStack items={trending.slice(0, 3)} />
              <div className="grid gap-3">
                {sponsoredBanners.map((banner) => (
                  <SponsoredBannerCard key={banner.label} banner={banner} compact />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <SectionTitle title="Trending News" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {trending.map((article) => (
            <NewsCard key={article.slug} article={article} compact />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sponsoredBanners.map((banner) => (
            <SponsoredBannerCard key={banner.label} banner={banner} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">Sports</h2>
              <span className="text-[0.72rem] uppercase tracking-[0.1em] text-neutral-400">Show All -&gt;</span>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {sports.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AdvertBlock />
            <NewsletterCard />
          </div>
        </div>
      </section>

      <section className="mt-12 bg-[#fbf2f2]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">{home.weeklyReview.title}</h2>
            <span className="text-[0.72rem] uppercase tracking-[0.1em] text-neutral-400">Show All -&gt;</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {weeklyArticles.map((article) => (
              <Link key={article.slug} href={`/article/${article.slug}`} className="group block select-none bg-white p-3">
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <NewsImage
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#0a8f07]">{article.category}</p>
                  <h3 className="mt-1 text-[0.94rem] font-medium leading-6 text-neutral-950">{article.title}</h3>
                  <p className="mt-1 text-[0.8rem] text-neutral-500">{article.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="space-y-5">
            <SectionTitle title="Editor's Picks" actionHref="/category/politics" />
            {lead ? (
              <Link href={`/article/${lead.slug}`} className="group block select-none overflow-hidden border border-neutral-200 bg-white">
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <NewsImage
                    src={lead.image}
                    alt={lead.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-white/90">
                      Balloon, large airbag filled with hot air
                    </p>
                    <h3 className="mt-1 text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[1.9rem]">
                      Super Admin
                    </h3>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              {editorPicks.slice(1, 5).map((article) => (
                <Link key={article.slug} href={`/article/${article.slug}`} className="group block select-none overflow-hidden border border-neutral-200 bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <NewsImage
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/85">{article.category}</p>
                      <h4 className="mt-1 text-[0.95rem] font-medium leading-5 text-white">{article.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside>
            <div className="border border-neutral-200 bg-white p-4">
              <h3 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">Featured Posts</h3>
              <div className="mt-4 space-y-4">
                {featuredPosts.map((article, index) => (
                  <Link key={article.slug} href={`/article/${article.slug}`} className="flex select-none gap-3 border-b border-neutral-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-neutral-100">
                      {index === 0 ? (
                        <NewsImage
                          src={article.image}
                          alt={article.imageAlt}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-neutral-500">IMG</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#0a8f07]">{article.category}</p>
                      <h4 className="mt-1 text-[0.92rem] leading-6 text-neutral-950">{article.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 border border-neutral-200 bg-white p-4">
              <h3 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">Weekly Review</h3>
              <div className="mt-4 space-y-3">
                {weeklyArticles.map((article) => (
                  <Link key={article.slug} href={`/article/${article.slug}`} className="block select-none border-b border-neutral-200 pb-3 last:border-0 last:pb-0">
                    <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#0a8f07]">{article.category}</p>
                    <p className="mt-1 text-[0.92rem] leading-6 text-neutral-950">{article.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-12 bg-[#eff7db]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">{home.featuredVideo.title}</h2>
            <span className="text-[0.72rem] uppercase tracking-[0.1em] text-neutral-400">Show All -&gt;</span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
            {lead ? (
              <Link href={`/article/${lead.slug}`} className="group block select-none overflow-hidden border border-neutral-200 bg-white">
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <NewsImage
                    src={lead.image}
                    alt={lead.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <button
                    type="button"
                    aria-label="Play video"
                    className="absolute left-5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm"
                  >
                    <Play className="h-6 w-6 fill-white" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-white/85">Featured clip</p>
                    <h3 className="mt-2 max-w-2xl text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[1.9rem]">
                      {lead.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="border border-neutral-200 bg-white p-4">
              <h3 className="section-title text-[1rem] font-semibold uppercase text-neutral-950">Watch Next</h3>
              <div className="mt-4 space-y-4">
                {featuredPosts.slice(0, 3).map((article) => (
                  <Link key={article.slug} href={`/article/${article.slug}`} className="group flex select-none gap-3 border-b border-neutral-200 pb-4 last:border-0 last:pb-0">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-neutral-100">
                      <NewsImage
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#0a8f07]">{article.category}</p>
                      <h4 className="mt-1 text-[0.92rem] leading-6 text-neutral-950">{article.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {portalCategoryBlocks.map((block) => (
            <PortalCategoryBlock key={block.slug} block={block} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {navCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="select-none border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#0a8f07]">{category.label}</p>
              <p className="mt-2 text-[0.92rem] leading-6 text-neutral-700">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'MyNigeriaNews',
            url: absoluteUrl('/'),
            potentialAction: {
              '@type': 'SearchAction',
              target: `${absoluteUrl('/')}search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </main>
  )
}
