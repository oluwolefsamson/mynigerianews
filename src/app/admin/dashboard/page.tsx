import { createClient } from '@/lib/supabase/server'
import {
  Newspaper, CheckCircle2, Clock3, Users, Rss,
  TrendingUp, Plus, RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all stats, recent articles, and import logs in parallel to minimize load time
  const [
    totalArticlesRes,
    publishedRes,
    draftsRes,
    importedRes,
    recentArticlesRes,
    importLogRes,
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('source', 'rss'),
    supabase
      .from('articles')
      .select('id, title, category, status, source_name, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('import_log')
      .select('*')
      .order('ran_at', { ascending: false })
      .limit(5),
  ])

  const stats = {
    totalArticles: totalArticlesRes.count ?? 0,
    published: publishedRes.count ?? 0,
    drafts: draftsRes.count ?? 0,
    imported: importedRes.count ?? 0,
  }

  const recentArticles = recentArticlesRes.data
  const importLog = importLogRes.data

  const statCards = [
    { label: 'Total Articles', value: stats.totalArticles, icon: Newspaper, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'Published', value: stats.published, icon: CheckCircle2, color: 'bg-[#0a8f07]', light: 'bg-green-50 text-green-700' },
    { label: 'Drafts', value: stats.drafts, icon: Clock3, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
    { label: 'Auto-Imported', value: stats.imported, icon: Rss, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="mt-0.5 text-[0.88rem] text-neutral-500">Welcome back. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/news-import"
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Import News
          </Link>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 rounded-lg bg-[#0a8f07] px-4 py-2 text-[0.85rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#067203]"
          >
            <Plus className="h-4 w-4" /> New Article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[0.82rem] font-medium text-neutral-500">{card.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.light}`}>
                <card.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-neutral-900">{card.value.toLocaleString()}</p>
            <div className="mt-2 flex items-center gap-1 text-[0.78rem] text-neutral-400">
              <TrendingUp className="h-3 w-3" /> Updated now
            </div>
          </div>
        ))}
      </div>

      {/* Recent articles + import log */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Recent articles */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-[0.95rem] font-semibold text-neutral-900">Recent Articles</h2>
            <Link href="/admin/articles" className="text-[0.8rem] font-medium text-[#0a8f07] hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentArticles && recentArticles.length > 0 ? recentArticles.map((article) => (
              <div key={article.id} className="flex items-center gap-4 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.88rem] font-medium text-neutral-900">{article.title}</p>
                  <p className="mt-0.5 text-[0.76rem] text-neutral-400">
                    {article.category} · {article.source_name ?? 'Manual'}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${
                  article.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : article.status === 'draft'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {article.status}
                </span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-[0.88rem] text-neutral-400">
                No articles yet. <Link href="/admin/articles/new" className="text-[#0a8f07] hover:underline">Create one</Link> or{' '}
                <Link href="/admin/news-import" className="text-[#0a8f07] hover:underline">import from RSS</Link>.
              </div>
            )}
          </div>
        </div>

        {/* Import log */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-[0.95rem] font-semibold text-neutral-900">Import Log</h2>
            <Link href="/admin/news-import" className="text-[0.8rem] font-medium text-[#0a8f07] hover:underline">
              Manage →
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {importLog && importLog.length > 0 ? importLog.map((log) => (
              <div key={log.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[0.84rem] font-medium text-neutral-800">{log.source_name}</p>
                  <span className={`text-[0.72rem] font-semibold ${log.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {log.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.76rem] text-neutral-400">
                  {log.articles_imported} imported · {new Date(log.ran_at).toLocaleString('en-NG')}
                </p>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-[0.84rem] text-neutral-400">
                No imports yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
