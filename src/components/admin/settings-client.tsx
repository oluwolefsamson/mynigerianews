'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, CheckCircle2 } from 'lucide-react'

type Settings = {
  site_name: string
  site_tagline: string
  breaking_news: string[]
  social_links: { facebook: string; twitter: string; instagram: string; youtube: string }
  auto_import: { enabled: boolean; interval_minutes: number }
}

export default function SettingsClient({ initial }: { initial: Settings }) {
  const [settings, setSettings] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [breakingInput, setBreakingInput] = useState(initial.breaking_news.join('\n'))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const supabase = createClient()

    const updates = [
      { key: 'site_name', value: JSON.stringify(settings.site_name) },
      { key: 'site_tagline', value: JSON.stringify(settings.site_tagline) },
      { key: 'breaking_news', value: JSON.stringify(breakingInput.split('\n').filter(Boolean)) },
      { key: 'social_links', value: JSON.stringify(settings.social_links) },
      { key: 'auto_import', value: JSON.stringify(settings.auto_import) },
    ]

    for (const row of updates) {
      await supabase.from('site_settings').upsert({ key: row.key, value: row.value, updated_at: new Date().toISOString() })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">CMS Settings</h1>
          <p className="mt-0.5 text-[0.88rem] text-neutral-500">Manage site content and configuration</p>
        </div>
        <button
          type="submit" disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#0a8f07] px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-[#067203] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* General */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">General</h2>
        <Field label="Site Name">
          <input value={settings.site_name} onChange={(e) => setSettings((s) => ({ ...s, site_name: e.target.value }))}
            className={inputCls} />
        </Field>
        <Field label="Site Tagline">
          <input value={settings.site_tagline} onChange={(e) => setSettings((s) => ({ ...s, site_tagline: e.target.value }))}
            className={inputCls} />
        </Field>
      </div>

      {/* Breaking News */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">Breaking News Ticker</h2>
        <Field label="Breaking News Items" hint="One item per line">
          <textarea
            value={breakingInput}
            onChange={(e) => setBreakingInput(e.target.value)}
            rows={5} className={`${inputCls} resize-none font-mono text-[0.85rem]`}
          />
        </Field>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">Social Media Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['facebook', 'twitter', 'instagram', 'youtube'] as const).map((platform) => (
            <Field key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
              <input
                value={settings.social_links[platform]}
                onChange={(e) => setSettings((s) => ({ ...s, social_links: { ...s.social_links, [platform]: e.target.value } }))}
                placeholder={`https://${platform}.com/…`} className={inputCls}
              />
            </Field>
          ))}
        </div>
      </div>

      {/* Auto Import */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">Auto News Import</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="auto_import_enabled"
            checked={settings.auto_import.enabled}
            onChange={(e) => setSettings((s) => ({ ...s, auto_import: { ...s.auto_import, enabled: e.target.checked } }))}
            className="h-4 w-4 rounded border-neutral-300 text-[#0a8f07] focus:ring-[#0a8f07]"
          />
          <label htmlFor="auto_import_enabled" className="text-[0.88rem] font-medium text-neutral-700">
            Enable automatic RSS import
          </label>
        </div>
        <Field label="Import Interval (minutes)" hint="How often to auto-fetch new articles">
          <input
            type="number" min={15} max={1440}
            value={settings.auto_import.interval_minutes}
            onChange={(e) => setSettings((s) => ({ ...s, auto_import: { ...s.auto_import, interval_minutes: Number(e.target.value) } }))}
            className={`${inputCls} w-32`}
          />
        </Field>
      </div>
    </form>
  )
}

const inputCls = 'w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[0.76rem] text-neutral-400">{hint}</p>}
    </div>
  )
}
