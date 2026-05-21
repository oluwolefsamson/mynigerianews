'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MediaUploader } from '@/components/admin/media-uploader'

const CATEGORIES = ['Politics','Business','Sports','Technology','Health','Entertainment','Education','World','Africa','Nigeria']

type Article = {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  image_url: string
  image_alt: string
  video_url?: string | null
  status: string
  published_at: string | null
}

export default function EditArticleClient({ article }: { article: Article }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: article.title,
    slug: article.slug,
    category: article.category,
    excerpt: article.excerpt ?? '',
    content: article.content ?? '',
    image_url: article.image_url ?? '',
    image_alt: article.image_alt ?? '',
    video_url: article.video_url ?? '',
    status: article.status as 'draft' | 'published' | 'scheduled',
    published_at: article.published_at ? article.published_at.slice(0, 16) : '',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('articles')
      .update({
        ...form,
        published_at: form.status === 'published' ? (form.published_at || new Date().toISOString()) : null,
      })
      .eq('id', article.id)

    if (dbError) { setError(dbError.message); setLoading(false); return }
    router.push('/admin/articles')
  }

  async function handleDelete() {
    if (!confirm('Permanently delete this article?')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('articles').delete().eq('id', article.id)
    router.push('/admin/articles')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Edit Article</h1>
            <p className="text-[0.82rem] text-neutral-500 truncate max-w-sm">{article.title}</p>
          </div>
        </div>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-[0.82rem] text-red-500 hover:bg-red-50 disabled:opacity-50">
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">{error}</div>}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm space-y-5">
          <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">Content</h2>
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Title *</label>
            <input required value={form.title} onChange={(e) => update('title', e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20" />
          </div>
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Slug</label>
            <input value={form.slug} onChange={(e) => update('slug', e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.88rem] font-mono focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20" />
          </div>
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Excerpt</label>
            <textarea value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)}
              rows={2} className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] resize-none focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20" />
          </div>
          <div>
            <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Body Content</label>
            <textarea value={form.content} onChange={(e) => update('content', e.target.value)}
              rows={14} className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] font-serif leading-7 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20" />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm space-y-5">
          <h2 className="text-[0.9rem] font-semibold text-neutral-700 border-b border-neutral-100 pb-3">Settings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none bg-white">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none bg-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            {/* Image Upload */}
            <div className="sm:col-span-2 border-t border-neutral-100 pt-4">
              <MediaUploader
                label="Article Image *"
                accept="image/*"
                value={form.image_url}
                onChange={(url) => update('image_url', url)}
                placeholder="Upload or drag article image here"
              />
            </div>

            {/* Image Alt */}
            <div className="sm:col-span-2">
              <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Image Alt Text (SEO & Accessibility)</label>
              <input
                value={form.image_alt} onChange={(e) => update('image_alt', e.target.value)}
                placeholder="Describe the image…"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.88rem] focus:border-[#0a8f07] focus:outline-none"
              />
            </div>

            {/* Video Upload */}
            <div className="sm:col-span-2 border-t border-neutral-100 pt-4">
              <MediaUploader
                label="Article Video (Optional)"
                accept="video/*"
                value={form.video_url}
                onChange={(url) => update('video_url', url)}
                placeholder="Upload or drag article video here"
              />
            </div>
            {form.status === 'scheduled' && (
              <div className="sm:col-span-2">
                <label className="block text-[0.82rem] font-medium text-neutral-700 mb-1.5">Publish Date/Time</label>
                <input type="datetime-local" value={form.published_at} onChange={(e) => update('published_at', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[0.92rem] focus:border-[#0a8f07] focus:outline-none" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/articles" className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-[0.88rem] font-medium text-neutral-700 hover:bg-neutral-50">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#0a8f07] px-5 py-2.5 text-[0.88rem] font-semibold text-white hover:bg-[#067203] disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Saving…' : 'Update Article'}
          </button>
        </div>
      </form>
    </div>
  )
}
