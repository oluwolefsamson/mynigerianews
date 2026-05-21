'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Radio, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
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

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070e17] px-4 py-12">
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-[#0a8f07]/10 blur-[80px]" />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-[#0a8f07]/10 blur-[80px]" />

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1926] shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0a8f07] to-[#067203] px-8 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <h1 className="mt-3 text-xl font-bold text-white">Sign In</h1>
            <p className="mt-1 text-[0.82rem] text-white/70">Welcome back to MyNigeriaNews</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-[0.85rem] text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[0.82rem] font-medium text-neutral-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1.5 block w-full rounded-lg border border-white/10 bg-[#070e17] px-4 py-2.5 text-[0.92rem] text-white placeholder:text-neutral-500 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[0.82rem] font-medium text-neutral-300">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-white/10 bg-[#070e17] px-4 py-2.5 pr-11 text-[0.92rem] text-white placeholder:text-neutral-500 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a8f07] px-4 py-3 text-[0.92rem] font-semibold text-white transition-all hover:bg-[#067203] disabled:opacity-60 mt-4 select-none"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4 text-center">
              <p className="text-[0.82rem] text-neutral-400">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-[#0a8f07] hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
