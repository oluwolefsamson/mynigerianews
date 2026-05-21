import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'

export const metadata = { title: 'Admin — MyNigeriaNews' }

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const currentPath = headersList.get('x-current-path') ?? ''

  // Login page: render without shell (no sidebar, no auth redirect needed)
  if (currentPath === '/admin/login' || currentPath === '') {
    return <>{children}</>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Middleware handles the redirect, but guard here for safety
  if (!user) return <>{children}</>

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-y-auto bg-[#f4f6f9] p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
