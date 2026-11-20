import Link from 'next/link'
import {
  BookOpen,
  Music,
  Camera,
  Flower2,
  Lock,
  ArrowRight,
  Heart,
  Feather,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react'

const ROOMS = [
  {
    title: 'The Library',
    slug: '/library',
    description:
      'Our shared collection of light novels, fantasy, romance, and comics with reflowable EPUB and visual comic reading.',
    icon: BookOpen,
    accent: 'bg-cottage-sage/40 text-cottage-moss-deep',
    border: 'border-cottage-moss/40',
    tag: 'Highest Priority',
    tagColor: 'bg-cottage-sage text-cottage-moss-deep',
  },
  {
    title: 'The Music Room',
    slug: '/music',
    description:
      'A quiet nook to share Spotify links and YouTube songs, save favorite melodies, and attach gentle notes.',
    icon: Music,
    accent: 'bg-cottage-rose/40 text-cottage-rose-dark',
    border: 'border-cottage-rose/50',
    tag: 'Shared Melodies',
    tagColor: 'bg-cottage-rose/60 text-cottage-rose-dark',
  },
  {
    title: 'The Scrapbook',
    slug: '/scrapbook',
    description:
      'Warm polaroids, screenshots, shared quotes, and little notes pinned together across our days.',
    icon: Camera,
    accent: 'bg-cottage-cream-dark/60 text-cottage-brown-dark',
    border: 'border-cottage-border',
    tag: 'Keepsakes',
    tagColor: 'bg-cottage-cream-dark text-cottage-brown-dark',
  },
  {
    title: 'The Garden',
    slug: '/garden',
    description:
      'Gentle interactive flowers, botanical discoveries, and seasonal themes. No streaks or forced tasks.',
    icon: Flower2,
    accent: 'bg-cottage-sage/50 text-cottage-moss-deep',
    border: 'border-cottage-moss/40',
    tag: 'Peaceful Bloom',
    tagColor: 'bg-cottage-sage text-cottage-moss-deep',
  },
  {
    title: 'The Hideaway',
    slug: '/hideaway',
    description:
      'Your private personal sanctuary. Encrypted at the database level with Row Level Security, visible only to you.',
    icon: Lock,
    accent: 'bg-cottage-brown/20 text-cottage-brown-dark',
    border: 'border-cottage-brown/30',
    tag: 'Private Space',
    tagColor: 'bg-cottage-brown/20 text-cottage-brown-dark',
  },
]

export default function CottageHomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-cottage-lg border border-cottage-border/80 bg-gradient-to-br from-cottage-cream-light via-cottage-cream to-cottage-sage/20 p-8 sm:p-12 shadow-soft">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cottage-sage/60 border border-cottage-moss/40 text-xs font-medium text-cottage-moss-deep">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to our sanctuary</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-cottage-bark leading-tight">
            A quiet place created just for us.
          </h1>

          <p className="text-base sm:text-lg text-cottage-brown leading-relaxed font-sans">
            Here, there are no algorithms, no endless feeds, and no hurry. Just a warm cottage
            to read together, listen to music, save gentle memories, and take shelter from the noisy world.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-cottage-brown-dark">
            <span className="flex items-center gap-1.5 bg-cottage-cream/90 px-3 py-1.5 rounded-full border border-cottage-border">
              <ShieldCheck className="w-3.5 h-3.5 text-cottage-moss-deep" />
              Private & Invitation Only
            </span>
            <span className="flex items-center gap-1.5 bg-cottage-cream/90 px-3 py-1.5 rounded-full border border-cottage-border">
              <Heart className="w-3.5 h-3.5 text-cottage-rose-dark" />
              Strictly Two Members
            </span>
            <span className="flex items-center gap-1.5 bg-cottage-cream/90 px-3 py-1.5 rounded-full border border-cottage-border">
              <Compass className="w-3.5 h-3.5 text-cottage-brown" />
              No Streaks or Obligations
            </span>
          </div>
        </div>

        {/* Decorative corner illustration element */}
        <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-cottage-sage/20 blur-2xl pointer-events-none" />
      </section>

      {/* Quote / Thought of the Day */}
      <section className="relative rounded-cottage border border-cottage-border/70 bg-cottage-cream-light/60 p-6 sm:p-8 flex items-start gap-4 shadow-sm">
        <div className="p-2.5 rounded-full bg-cottage-rose/40 text-cottage-rose-dark shrink-0 mt-1">
          <Feather className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-cottage-brown">
            Sanctuary Thought
          </span>
          <p className="font-serif italic text-lg sm:text-xl text-cottage-bark leading-snug">
            &ldquo;There is nothing quite like curling up with a gentle story, a warm cup of tea, and knowing someone you cherish is resting comfortably.&rdquo;
          </p>
        </div>
      </section>

      {/* The Rooms Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-cottage-bark">
              The Rooms of the Cottage
            </h2>
            <p className="text-sm text-cottage-brown mt-1">
              Step into each room whenever you wish. Everything is ready for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOMS.map((room) => {
            const Icon = room.icon
            return (
              <Link
                key={room.title}
                href={room.slug}
                className="group relative flex flex-col justify-between rounded-cottage border border-cottage-border/80 bg-cottage-cream-light/80 p-6 hover:shadow-card hover:border-cottage-moss/60 hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${room.accent} border ${room.border}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${room.tagColor}`}
                    >
                      {room.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-medium text-cottage-bark group-hover:text-cottage-moss-deep transition-colors">
                      {room.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-cottage-brown leading-relaxed font-sans">
                      {room.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-cottage-border/50 flex items-center justify-between text-xs font-medium text-cottage-moss-deep group-hover:translate-x-1 transition-transform">
                  <span>Enter Room</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Sanctuary Philosophy Banner */}
      <section className="rounded-cottage border border-cottage-moss/30 bg-cottage-sage/30 p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-xl font-medium text-cottage-bark flex items-center gap-2">
          <span>Our Gentle Promise</span>
          <span>♡</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-cottage-brown leading-relaxed">
          <div className="bg-cottage-cream-light/90 p-4 rounded-xl border border-cottage-border/70 space-y-1">
            <h4 className="font-semibold text-cottage-bark">No Obligations</h4>
            <p>You never have to check in, respond, or keep any streak alive. This place waits patiently.</p>
          </div>
          <div className="bg-cottage-cream-light/90 p-4 rounded-xl border border-cottage-border/70 space-y-1">
            <h4 className="font-semibold text-cottage-bark">No Surveillance</h4>
            <p>No read receipts, no last seen, no tracking of reading duration. Your reading rhythm belongs to you.</p>
          </div>
          <div className="bg-cottage-cream-light/90 p-4 rounded-xl border border-cottage-border/70 space-y-1">
            <h4 className="font-semibold text-cottage-bark">Complements Daily Life</h4>
            <p>Spotify and Kindle remain right where they belong. We link and curate without replacing.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
