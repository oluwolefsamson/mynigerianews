import { createAdminClient } from '@/lib/supabase/server'
import type { NewsArticle, CategorySlug } from '@/types/news'
import { parseRssFeed, slugify, estimateReadTime } from '@/lib/rss-parser'

// ── Supabase row → NewsArticle mapper ─────────────────────────────

type ArticleRow = {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  category: string
  image_url: string | null
  image_alt: string | null
  video_url: string | null
  status: string
  source: string | null
  source_name: string | null
  source_url: string | null
  read_time: string | null
  author_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

const CATEGORY_SLUG_MAP: Record<string, CategorySlug> = {
  politics: 'politics',
  business: 'business',
  entertainment: 'entertainment',
  sports: 'sports',
  technology: 'technology',
  health: 'health',
  education: 'education',
  world: 'world',
  africa: 'world',
}

function toCategorySlug(category: string): CategorySlug {
  return CATEGORY_SLUG_MAP[category.toLowerCase()] ?? 'world'
}

function mapRowToArticle(row: ArticleRow): NewsArticle {
  const contentParagraphs = row.content
    ? row.content.split(/\n\n+/).filter((p) => p.trim().length > 0)
    : ['']

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? row.title,
    category: row.category,
    categorySlug: toCategorySlug(row.category),
    author: row.source_name ?? 'Editorial Desk',
    authorRole: row.source === 'rss' ? 'Wire Service' : 'Staff Writer',
    publishedAt: row.published_at ?? row.created_at,
    readTime: row.read_time ?? '3 min read',
    image: row.image_url ?? 'https://img.freepik.com/free-photo/group-people-working-out-business-plan-office_1303-15773.jpg',
    imageAlt: row.image_alt ?? row.title,
    video_url: row.video_url,
    featured: false,
    tags: [row.category],
    content: contentParagraphs,
    related: [],
  }
}

// ── Public query functions ─────────────────────────────────────────

/**
 * Fetch all published articles ordered by published_at desc.
 * Uses the admin client so RLS does not block the read on the server side.
 */
export async function getPublishedArticles(limit = 30): Promise<NewsArticle[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return (data as ArticleRow[]).map(mapRowToArticle)
  } catch {
    return []
  }
}

/**
 * Fetch a single published article by its slug.
 */
export async function getArticleBySlugFromDB(slug: string): Promise<NewsArticle | null> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) return null
    return mapRowToArticle(data as ArticleRow)
  } catch {
    return null
  }
}

/**
 * Fetch published articles by category name.
 */
export async function getArticlesByCategoryFromDB(
  category: string,
  limit = 20,
): Promise<NewsArticle[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .ilike('category', category)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return (data as ArticleRow[]).map(mapRowToArticle)
  } catch {
    return []
  }
}

/**
 * Fetch breaking news items from site_settings.
 */
export async function getBreakingNewsItems(): Promise<string[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'breaking_news')
      .single()

    if (error || !data) return []
    const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Automatically fetch, parse, and categorize dynamic free news from RSS feeds
 * twice daily (12h caching) on-the-fly, returning up to 150 items.
 * Does not write anything to the database!
 */
export async function fetchRssAutoNews(): Promise<NewsArticle[]> {
  const feeds = [
    { name: 'Punch', url: 'https://punchng.com/feed/' },
    { name: 'Vanguard', url: 'https://www.vanguardngr.com/feed/' },
    { name: 'Premium Times', url: 'https://www.premiumtimesng.com/feed/' },
    { name: 'Guardian', url: 'https://guardian.ng/feed/' },
    { name: 'BBC Africa', url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml' }
  ]

  const allArticles: NewsArticle[] = []
  const seenUrls = new Set<string>()

  try {
    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        const items = await parseRssFeed(feed.url)
        return items.map((item) => ({ ...item, sourceName: feed.name }))
      })
    )

    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) {
        for (const item of res.value) {
          if (!item.link || seenUrls.has(item.link)) continue
          seenUrls.add(item.link)

          // Keyword-based high-fidelity category classification
          const titleLower = item.title.toLowerCase()
          const descLower = (item.description || '').toLowerCase()
          const text = `${titleLower} ${descLower}`

          let category = 'World'
          if (text.match(/\b(tinubu|buhari|senate|governor|pdp|apc|minister|election|court|tribunal|political|democracy|government|national assembly|wike|obi|sanwo-olu|soludo|fubara|politics)\b/i)) {
            category = 'Politics'
          } else if (text.match(/\b(cbn|naira|inflation|market|economy|finance|shares|oil|petrol|subsidy|brent|price|business|dollar|currency|bank|invest|tax|dangote|economic)\b/i)) {
            category = 'Business'
          } else if (text.match(/\b(football|soccer|chelsea|arsenal|liverpool|manchester|real madrid|barcelona|super eagles|epl|premier league|champions league|caf|olympics|victor osimhen|sports|athlete|win|club|stadium|match|trophy)\b/i)) {
            category = 'Sports'
          } else if (text.match(/\b(nollywood|davido|wizkid|burna|actor|actress|music|movie|celebrity|showbiz|grammy|film|cinema|entertainment|singer|concert|fans|superstar)\b/i)) {
            category = 'Entertainment'
          } else if (text.match(/\b(tech|ai|artificial intelligence|startup|founder|crypto|bitcoin|app|phone|software|google|meta|microsoft|cybersecurity|digital|internet|chatgpt|openai|smartphone)\b/i)) {
            category = 'Technology'
          } else if (text.match(/\b(health|hospital|doctor|disease|covid|virus|medical|wellness|drug|outbreak|cholera|vaccine|clinic|who|nurse|patient|mental)\b/i)) {
            category = 'Health'
          } else if (text.match(/\b(university|school|waec|jamb|utme|education|teacher|academic|student|lecturer|asuu|college|polytechnic|exams|learning)\b/i)) {
            category = 'Education'
          } else if (item.sourceName === 'BBC Africa') {
            category = 'Africa'
          }

          const categorySlug = toCategorySlug(category)
          const slug = slugify(item.title)

          allArticles.push({
            slug,
            title: item.title,
            excerpt: item.description?.slice(0, 300) || item.title,
            category,
            categorySlug,
            author: item.sourceName,
            authorRole: 'Wire Service',
            publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            readTime: estimateReadTime(item.description || item.title),
            image: item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop',
            imageAlt: item.title,
            video_url: null,
            featured: false,
            tags: [category],
            content: item.description ? item.description.split(/\n\n+/).filter(Boolean) : [item.title],
            related: [],
            sourceUrl: item.link || null,
          })
        }
      }
    }
  } catch (e) {
    console.error('Error in fetchRssAutoNews:', e)
  }

  // Sort by published date descending
  return allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

/**
 * Find a single RSS article by its slug (uses cached fetchRssAutoNews, so no extra network cost).
 */
export async function findRssArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const articles = await fetchRssAutoNews()
    return articles.find((a) => a.slug === slug) ?? null
  } catch {
    return null
  }
}
