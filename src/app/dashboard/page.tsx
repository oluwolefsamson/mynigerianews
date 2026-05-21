'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Calendar, Shield, Sparkles, LogOut, CheckCircle2, 
  CreditCard, Loader2, Award, Zap, AlertCircle, PlaySquare 
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UserProfile = {
  id: string
  email: string
  full_name: string
  subscription_status: string
  subscription_ends_at: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'plan' | 'paystack' | 'processing'>('plan')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          router.push('/login')
          return
        }

        // Fetch profile
        let { data, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // Resilient Fallback: If profile row is missing, insert it on the fly
        if (profileError || !data) {
          const defaultName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email!,
              full_name: defaultName,
              subscription_status: 'free',
            })
            .select()
            .single()

          if (!insertError && newProfile) {
            data = newProfile
          } else {
            throw new Error(insertError?.message || 'Could not fetch or create user profile')
          }
        }

        setProfile(data as UserProfile)
      } catch (err: unknown) {
        console.error(err)
        setError('Failed to load profile. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function handlePaystackCheckout(e: React.FormEvent) {
    e.preventDefault()
    setPaymentStep('processing')

    // Simulate Paystack validation/processing delay
    setTimeout(async () => {
      try {
        const res = await fetch('/api/user/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'premium' }),
        })

        if (!res.ok) {
          throw new Error('Subscription endpoint failed')
        }

        const data = await res.json()
        if (data.success) {
          setPaymentSuccess(true)
          setProfile((prev) => 
            prev ? { ...prev, subscription_status: 'premium', subscription_ends_at: data.endsAt } : null
          )
          
          setTimeout(() => {
            setIsPaying(false)
            setPaymentSuccess(false)
            setPaymentStep('plan')
          }, 2500)
        } else {
          setError('Payment succeeded but profile update failed.')
          setPaymentStep('plan')
        }
      } catch (err: unknown) {
        console.error(err)
        setError('Transaction failed. Please try again.')
        setPaymentStep('plan')
      }
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#0a8f07]" />
        <p className="text-sm font-medium text-neutral-500">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Upper Grid Welcome */}
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        
        {/* Main Panel */}
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-[#0a8f07] to-[#067203] px-6 py-8 text-white sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white shadow-inner">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome, {profile?.full_name}!</h1>
                    <p className="text-sm text-white/80">Manage your newsletter settings, read history, and subscriber profile.</p>
                  </div>
                </div>
                {profile?.subscription_status === 'premium' && (
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm sm:self-center">
                    <Award className="h-4 w-4" /> Premium Active
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-4 border-t border-neutral-100 p-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
                <User className="h-5 w-5 text-neutral-400" />
                <div className="min-w-0">
                  <span className="block text-[0.76rem] font-semibold uppercase tracking-wider text-neutral-400">Account Owner</span>
                  <span className="block truncate text-sm font-semibold text-neutral-800">{profile?.full_name}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
                <Mail className="h-5 w-5 text-neutral-400" />
                <div className="min-w-0">
                  <span className="block text-[0.76rem] font-semibold uppercase tracking-wider text-neutral-400">Email Address</span>
                  <span className="block truncate text-sm font-semibold text-neutral-800">{profile?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
                <Calendar className="h-5 w-5 text-neutral-400" />
                <div className="min-w-0">
                  <span className="block text-[0.76rem] font-semibold uppercase tracking-wider text-neutral-400">Member Since</span>
                  <span className="block text-sm font-semibold text-neutral-800">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short' }) : 'May 2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription details card */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold text-neutral-900">Your Subscription Plan</h2>
            <p className="mt-1 text-sm text-neutral-500">Upgrade or check details about your active reading plans.</p>

            {profile?.subscription_status === 'premium' ? (
              // PREMIUM VIEW
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-md">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-green-950">Premium Editorial Subscriber</h3>
                    <p className="mt-1 text-sm text-green-800">
                      You have full unlocked access to all premium sections, direct live sports TV channels, audio versions, and ad-free browsing.
                    </p>
                    {profile.subscription_ends_at && (
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        Active until: {new Date(profile.subscription_ends_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // FREE VIEW WITH UPGRADE SECTION
              <div className="mt-6">
                <div className="rounded-2xl border border-[#0a8f07]/20 bg-[#0a8f07]/5 p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#0a8f07]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0a8f07]">
                        <Sparkles className="h-3.5 w-3.5" /> Unlock Premium
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900">Go Premium for ₦2,500 / month</h3>
                      <p className="text-sm text-neutral-600 max-w-xl">
                        Gain complete ad-free reading experience, dedicated weekly investigative editorial newsletters, live sports TV streaming, and early access to breaking news logs.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsPaying(true)}
                      className="inline-flex select-none items-center justify-center gap-2 rounded-lg bg-[#0a8f07] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#067203] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Zap className="h-4.5 w-4.5 fill-white" /> Upgrade Now
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    { title: 'Ad-Free Reading', desc: 'No banner notifications or distracting ad content.' },
                    { title: 'Live Sports TV Streams', desc: 'Unlock access to international football matches and local TV feeds.' },
                    { title: 'Exclusive Editorials', desc: 'Deep-dive investigative articles sent straight to your inbox.' },
                    { title: 'Audio Article Narrator', desc: 'Listen to news reports read aloud by realistic AI narrators.' }
                  ].map((benefit) => (
                    <div key={benefit.title} className="flex gap-3 rounded-lg border border-neutral-100 p-4">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0a8f07]" />
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900">{benefit.title}</h4>
                        <p className="mt-1 text-xs text-neutral-500 leading-5">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-neutral-900">Member Center</h3>
            <div className="mt-4 space-y-2">
              <button
                onClick={handleLogout}
                className="flex w-full select-none items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-5 text-white shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
              <PlaySquare className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-white">Live Sports TV</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-5">
              Premium members get 24/7 access to live TV streams, football coverage, and video editorial archives.
            </p>
          </div>
        </div>
      </div>

      {/* Paystack Payment Modal Simulator */}
      <AnimatePresence>
        {isPaying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1926] shadow-2xl text-white"
            >
              {/* Header block resembling Paystack portal checkout */}
              <div className="bg-[#1fc6a7] px-6 py-6 text-[#0f1926]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0f1926]/75">PAYSTACK SANDBOX</span>
                    <h3 className="text-xl font-bold tracking-tight mt-1">MyNigeriaNews</h3>
                  </div>
                  <button 
                    onClick={() => { setIsPaying(false); setPaymentStep('plan'); }}
                    className="rounded-full bg-white/20 p-1.5 hover:bg-white/35 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-[#0f1926]/10 pt-4">
                  <span className="text-xs font-semibold text-[#0f1926]/80">{profile?.email}</span>
                  <span className="text-lg font-bold">₦2,500.00</span>
                </div>
              </div>

              {/* Payment Box Content */}
              <div className="p-6">
                {paymentSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-16 w-16 text-[#1fc6a7] animate-pulse" />
                    <h4 className="text-lg font-bold mt-4 text-[#1fc6a7]">Payment Successful</h4>
                    <p className="text-sm text-neutral-300 mt-2">Your Premium Access has been activated instantly!</p>
                  </div>
                ) : paymentStep === 'processing' ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#1fc6a7]" />
                    <h4 className="text-md font-bold mt-4">Authorizing Transaction</h4>
                    <p className="text-xs text-neutral-400 mt-2">Contacting Paystack gateway and securing your connection...</p>
                  </div>
                ) : (
                  <form onSubmit={handlePaystackCheckout} className="space-y-4">
                    <div className="flex items-center gap-2 rounded-lg bg-neutral-800/40 p-3 text-xs text-neutral-300 border border-neutral-700/50">
                      <CreditCard className="h-4 w-4 shrink-0 text-[#1fc6a7]" />
                      <span>Demo Mode: Use any details to simulate a successful payment.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Card Number</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="4012 3456 7890 1234"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm placeholder:text-neutral-600 focus:border-[#1fc6a7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Expiry Date</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                          className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm placeholder:text-neutral-600 focus:border-[#1fc6a7] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">CVV</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm placeholder:text-neutral-600 focus:border-[#1fc6a7] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#1fc6a7] py-3 text-sm font-bold text-[#0f1926] transition-transform hover:opacity-90 active:scale-[0.98] mt-2 select-none"
                    >
                      Pay ₦2,500.00
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
