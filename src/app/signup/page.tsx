'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Radio, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Delay redirect to let user read the success state
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 2500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070e17] px-4 py-12">
      {/* Dynamic Background pattern */}
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
          {/* Top Header */}
          <div className="bg-gradient-to-br from-[#0a8f07] to-[#067203] px-8 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <h1 className="mt-3 text-xl font-bold text-white">Create Your Account</h1>
            <p className="mt-1 text-[0.82rem] text-white/70">Join MyNigeriaNews to unlock premium features</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-[0.85rem] text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-[0.85rem] text-green-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Account created successfully! Redirecting you to your dashboard...</span>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-[0.82rem] font-medium text-neutral-300">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aliko Ibrahim"
                    className="mt-1.5 block w-full rounded-lg border border-white/10 bg-[#070e17] px-4 py-2.5 text-[0.92rem] text-white placeholder:text-neutral-500 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
                  />
                </div>

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

                <div>
                  <label htmlFor="confirmPassword" className="block text-[0.82rem] font-medium text-neutral-300">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 block w-full rounded-lg border border-white/10 bg-[#070e17] px-4 py-2.5 text-[0.92rem] text-white placeholder:text-neutral-500 focus:border-[#0a8f07] focus:outline-none focus:ring-2 focus:ring-[#0a8f07]/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a8f07] px-4 py-3 text-[0.92rem] font-semibold text-white transition-all hover:bg-[#067203] disabled:opacity-60 mt-4 select-none"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="mt-6 border-t border-white/10 pt-4 text-center">
              <p className="text-[0.82rem] text-neutral-400">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[#0a8f07] hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
