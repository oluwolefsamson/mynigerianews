'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { LogOut, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AdminTopbar({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const initials = (user.email ?? 'A').slice(0, 2).toUpperCase()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="text-[0.82rem] text-neutral-400">Admin Panel</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#0a8f07]" />
        </button>

        <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 pl-3 pr-1 py-1">
          <span className="text-[0.8rem] text-neutral-600 hidden sm:block max-w-[160px] truncate">
            {user.email}
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a8f07] text-[0.72rem] font-bold text-white">
            {initials}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
