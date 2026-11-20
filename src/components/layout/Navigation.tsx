'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Home,
  BookOpen,
  Music,
  Camera,
  Flower2,
  Lock,
  Settings,
  LogOut,
  LogIn,
  Heart,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_ITEMS = [
  { href: '/', label: 'The Cottage', icon: Home, exact: true },
  { href: '/library', label: 'The Library', icon: BookOpen },
  { href: '/music', label: 'The Music Room', icon: Music },
  { href: '/scrapbook', label: 'The Scrapbook', icon: Camera },
  { href: '/garden', label: 'The Garden', icon: Flower2 },
  { href: '/hideaway', label: 'The Hideaway', icon: Lock },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Do not show full nav on login page
  if (pathname === '/login') {
    return (
      <header className="border-b border-cottage-border/50 bg-cottage-cream/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2 text-cottage-bark font-serif text-xl font-semibold tracking-wide">
            <span className="p-1.5 rounded-full bg-cottage-sage/40 text-cottage-moss-deep">
              <Heart className="w-4 h-4 fill-cottage-rose-dark/30 text-cottage-rose-dark" />
            </span>
            <span>A Little Place for Us</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-cottage-brown bg-cottage-sage-light/60 px-3 py-1.5 rounded-full border border-cottage-moss/30">
            <Sparkles className="w-3.5 h-3.5 text-cottage-moss-deep" />
            <span>Invitation Only</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-cottage-cream/90 backdrop-blur-md border-b border-cottage-border/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-cottage-bark group transition"
            >
              <div className="w-9 h-9 rounded-full bg-cottage-sage/50 border border-cottage-moss/40 flex items-center justify-center text-cottage-moss-deep group-hover:bg-cottage-sage transition">
                <Heart className="w-4 h-4 text-cottage-moss-deep fill-cottage-rose/50 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold tracking-wide leading-tight text-cottage-bark">
                  A Little Place for Us
                </span>
                <span className="text-[11px] text-cottage-brown font-sans tracking-wider">
                  our quiet sanctuary ♡
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cottage-sage text-cottage-brown-dark shadow-sm font-semibold'
                        : 'text-cottage-brown hover:text-cottage-bark hover:bg-cottage-cream-dark/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cottage-moss-deep' : 'text-cottage-brown'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Profile / Status */}
            <div className="flex items-center gap-2">
              {!loading && user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-medium text-cottage-bark truncate max-w-[140px]">
                      {user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-cottage-brown">Sanctuary Member</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    aria-label="Sign Out"
                    className="p-2 rounded-full hover:bg-cottage-rose/40 text-cottage-brown hover:text-cottage-rose-dark transition border border-cottage-border/50"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : !loading ? (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-medium bg-cottage-sage/70 hover:bg-cottage-sage px-3 py-1.5 rounded-full border border-cottage-moss/40 text-cottage-bark transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Enter</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar Overflow Nav for quick access */}
      <div className="lg:hidden bg-cottage-cream-light/80 border-b border-cottage-border/40 overflow-x-auto py-2 px-3 no-scrollbar flex items-center gap-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-cottage-sage text-cottage-bark font-semibold shadow-xs'
                  : 'text-cottage-brown hover:bg-cottage-cream-dark/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Mobile Bottom Navigation Bar (thumb-friendly for Android & iOS) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cottage-cream/95 backdrop-blur-lg border-t border-cottage-border/70 py-1.5 px-2 shadow-lifted"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  isActive
                    ? 'text-cottage-moss-deep font-semibold'
                    : 'text-cottage-brown/80 hover:text-cottage-bark'
                }`}
              >
                <div
                  className={`p-1 rounded-lg ${
                    isActive ? 'bg-cottage-sage text-cottage-moss-deep' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
                  {item.label.replace('The ', '')}
                </span>
              </Link>
            )
          })}
          {/* Hideaway */}
          <Link
            href="/hideaway"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              pathname.startsWith('/hideaway')
                ? 'text-cottage-moss-deep font-semibold'
                : 'text-cottage-brown/80 hover:text-cottage-bark'
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                pathname.startsWith('/hideaway')
                  ? 'bg-cottage-sage text-cottage-moss-deep'
                  : ''
              }`}
            >
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Hideaway</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
