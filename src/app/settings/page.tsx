'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Shield,
  KeyRound,
  CheckCircle,
  Sparkles,
  BookOpen,
  Volume2,
} from 'lucide-react'

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Sanctuary Member')
  const [favoriteQuote, setFavoriteQuote] = useState('A little place for us ♡')
  const [inviteEmail, setInviteEmail] = useState('')
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return
    // Simulated token generation for 2nd partner account
    const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    setGeneratedInvite(`${window.location.origin}/login?invite=${token}`)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-cottage-border/70 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cottage-cream-dark/50 text-cottage-brown-dark text-xs font-medium mb-2 border border-cottage-border">
          <Settings className="w-3.5 h-3.5" />
          <span>Sanctuary Preferences</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-cottage-bark">
          Settings & Sanctuary Management
        </h1>
        <p className="text-sm text-cottage-brown mt-1">
          Manage your personal profile, reading preferences, and partner invitations.
        </p>
      </div>

      {/* Profile Settings */}
      <form onSubmit={handleSaveProfile} className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-cottage-border/50 pb-3">
          <User className="w-5 h-5 text-cottage-moss-deep" />
          <h2 className="font-serif text-xl font-medium text-cottage-bark">Personal Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-medium text-cottage-bark block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2.5 text-xs text-cottage-bark focus:outline-none focus:border-cottage-moss-deep"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-cottage-bark block">Favorite Sanctuary Quote</label>
            <input
              type="text"
              value={favoriteQuote}
              onChange={(e) => setFavoriteQuote(e.target.value)}
              className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2.5 text-xs text-cottage-bark focus:outline-none focus:border-cottage-moss-deep"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-cottage-moss-deep font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Preferences saved!</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-5 py-2 rounded-full text-xs font-medium shadow-xs transition"
          >
            Save Profile
          </button>
        </div>
      </form>

      {/* Reading & Cozy Theme Preferences */}
      <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-cottage-border/50 pb-3">
          <BookOpen className="w-5 h-5 text-cottage-moss-deep" />
          <h2 className="font-serif text-xl font-medium text-cottage-bark">Reading Experience</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-cottage-bark block">Default Reader Font</label>
            <select className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2 text-xs">
              <option>Cormorant Garamond (Serif)</option>
              <option>Lora (Serif)</option>
              <option>Plus Jakarta Sans (Clean)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-cottage-bark block">Reading Theme</label>
            <select className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2 text-xs">
              <option>Warm Cream Paper (Default)</option>
              <option>Soft Sage Mist</option>
              <option>Gentle Night Sepia</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-cottage-bark block">Ambient Rain Sound</label>
            <div className="flex items-center gap-2 pt-1 text-cottage-brown">
              <Volume2 className="w-4 h-4 text-cottage-moss-deep" />
              <span>Calm Gentle Rain (40%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invitation-Only Member Management */}
      <div className="rounded-cottage border border-cottage-moss/40 bg-cottage-sage/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 border-b border-cottage-moss/30 pb-3">
          <KeyRound className="w-5 h-5 text-cottage-moss-deep" />
          <h2 className="font-serif text-xl font-medium text-cottage-bark">
            Sanctuary Invitation Generator
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-cottage-brown leading-relaxed">
          This website has no public registration. Only the 2 approved partners can access it.
          Use this form to generate a single-use invitation link for your partner.
        </p>

        <form onSubmit={handleGenerateInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="partner@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 rounded-full border border-cottage-border bg-cottage-cream-light px-4 py-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
          />
          <button
            type="submit"
            className="bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-5 py-2 rounded-full text-xs font-medium shadow-xs transition"
          >
            Generate Partner Invite Link
          </button>
        </form>

        {generatedInvite && (
          <div className="p-4 rounded-xl bg-cottage-cream-light border border-cottage-moss/50 space-y-2">
            <span className="text-[11px] font-semibold text-cottage-moss-deep block">
              Single-Use Invitation Link Created:
            </span>
            <div className="p-2 rounded bg-cottage-cream font-mono text-xs text-cottage-bark break-all select-all border border-cottage-border">
              {generatedInvite}
            </div>
            <p className="text-[10px] text-cottage-brown">
              Send this link to your partner. When they open it, their account will be approved.
            </p>
          </div>
        )}
      </div>

      {/* Privacy Guarantee Statement */}
      <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 flex items-start gap-3.5 text-xs text-cottage-brown">
        <Shield className="w-5 h-5 text-cottage-moss-deep shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-semibold text-cottage-bark">Our Privacy Standard</h3>
          <p className="leading-relaxed">
            No last-seen tracking. No online indicator. No read receipts. No duration monitoring.
            Your digital sanctuary is a quiet refuge, designed to protect your peace.
          </p>
        </div>
      </div>
    </div>
  )
}
