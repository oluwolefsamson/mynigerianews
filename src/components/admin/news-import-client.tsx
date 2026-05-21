'use client'

import { useState } from 'react'
import { Loader2, RefreshCw, ToggleLeft, ToggleRight, CheckCircle2, XCircle, Clock } from 'lucide-react'

type RssSource = {
  id: string
  name: string
  url: string
  category: string
  enabled: boolean
  last_fetched_at: string | null
}

type ImportLog = {
  id: string
  source_name: string
  articles_imported: number
  articles_skipped: number
  status: string
  ran_at: string
}

type ImportResult = {
  source: string
  imported: number
  skipped: number
  status: string
}

export default function NewsImportClient({
  sources: initialSources,
  logs: initialLogs,
}: {
  sources: RssSource[]
  logs: ImportLog[]
}) {
  const [sources, setSources] = useState(initialSources)
  const [logs, setLogs] = useState(initialLogs)
  const [importing, setImporting] = useState<string | 'all' | null>(null)
  const [results, setResults] = useState<ImportResult[] | null>(null)

  async function runImport(sourceId?: string) {
    setImporting(sourceId ?? 'all')
    setResults(null)

    const res = await fetch('/api/news-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sourceId ? { sourceId } : {}),
    })

    const data = await res.json()
    setResults(data.results ?? [])
    setImporting(null)

    // Refresh page data
    window.location.reload()
  }

  async function toggleSource(id: string, enabled: boolean) {
    await fetch(`/api/admin/rss-sources?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !enabled }),
    })
    setSources((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !enabled } : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">News Import</h1>
          <p className="mt-0.5 text-[0.88rem] text-neutral-500">Auto-import news from free RSS feeds</p>
        </div>
        <button
          onClick={() => runImport()}
          disabled={importing === 'all'}
          className="flex items-center gap-2 rounded-lg bg-[#0a8f07] px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-[#067203] disabled:opacity-60"
        >
          {importing === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Import All Sources
        </button>
      </div>

      {/* Results banner */}
      {results && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-[0.88rem] font-semibold text-green-800 mb-2">Import Complete</p>
          <div className="space-y-1">
            {results.map((r) => (
              <p key={r.source} className="text-[0.82rem] text-green-700">
                <strong>{r.source}</strong>: {r.imported} imported, {r.skipped} skipped
                {r.status === 'error' && ' ⚠️ error'}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* RSS Sources */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-[0.95rem] font-semibold text-neutral-900">RSS Sources</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-neutral-900">{source.name}</p>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.7rem] text-neutral-500">{source.category}</span>
                </div>
                <p className="mt-0.5 truncate text-[0.78rem] text-neutral-400">{source.url}</p>
                {source.last_fetched_at && (
                  <p className="mt-0.5 flex items-center gap-1 text-[0.74rem] text-neutral-400">
                    <Clock className="h-3 w-3" />
                    Last: {new Date(source.last_fetched_at).toLocaleString('en-NG')}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSource(source.id, source.enabled)}
                  className={`flex items-center gap-1.5 text-[0.8rem] font-medium transition-colors ${source.enabled ? 'text-[#0a8f07]' : 'text-neutral-400'}`}
                  aria-label={source.enabled ? 'Disable' : 'Enable'}
                >
                  {source.enabled
                    ? <ToggleRight className="h-5 w-5" />
                    : <ToggleLeft className="h-5 w-5" />}
                  <span className="hidden sm:inline">{source.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => runImport(source.id)}
                  disabled={!!importing}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[0.8rem] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                >
                  {importing === source.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <RefreshCw className="h-3.5 w-3.5" />}
                  Import
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Import Log */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-[0.95rem] font-semibold text-neutral-900">Import History</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500">Source</th>
              <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500">Imported</th>
              <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500">Skipped</th>
              <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500">Status</th>
              <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-800">{log.source_name}</td>
                <td className="px-4 py-3 text-[#0a8f07] font-semibold">{log.articles_imported}</td>
                <td className="px-4 py-3 text-neutral-400">{log.articles_skipped}</td>
                <td className="px-4 py-3">
                  {log.status === 'success'
                    ? <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Success</span>
                    : <span className="flex items-center gap-1 text-red-500"><XCircle className="h-3.5 w-3.5" /> Error</span>}
                </td>
                <td className="px-4 py-3 text-neutral-400 text-[0.8rem]">
                  {new Date(log.ran_at).toLocaleString('en-NG')}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-neutral-400">No imports yet. Click "Import All Sources" to start.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
