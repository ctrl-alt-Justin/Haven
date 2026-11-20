'use client'

import { useState } from 'react'
import { Lock, ShieldCheck, Feather, Heart, EyeOff, PlusCircle } from 'lucide-react'

export default function HideawayPage() {
  const [entries] = useState([
    {
      id: '1',
      title: 'A quiet evening thought',
      content:
        'Sometimes the sweetest thing in the world is just knowing someone is existing gently in the same world as you, safe and warm.',
      mood: 'Peaceful',
      date: 'Personal Journal Entry',
    },
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cottage-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cottage-brown/20 text-cottage-brown-dark text-xs font-medium mb-2 border border-cottage-brown/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Sanctuary</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-cottage-bark">
            The Hideaway
          </h1>
          <p className="text-sm text-cottage-brown mt-1">
            Your private personal space. Never visible to anyone else.
          </p>
        </div>

        <button
          onClick={() => alert('Private thoughts encrypted and stored in Milestone 4!')}
          className="flex items-center gap-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-4 py-2 rounded-full text-sm font-medium shadow-soft transition self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Private Entry</span>
        </button>
      </div>

      {/* Security Assurance Banner */}
      <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 space-y-3">
        <div className="flex items-center gap-2 text-cottage-moss-deep">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="font-serif text-lg font-medium text-cottage-bark">
            Strict Database Row Level Security (RLS)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-cottage-brown leading-relaxed">
          Entries in The Hideaway are strictly protected by Postgres database policies.
          Even if both users are signed in, the database query checks <code>auth.uid() = user_id</code> at the engine level. Neither the other user, nor any public API, can read your private journal or personal thoughts.
        </p>
      </div>

      {/* Private Entries List */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-medium text-cottage-bark flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-cottage-brown" />
          <span>Your Private Entries</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entries.map((item) => (
            <div
              key={item.id}
              className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 space-y-4 shadow-card"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium px-2 py-0.5 rounded-full bg-cottage-cream text-cottage-brown border border-cottage-border">
                  Mood: {item.mood}
                </span>
                <span className="text-cottage-brown text-[11px]">{item.date}</span>
              </div>

              <h4 className="font-serif text-lg font-medium text-cottage-bark">
                {item.title}
              </h4>

              <div className="p-4 rounded-xl bg-cottage-cream border border-cottage-border/50 text-xs sm:text-sm text-cottage-brown leading-relaxed font-serif italic">
                &ldquo;{item.content}&rdquo;
              </div>

              <div className="pt-2 text-[11px] text-cottage-brown-light flex items-center gap-1">
                <Lock className="w-3 h-3 text-cottage-brown" />
                <span>Encrypted private row</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
