import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { parseRssFeed, slugify, estimateReadTime } from '@/lib/rss-parser'

export const dynamic = 'force-dynamic'

// Helper to determine category based on text content
function getRssCategory(title: string, description: string): string {
  const text = `${title.toLowerCase()} ${(description || '').toLowerCase()}`

  if (text.match(/\b(tinubu|buhari|senate|governor|pdp|apc|minister|election|court|tribunal|political|democracy|government|national assembly|wike|obi|sanwo-olu|soludo|fubara|politics)\b/i)) {
    return 'Politics'
  }
  if (text.match(/\b(cbn|naira|inflation|market|economy|finance|shares|oil|petrol|subsidy|brent|price|business|dollar|currency|bank|invest|tax|dangote|economic)\b/i)) {
    return 'Business'
  }
  if (text.match(/\b(football|soccer|chelsea|arsenal|liverpool|manchester|real madrid|barcelona|super eagles|epl|premier league|champions league|caf|olympics|victor osimhen|sports|athlete|win|club|stadium|match|trophy)\b/i)) {
    return 'Sports'
  }
  if (text.match(/\b(nollywood|davido|wizkid|burna|actor|actress|music|movie|celebrity|showbiz|grammy|film|cinema|entertainment|singer|concert|fans|superstar)\b/i)) {
    return 'Entertainment'
  }
  if (text.match(/\b(tech|ai|artificial intelligence|startup|founder|crypto|bitcoin|app|phone|software|google|meta|microsoft|cybersecurity|digital|internet|chatgpt|openai|smartphone)\b/i)) {
    return 'Technology'
  }
  if (text.match(/\b(health|hospital|doctor|disease|covid|virus|medical|wellness|drug|outbreak|cholera|vaccine|clinic|who|nurse|patient|mental)\b/i)) {
    return 'Health'
  }
  if (text.match(/\b(university|school|waec|jamb|utme|education|teacher|academic|student|lecturer|asuu|college|polytechnic|exams|learning)\b/i)) {
    return 'Education'
  }

  return 'World'
}

export async function GET(request: NextRequest) {
  return handleImport(request)
}

export async function POST(request: NextRequest) {
  return handleImport(request)
}

async function handleImport(request: NextRequest) {
  try {
    // ── Secure Endpoint Authorization ──
    const authHeader = request.headers.get('authorization')
    const queryKey = request.nextUrl.searchParams.get('key')
    const headerKey = request.headers.get('x-cron-key')

    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!secretKey) {
      return NextResponse.json({ error: 'Server misconfiguration: Service role key missing' }, { status: 500 })
    }

    let isAuthorized = false
    if (queryKey === secretKey || headerKey === secretKey) {
      isAuthorized = true
    } else if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      if (token === secretKey) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Fetch enabled RSS sources
    const { data: sources, error: sourcesError } = await admin
      .from('rss_sources')
      .select('*')
      .eq('enabled', true)

    if (sourcesError || !sources?.length) {
      return NextResponse.json({ error: 'No enabled RSS sources found' }, { status: 404 })
    }

    const results = []

    for (const source of sources) {
      let imported = 0
      let skipped = 0
      let status = 'success'
      let errorMessage: string | null = null

      try {
        const items = await parseRssFeed(source.url)

        for (const item of items) {
          if (!item.title || !item.link) continue

          // 1. Check for duplicates
          const { count } = await admin
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('source_url', item.link)

          if (count && count > 0) {
            skipped++
            continue
          }

          // 2. Generate unique slug
          const baseSlug = slugify(item.title)
          let slug = baseSlug
          let attempt = 0
          while (true) {
            const { count: slugCount } = await admin
              .from('articles')
              .select('*', { count: 'exact', head: true })
              .eq('slug', slug)
            if (!slugCount || slugCount === 0) break
            attempt++
            slug = `${baseSlug}-${attempt}`
          }

          // 3. Classify category based on title and description
          const finalCategory = getRssCategory(item.title, item.description || '')

          // 4. Insert direct as 'published' status!
          const { error: insertError } = await admin.from('articles').insert({
            title: item.title,
            slug,
            excerpt: item.description?.slice(0, 300) || item.title,
            content: item.description ? item.description.split(/\n\n+/).filter(Boolean).join('\n\n') : item.title,
            category: finalCategory,
            image_url: item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop',
            image_alt: item.title,
            status: 'published', // Published status so it shows immediately
            source: 'rss',
            source_name: source.name,
            source_url: item.link,
            read_time: estimateReadTime(item.description || item.title),
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          })

          if (!insertError) {
            imported++
          } else {
            console.error(`Insert error for "${item.title}":`, insertError.message)
            skipped++
          }
        }

        // Update last fetched timestamp
        await admin
          .from('rss_sources')
          .update({ last_fetched_at: new Date().toISOString() })
          .eq('id', source.id)

      } catch (e: unknown) {
        status = 'error'
        errorMessage = e instanceof Error ? e.message : 'Unknown error'
        console.error(`Import failed for source "${source.name}":`, errorMessage)
      }

      // Log import results in standard import_log
      await admin.from('import_log').insert({
        source_id: source.id,
        source_name: source.name,
        articles_imported: imported,
        articles_skipped: skipped,
        status,
        error_message: errorMessage,
      })

      results.push({ source: source.name, imported, skipped, status })
    }

    return NextResponse.json({ success: true, results })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
