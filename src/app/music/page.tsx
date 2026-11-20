'use client'

import React, { useState } from 'react'
import {
  Music,
  ExternalLink,
  PlusCircle,
  Heart,
  Sparkles,
  Disc,
  Radio,
  Headphones,
  Volume2,
  VolumeX,
} from 'lucide-react'

const CURATED_PLAYLISTS = [
  {
    id: '1',
    title: 'Rain & Evening Tea',
    vibe: 'Soft acoustics, mellow piano solos, and twilight cello.',
    trackCount: 14,
    color: 'from-amber-100 to-rose-100',
    tag: 'Cozy Twilight',
  },
  {
    id: '2',
    title: 'Studio Ghibli Calm',
    vibe: 'Whimsical orchestral melodies evoking grassy hills and kite-flying.',
    trackCount: 8,
    color: 'from-emerald-100 to-teal-100',
    tag: 'Gentle Whimsy',
  },
  {
    id: '3',
    title: 'Reading Accompaniment',
    vibe: 'Wordless ambient instrumentals curated for chapters in The Library.',
    trackCount: 11,
    color: 'from-sky-100 to-indigo-100',
    tag: 'Deep Focus',
  },
]

const SAMPLE_TRACKS = [
  {
    id: '1',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    platform: 'spotify',
    collection: 'Rain & Evening Tea',
    url: 'https://open.spotify.com/track/6N7gZr3uzOD0397qcuCOzZ',
    note: 'Remember listening to this while watching the rain against our windowpane.',
    date: 'Autumn Evening',
  },
  {
    id: '2',
    title: 'Merry-Go-Round of Life',
    artist: 'Joe Hisaishi',
    platform: 'youtube',
    collection: 'Studio Ghibli Calm',
    url: 'https://www.youtube.com/watch?v=HMGetv40F44',
    note: 'For sunny weekend mornings in our kitchen with hot coffee ♡',
    date: 'Sunday Morning',
  },
  {
    id: '3',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    platform: 'spotify',
    collection: 'Reading Accompaniment',
    url: 'https://open.spotify.com/track/5NGtFXVpXSvwunEIGeviY3',
    note: 'Peaceful reading accompaniment for when you finish a long chapter.',
    date: 'Late Twilight',
  },
]

