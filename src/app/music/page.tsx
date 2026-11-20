'use client'

import { useState } from 'react'
import {
  Music,
  ExternalLink,
  PlusCircle,
  Heart,
  Sparkles,
  Radio,
  Headphones,
  Disc,
} from 'lucide-react'

const SAMPLE_TRACKS = [
  {
    id: '1',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    platform: 'spotify',
    collection: 'Rain & Evening Tea',
    url: 'https://open.spotify.com/track/6N7gZr3uzOD0397qcuCOzZ',
    note: 'Remember listening to this while watching the rain against the window.',
    addedBy: 'Sanctuary Member',
  },
  {
    id: '2',
    title: 'Merry-Go-Round of Life',
    artist: 'Joe Hisaishi',
    platform: 'youtube',
    collection: 'Studio Ghibli Calm',
    url: 'https://www.youtube.com/watch?v=HMGetv40F44',
    note: 'For sunny weekend mornings in our kitchen ♡',
    addedBy: 'Sanctuary Member',
  },
  {
    id: '3',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    platform: 'spotify',
    collection: 'Rain & Evening Tea',
    url: 'https://open.spotify.com/track/5NGtFXVpXSvwunEIGeviY3',
    note: 'Peaceful reading accompaniment for when you finish a chapter.',
    addedBy: 'Sanctuary Member',
  },
]

export default function MusicRoomPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cottage-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cottage-rose/40 text-cottage-rose-dark text-xs font-medium mb-2 border border-cottage-rose/50">
            <Music className="w-3.5 h-3.5" />
            <span>Shared Listening Nook</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-cottage-bark">
            The Music Room
          </h1>
          <p className="text-sm text-cottage-brown mt-1">
            A gentle collection of songs, Spotify playlists, and peaceful melodies we share.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-4 py-2 rounded-full text-sm font-medium shadow-soft transition self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share a Melody</span>
        </button>
      </div>

      {/* Philosophy note */}
      <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-cottage-brown">
        <Headphones className="w-5 h-5 text-cottage-rose-dark shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-cottage-bark">
            Complements Spotify & Streaming Platforms
          </p>
          <p className="leading-relaxed">
            The Music Room organizes our shared tracks and personal notes without replacing Spotify or requiring Spotify Premium. Clicking any song opens directly in your official music player.
          </p>
        </div>
      </div>

      {/* Collections Row */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-cottage-bark">Curated Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-5 space-y-2 hover:border-cottage-moss/60 transition">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-cottage-rose/30 text-cottage-rose-dark">
                <Disc className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-cottage-brown">14 tracks</span>
            </div>
            <h3 className="font-serif font-medium text-cottage-bark">Rain & Evening Tea</h3>
            <p className="text-xs text-cottage-brown">Mellow acoustics, piano solos, and soft strings for quiet twilight.</p>
          </div>

          <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-5 space-y-2 hover:border-cottage-moss/60 transition">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-cottage-sage/50 text-cottage-moss-deep">
                <Radio className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-cottage-brown">8 tracks</span>
            </div>
            <h3 className="font-serif font-medium text-cottage-bark">Studio Ghibli Calm</h3>
            <p className="text-xs text-cottage-brown">Whimsical melodies evoking grassy hills, flying kites, and cozy warmth.</p>
          </div>

          <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-5 space-y-2 hover:border-cottage-moss/60 transition">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-cottage-brown/20 text-cottage-brown-dark">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-cottage-brown">11 tracks</span>
            </div>
            <h3 className="font-serif font-medium text-cottage-bark">Reading Accompaniment</h3>
            <p className="text-xs text-cottage-brown">Wordless ambient music curated specially for chapters in The Library.</p>
          </div>
        </div>
      </div>

      {/* Shared Track List */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-cottage-bark">Shared Melodies</h2>
        <div className="space-y-3">
          {SAMPLE_TRACKS.map((track) => (
            <div
              key={track.id}
              className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-card transition"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cottage-sage/40 border border-cottage-moss/30 flex items-center justify-center text-cottage-moss-deep shrink-0 mt-0.5 sm:mt-0">
                  <Music className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-medium text-cottage-bark text-base">
                      {track.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cottage-cream text-cottage-brown border border-cottage-border uppercase font-semibold">
                      {track.platform}
                    </span>
                  </div>
                  <p className="text-xs text-cottage-brown">by {track.artist} · <span className="italic">{track.collection}</span></p>
                  {track.note && (
                    <p className="text-xs text-cottage-rose-dark font-serif italic pt-1">
                      &ldquo;{track.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 self-start sm:self-center text-xs font-medium bg-cottage-sage/50 hover:bg-cottage-sage text-cottage-bark px-3.5 py-1.5 rounded-full border border-cottage-moss/40 transition"
              >
                <span>Listen on {track.platform === 'spotify' ? 'Spotify' : 'YouTube'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Add Track Modal Preview */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-cottage-bark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-cottage-cream rounded-cottage-lg border border-cottage-border shadow-lifted max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif text-xl font-medium text-cottage-bark">
              Share a Song
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-medium text-cottage-bark block mb-1">Spotify or YouTube Link</label>
                <input
                  type="text"
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-cottage-bark block mb-1">Title & Artist</label>
                <input
                  type="text"
                  placeholder="Song Title - Artist"
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-cottage-bark block mb-1">Personal Note</label>
                <textarea
                  rows={2}
                  placeholder="Why does this remind you of us? ♡"
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 rounded-full text-xs text-cottage-brown"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Music link saving logic ready for Milestone 3!')
                  setShowAddModal(false)
                }}
                className="px-4 py-1.5 rounded-full text-xs bg-cottage-moss-deep text-cottage-cream-light"
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
