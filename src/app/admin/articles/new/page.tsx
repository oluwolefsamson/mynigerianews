'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['Politics','Business','Sports','Technology','Health','Entertainment','Education','World','Africa','Nigeria']

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Politics',
    excerpt: '',
    content: '',
    image_url: '',
    image_alt: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    published_at: '',
  })

  function update(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !prev.slug) next.slug = slugify(value)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      ...form,
      source: 'manual',
      author_id: user?.id,
      published_at: form.status === 'published' ? (form.published_at || new Date().toISOString()) : null,
      read_time: `${Math.max(1, Math.round(form.content.split(' ').length / 200))} min read`,
    }

    const { error: dbError } = await supabase.from('articles').insert(payload)

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    router.push('/admin/articles')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/articles" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">New Article</h1>
          <p className="text-[0.85rem] text-neutral-500">Create a new article manually</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">Content</h2>

          {/* Title */}
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Title *</label>
            <input
              required value={form.title} onChange={(e) => update('title', e.target.value)}
              placeholder="Article headline…"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Slug *</label>
            <input
              required value={form.slug} onChange={(e) => update('slug', e.target.value)}
              placeholder="article-slug-here"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.88rem] font-mono focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)}
              rows={2} placeholder="Brief summary…"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] resize-none focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Body Content</label>
            <textarea
              value={form.content} onChange={(e) => update('content', e.target.value)}
              rows={14} placeholder="Write the full article content here…"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] font-serif leading-7 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
            />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">Settings</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category */}
            <div>
              <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Category *</label>
              <select
                value={form.category} onChange={(e) => update('category', e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20 bg-white"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Status</label>
              <select
                value={form.status} onChange={(e) => update('status', e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Image URL</label>
              <input
                value={form.image_url} onChange={(e) => update('image_url', e.target.value)}
                placeholder="https://…"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.88rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
              />
            </div>

            {/* Image Alt */}
            <div>
              <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Image Alt Text</label>
              <input
                value={form.image_alt} onChange={(e) => update('image_alt', e.target.value)}
                placeholder="Describe the image…"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.88rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
              />
            </div>

            {form.status === 'scheduled' && (
              <div className="sm:col-span-2">
                <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Publish Date/Time</label>
                <input
                  type="datetime-local" value={form.published_at} onChange={(e) => update('published_at', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/articles" className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-[0.88rem] font-medium text-neutral-700 hover:bg-neutral-50">
            Cancel
          </Link>
          <button
            type="submit" disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#0a8f07] px-5 py-2.5 text-[0.88rem] font-semibold text-white hover:bg-[#067203] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Saving…' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  )
}
