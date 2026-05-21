'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Radio, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a1628] px-4">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0a8f07] to-[#067203] px-8 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
              <Radio className="h-7 w-7 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">MyNigeriaNews</h1>
            <p className="mt-1 text-[0.88rem] text-white/70">Super Admin Dashboard</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-[1.1rem] font-semibold text-neutral-900">Sign in to continue</h2>
            <p className="mt-1 text-[0.85rem] text-neutral-500">Enter your admin credentials below.</p>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-[0.82rem] font-medium text-neutral-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@nigerianews.com"
                  className="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[0.82rem] font-medium text-neutral-700">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 pr-11 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a8f07] px-4 py-3 text-[0.92rem] font-semibold text-white transition-all hover:bg-[#067203] disabled:opacity-60 mt-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.78rem] text-white/30">
          © {new Date().getFullYear()} MyNigeriaNews · Admin Access Only
        </p>
      </div>
    </div>
  )
}
