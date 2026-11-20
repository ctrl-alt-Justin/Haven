'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, KeyRound, Sparkles, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'invite'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteToken, setInviteToken] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Helpful message if user hasn't configured Supabase yet
        if (error.message.includes('FetchError') || error.message.includes('Failed to fetch')) {
          setErrorMsg(
            'Cannot reach Supabase. Please ensure your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local.'
          )
        } else {
          setErrorMsg(error.message)
        }
        setLoading(false)
        return
      }

      if (data.user) {
        router.push('/')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      const supabase = createClient()
      // Step 1: Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            invite_token: inviteToken,
          },
        },
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        setSuccessMsg(
          'Account created with your invitation! You may now sign in to your sanctuary.'
        )
        setMode('signin')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not accept invitation.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-cottage-lg border border-cottage-border bg-cottage-cream-light p-8 sm:p-10 shadow-lifted space-y-6">
        {/* Emblem & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-cottage-sage/40 border border-cottage-moss/40 flex items-center justify-center text-cottage-moss-deep shadow-xs">
            <Heart className="w-6 h-6 text-cottage-rose-dark fill-cottage-rose/40" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-cottage-bark">
            A Little Place for Us
          </h1>
          <p className="text-xs text-cottage-brown">
            Private sanctuary for two. Invitation only.
          </p>
        </div>

        {/* Tab switch: Sign In vs Redeem Invitation */}
        <div className="flex rounded-full bg-cottage-cream border border-cottage-border p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setErrorMsg(null)
            }}
            className={`flex-1 py-1.5 rounded-full font-medium transition ${
              mode === 'signin'
                ? 'bg-cottage-moss-deep text-cottage-cream-light shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('invite')
              setErrorMsg(null)
            }}
            className={`flex-1 py-1.5 rounded-full font-medium transition ${
              mode === 'invite'
                ? 'bg-cottage-moss-deep text-cottage-cream-light shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            Redeem Invitation
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-medium text-cottage-bark block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cottage-brown" />
                <input
                  type="email"
                  required
                  placeholder="you@sanctuary.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-cottage-bark block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cottage-brown" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light py-2.5 rounded-full text-xs font-semibold shadow-soft transition disabled:opacity-50"
            >
              {loading ? 'Entering...' : 'Enter Our Place'}
            </button>
          </form>
        ) : (
          /* Redeem Invitation Form */
          <form onSubmit={handleClaimInvite} className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-cottage-sage/30 border border-cottage-moss/30 text-[11px] text-cottage-brown leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cottage-moss-deep shrink-0 mt-0.5" />
              <span>
                Enter the secret invitation code shared by the cottage creator to set up your account.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-cottage-bark block">Invitation Token</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cottage-brown" />
                <input
                  type="text"
                  required
                  placeholder="e.g. cottage-key-..."
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-cottage-bark block">Your Email</label>
              <input
                type="email"
                required
                placeholder="partner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-cottage-border bg-cottage-cream px-3 py-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-cottage-bark block">Choose Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-cottage-border bg-cottage-cream px-3 py-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light py-2.5 rounded-full text-xs font-semibold shadow-soft transition disabled:opacity-50"
            >
              {loading ? 'Redeeming...' : 'Claim Invitation & Enter'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-cottage-brown">
          <span>Protected by Supabase Authentication & RLS</span>
        </div>
      </div>
    </div>
  )
}
