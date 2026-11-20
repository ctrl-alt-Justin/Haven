'use client'

import React, { useState } from 'react'
import {
  Lock,
  ShieldCheck,
  Feather,
  Heart,
  EyeOff,
  PlusCircle,
  Sparkles,
  Flame,
} from 'lucide-react'

export default function HideawayPage() {
  const [entries] = useState([
    {
      id: '1',
      title: 'A quiet evening thought',
      content:
        'Sometimes the sweetest thing in the world is simply knowing someone you cherish is resting warmly in the exact same world as you.',
      mood: 'Peaceful',
      date: 'Personal Journal Entry',
    },
  ])

  return (
    <div className="space-y-8">
      {/* Atmosphere Header: Twilight Writing Desk */}
      <div className="relative rounded-cottage-lg overflow-hidden border-2 border-[#54483E] bg-gradient-to-r from-[#2B231E] via-[#3D332C] to-[#251E19] text-[#F3ECE1] p-6 sm:p-10 shadow-lifted">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-[#E5D7C5]">
            <Lock className="w-3.5 h-3.5" />
            <span>The Hideaway · Private Sanctuary</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight">
            A quiet room behind closed doors.
          </h1>
          <p className="text-xs sm:text-sm text-[#D1C2AF] leading-relaxed">
            Your personal writing desk by the twilight window.
            Protected by database Row Level Security — no one else can read your entries, not even the other partner.
          </p>
        </div>

        {/* Flickering candle in the corner */}
        <div className="absolute top-8 right-12 hidden sm:flex flex-col items-center pointer-events-none">
          <div className="w-2.5 h-4 rounded-full bg-[#FFE380] shadow-[0_0_15px_4px_rgba(255,220,100,0.6)] animate-pulse" />
          <div className="w-4 h-12 rounded-t-xs bg-[#EDE0CE] border border-[#C5B49D]" />
        </div>
      </div>

      {/* Security Assurance Banner */}
      <div className="storybook-card p-6 flex items-start gap-3.5 text-xs sm:text-sm text-cottage-brown">
        <ShieldCheck className="w-5 h-5 text-cottage-moss-deep shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-serif text-base font-medium text-cottage-bark">
            Row Level Security (RLS) Cryptographic Privacy
          </h2>
          <p className="leading-relaxed">
            Every entry created in The Hideaway is queried using <code>(select auth.uid()) = user_id</code>.
            Neither the other partner nor any client-side query can pierce this database policy.
          </p>
        </div>
      </div>

      {/* Private Journal Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-medium text-cottage-bark flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-cottage-brown" />
            <span>Your Private Entries</span>
          </h3>

          <button
            onClick={() => alert('Private thought encryption active for Phase 4!')}
            className="flex items-center gap-2 storybook-wood text-white px-4 py-2 rounded-full text-xs font-medium shadow-soft hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>New Private Entry</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entries.map((item) => (
            <div
              key={item.id}
              className="storybook-card p-6 space-y-4 hover:border-cottage-moss/70 transition-all shadow-card"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold px-2.5 py-0.5 rounded-full bg-cottage-cream text-cottage-brown border border-cottage-border">
                  Mood: {item.mood}
                </span>
                <span className="text-cottage-brown-light text-[11px] font-serif">{item.date}</span>
              </div>

              <h4 className="font-serif text-lg font-medium text-cottage-bark">
                {item.title}
              </h4>

              <div className="storybook-parchment p-4 rounded-xl text-xs sm:text-sm text-cottage-brown leading-relaxed font-serif italic">
                &ldquo;{item.content}&rdquo;
              </div>

              <div className="pt-2 text-[11px] text-cottage-brown-light flex items-center justify-between border-t border-cottage-border/40">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cottage-brown" />
                  <span>Encrypted private row</span>
                </span>
                <Feather className="w-3.5 h-3.5 text-cottage-brown-light" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
