import { createClient } from '@/lib/supabase/server'
import NewsImportClient from '@/components/admin/news-import-client'

export default async function NewsImportPage() {
  const supabase = await createClient()

  const [{ data: sources }, { data: logs }] = await Promise.all([
    supabase.from('rss_sources').select('*').order('name'),
    supabase.from('import_log').select('*').order('ran_at', { ascending: false }).limit(30),
  ])

  return <NewsImportClient sources={sources ?? []} logs={logs ?? []} />
}
