import { createClient } from '@/lib/supabase/server'
import SettingsClient from '@/components/admin/settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase.from('site_settings').select('*')
  const map = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]))

  const settings = {
    site_name: typeof map.site_name === 'string' ? JSON.parse(map.site_name) : (map.site_name ?? 'MyNigeriaNews'),
    site_tagline: typeof map.site_tagline === 'string' ? JSON.parse(map.site_tagline) : (map.site_tagline ?? "Nigeria's Trusted News Source"),
    breaking_news: Array.isArray(map.breaking_news) ? map.breaking_news : (typeof map.breaking_news === 'string' ? JSON.parse(map.breaking_news) : []),
    social_links: typeof map.social_links === 'string' ? JSON.parse(map.social_links) : (map.social_links ?? { facebook: '', twitter: '', instagram: '', youtube: '' }),
    auto_import: typeof map.auto_import === 'string' ? JSON.parse(map.auto_import) : (map.auto_import ?? { enabled: true, interval_minutes: 60 }),
  }

  return <SettingsClient initial={settings} />
}
