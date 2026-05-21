import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('label')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="mt-0.5 text-[0.88rem] text-neutral-500">{categories?.length ?? 0} categories</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories?.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ backgroundColor: cat.color ?? '#0a8f07' }}
            >
              {cat.label.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-neutral-900">{cat.label}</p>
              <p className="text-[0.76rem] text-neutral-400">/{cat.slug}</p>
              <p className="mt-1 text-[0.82rem] text-neutral-500 line-clamp-2">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5 text-[0.84rem] text-neutral-500">
        Categories are pre-seeded. To add or modify categories, run the SQL migration in your Supabase dashboard or update the
        <code className="mx-1 rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-[0.78rem]">categories</code>
        table directly.
      </div>
    </div>
  )
}