export default function MusicRoomPage() {
  const [isPlayingRecord, setIsPlayingRecord] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Atmosphere Header: Cozy Attic Nook with String Lights */}
      <div className="relative rounded-cottage-lg overflow-hidden border-2 border-[#D9CEBA] bg-gradient-to-b from-[#4A3B32] via-[#634E3F] to-[#7A6351] text-[#FDF8EC] p-6 sm:p-10 shadow-lifted">
        {/* Glowing fairy string lights */}
        <div className="absolute top-2 left-0 right-0 flex justify-around pointer-events-none opacity-85">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-3 bg-[#E5B25D]/40" />
              <div
                className="w-2.5 h-2.5 rounded-full bg-[#FFEFA6] shadow-sm animate-pulse"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFA6]/20 border border-[#FFEFA6]/30 text-xs font-medium text-[#FFEFA6]">
              <Music className="w-3.5 h-3.5" />
              <span>The Music Room & Attic Turntable</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight">
              A cozy nook for shared melodies.
            </h1>
            <p className="text-xs sm:text-sm text-[#E2D2C3] leading-relaxed font-sans">
              Here, songs are saved like pressed flowers between journal pages.
              Clicking any melody opens directly in Spotify or YouTube. No subscriptions or streaming locks required.
            </p>
          </div>

          {/* Interactive Turntable Record Player */}
          <div
            onClick={() => setIsPlayingRecord(!isPlayingRecord)}
            className="cursor-pointer group flex flex-col items-center space-y-2 p-4 rounded-2xl bg-[#3A2D25] border-2 border-[#544237] shadow-2xl hover:scale-102 transition-transform select-none"
            title="Click to spin or pause the vinyl record"
          >
            <div className="relative w-36 h-36 rounded-full bg-[#181514] border-4 border-[#2D2622] flex items-center justify-center shadow-inner">
              {/* Vinyl Grooves */}
              <div
                className={`w-32 h-32 rounded-full border border-white/10 flex items-center justify-center ${
                  isPlayingRecord ? 'animate-spin-vinyl' : ''
                }`}
              >
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-[#8C3A3A]">
                    <div className="w-4 h-4 rounded-full bg-[#181514] border border-white/20" />
                  </div>
                </div>
              </div>

              {/* Tonearm */}
              <div
                className={`absolute top-2 right-2 w-1.5 h-16 bg-[#D8C7B5] origin-top rounded-full shadow-md transition-transform duration-500 ${
                  isPlayingRecord ? 'rotate-25' : 'rotate-0'
                }`}
              >
                <div className="w-3 h-4 bg-[#A38D77] -bottom-1 -left-0.5 absolute rounded-xs" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#E5B25D] font-serif">
              <Disc className="w-3.5 h-3.5" />
              <span>{isPlayingRecord ? 'Turntable Spinning ♡' : 'Needle Resting'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-medium text-cottage-bark">
            Our Shared Vinyl Shelf
          </h2>
          <p className="text-xs text-cottage-brown">
            Melodies we have saved and shared across our days
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 storybook-wood text-white px-4 py-2 rounded-full text-xs font-medium shadow-soft hover:scale-105 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-amber-200" />
          <span>Share a Melody</span>
        </button>
      </div>

      {/* Curated Playlist Collections (Vinyl Sleeves) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {CURATED_PLAYLISTS.map((col) => (
          <div
            key={col.id}
            className="storybook-card p-5 space-y-3 hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="p-2 rounded-xl bg-cottage-sage/40 text-cottage-moss-deep">
                <Disc className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-cottage-brown bg-cottage-cream px-2.5 py-0.5 rounded-full border border-cottage-border">
                {col.tag}
              </span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-cottage-bark">{col.title}</h3>
              <p className="text-xs text-cottage-brown leading-relaxed mt-1">{col.vibe}</p>
            </div>
            <div className="pt-2 border-t border-cottage-border/40 text-[11px] text-cottage-brown flex items-center justify-between">
              <span>{col.trackCount} shared tracks</span>
              <span className="italic">Curated for us ♡</span>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Track List Styled as Cassette & Record Sleeves */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-medium text-cottage-bark">
          Saved Songs & Notes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_TRACKS.map((track) => (
            <div
              key={track.id}
              className="storybook-card p-5 flex flex-col justify-between space-y-3 hover:border-cottage-moss/70 transition-all shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl storybook-wood flex items-center justify-center text-amber-200 shadow-sm shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-medium text-cottage-bark">
                        {track.title}
                      </h4>
                      <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cottage-cream border border-cottage-border text-cottage-brown">
                        {track.platform}
                      </span>
                    </div>
                    <p className="text-xs text-cottage-brown font-medium">by {track.artist}</p>
                  </div>
                </div>

                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full storybook-wood text-white hover:scale-105 transition-all shadow-xs shrink-0"
                >
                  <span>Listen</span>
                  <ExternalLink className="w-3 h-3 text-amber-200" />
                </a>
              </div>

              {/* Personal Attached Note */}
              {track.note && (
                <div className="storybook-parchment p-3 rounded-xl font-serif text-xs text-cottage-brown italic flex items-start gap-2">
                  <Heart className="w-3.5 h-3.5 text-cottage-rose-dark shrink-0 mt-0.5 fill-cottage-rose/60" />
                  <span>&ldquo;{track.note}&rdquo;</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-cottage-brown-light pt-1 border-t border-cottage-border/40">
                <span>{track.collection}</span>
                <span>{track.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share a Song Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="storybook-card max-w-md w-full p-6 sm:p-8 space-y-4 shadow-lifted animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-cottage-border/70 pb-3">
              <h3 className="font-serif text-xl font-medium text-cottage-bark">
                Share a Melody
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-cottage-brown hover:text-cottage-bark p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-medium text-cottage-bark block">Spotify or YouTube Link</label>
                <input
                  type="url"
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Song Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Clair de Lune"
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Artist</label>
                  <input
                    type="text"
                    placeholder="e.g. Debussy"
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-cottage-bark block">Personal Note</label>
                <textarea
                  rows={2}
                  placeholder="Why does this song remind you of our sanctuary? ♡"
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-cottage-border/50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 rounded-full text-xs text-cottage-brown hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Melody saved to our shared shelf!')
                  setShowAddModal(false)
                }}
                className="px-5 py-1.5 rounded-full text-xs font-medium storybook-wood text-white shadow-xs"
              >
                Save Melody
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
