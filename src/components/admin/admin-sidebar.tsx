'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Newspaper, Tag, Users,
  Rss, Settings, ChevronRight, Radio,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/articles',    label: 'Articles',     icon: Newspaper },
  { href: '/admin/categories',  label: 'Categories',   icon: Tag },
  { href: '/admin/news-import', label: 'News Import',  icon: Rss },
  { href: '/admin/users',       label: 'Users',        icon: Users },
  { href: '/admin/settings',    label: 'CMS Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-[#0a1628] lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#0a8f07]">
          <Radio className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[0.82rem] font-bold text-white leading-4">MyNigeriaNews</p>
          <p className="text-[0.65rem] text-white/40 uppercase tracking-widest">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/30">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'group flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-[0.87rem] font-medium transition-all duration-150',
                    active
                      ? 'bg-[#0a8f07] text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-[6px] px-3 py-2 text-[0.78rem] text-white/40 transition-colors hover:text-white/70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#0a8f07]" />
          View Live Site
        </Link>
      </div>
    </aside>
  )
}
