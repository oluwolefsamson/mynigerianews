import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Globe, Rss } from 'lucide-react'

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; q?: string }>
}) {
  const { status, category, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('articles')
    .select('id, title, category, status, source, source_name, published_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data: articles } = await query

  const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-amber-100 text-amber-700',
    scheduled: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Articles</h1>
          <p className="mt-0.5 text-[0.88rem] text-neutral-500">{articles?.length ?? 0} articles found</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-[#0a8f07] px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-[#067203]"
        >
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['', 'published', 'draft', 'scheduled'].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/articles?status=${s}` : '/admin/articles'}
            className={`rounded-full px-3 py-1 text-[0.8rem] font-medium transition-colors ${
              status === s || (!status && !s)
                ? 'bg-[#0a8f07] text-white'
                : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </Link>
        ))}
        <form className="ml-auto">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search articles…"
            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[0.85rem] text-neutral-900 placeholder:text-neutral-400 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20 w-56"
          />
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
              <th className="px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-wider text-neutral-500">Title</th>
              <th className="px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-wider text-neutral-500 hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">Source</th>
              <th className="px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
              <th className="px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-wider text-neutral-500 hidden xl:table-cell">Date</th>
              <th className="px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {articles && articles.length > 0 ? articles.map((a) => (
              <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-5 py-3.5 max-w-[280px]">
                  <p className="truncate font-medium text-neutral-900">{a.title}</p>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <span className="text-[0.82rem] text-neutral-600">{a.category}</span>
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <span className="flex items-center gap-1.5 text-[0.8rem] text-neutral-500">
                    {a.source === 'rss' ? <Rss className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                    {a.source_name ?? 'Manual'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${statusColors[a.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 hidden xl:table-cell text-[0.8rem] text-neutral-400">
                  {new Date(a.created_at).toLocaleDateString('en-NG')}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteArticleButton id={a.id} />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[0.88rem] text-neutral-400">
                  No articles found.{' '}
                  <Link href="/admin/articles/new" className="text-[#0a8f07] hover:underline">Create one</Link>
                  {' '}or{' '}
                  <Link href="/admin/news-import" className="text-[#0a8f07] hover:underline">import from RSS</Link>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DeleteArticleButton({ id }: { id: string }) {
  return (
    <form action={`/api/admin/articles?id=${id}`} method="POST">
      <input type="hidden" name="_method" value="DELETE" />
      <button
        type="submit"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50"
        aria-label="Delete"
        onClick={(e) => {
          if (!confirm('Delete this article?')) e.preventDefault()
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  )
}
