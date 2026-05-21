import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { parseRssFeed, slugify, estimateReadTime } from '@/lib/rss-parser'

export async function POST(request: NextRequest) {
  // Verify user is logged in via session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Use admin client for all DB writes (bypasses RLS)
  const admin = createAdminClient()

  const body = await request.json().catch(() => ({}))
  const sourceId: string | undefined = body.sourceId

  let sourcesQuery = admin.from('rss_sources').select('*').eq('enabled', true)
  if (sourceId) sourcesQuery = sourcesQuery.eq('id', sourceId)
  const { data: sources } = await sourcesQuery

  if (!sources?.length) {
    return NextResponse.json({ error: 'No enabled RSS sources found' }, { status: 400 })
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

        // Check for duplicates
        const { count } = await admin
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('source_url', item.link)

        if (count && count > 0) { skipped++; continue }

        // Generate unique slug
        let baseSlug = slugify(item.title)
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

        const { error: insertError } = await admin.from('articles').insert({
          title: item.title,
          slug,
          excerpt: item.description?.slice(0, 300) ?? '',
          content: item.description ?? '',
          category: source.category,
          image_url: item.imageUrl,
          image_alt: item.title,
          status: 'draft',
          source: 'rss',
          source_name: source.name,
          source_url: item.link,
          read_time: estimateReadTime(item.description ?? item.title),
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        })

        if (!insertError) imported++
        else { console.error('Insert error:', insertError.message); skipped++ }
      }

      await admin
        .from('rss_sources')
        .update({ last_fetched_at: new Date().toISOString() })
        .eq('id', source.id)

    } catch (e: unknown) {
      status = 'error'
      errorMessage = e instanceof Error ? e.message : 'Unknown error'
    }

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
}
