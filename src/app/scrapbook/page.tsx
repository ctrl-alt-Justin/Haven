'use client'

import { useState } from 'react'
import {
  Camera,
  Heart,
  PlusCircle,
  Quote,
  Lock,
  Globe,
  Tag,
  Paperclip,
} from 'lucide-react'

const SAMPLE_ENTRIES = [
  {
    id: '1',
    type: 'quote',
    title: 'Evening Quiet',
    content:
      'I cannot remember the books I have read any more than the meals I have eaten; even so, they have made me. — Ralph Waldo Emerson',
    visibility: 'shared',
    date: 'Autumn Afternoon',
    tags: ['Reading', 'Sanctuary'],
  },
  {
    id: '2',
    type: 'memory',
    title: 'Our Rainy Tea Moment',
    content:
      'The kettle was whistling on the stove, rain was drumming gently on the sill, and we both sat reading without saying a word for an hour.',
    visibility: 'shared',
    date: 'October Memory',
    tags: ['Tea', 'Rain'],
  },
  {
    id: '3',
    type: 'note',
    title: 'A Little Wish for Later',
    content:
      'Let us find an afternoon soon to just sit under the warm lamp, have cinnamon tea, and finish that chapter together.',
    visibility: 'shared',
    date: 'Gentle Wish',
    tags: ['Wish', 'Cottage'],
  },
]

export default function ScrapbookPage() {
  const [filter, setFilter] = useState<'all' | 'shared' | 'personal'>('all')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cottage-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cottage-cream-dark/60 text-cottage-brown-dark text-xs font-medium mb-2 border border-cottage-border">
            <Camera className="w-3.5 h-3.5" />
            <span>Shared & Personal Keepsakes</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-cottage-bark">
            The Scrapbook
          </h1>
          <p className="text-sm text-cottage-brown mt-1">
            Photos, quotes, screenshots, and memories pinned gently onto our board.
          </p>
        </div>

        <button
          onClick={() => alert('Keepsake creation pipeline active in Milestone 3!')}
          className="flex items-center gap-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-4 py-2 rounded-full text-sm font-medium shadow-soft transition self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Pin a Keepsake</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            filter === 'all'
              ? 'bg-cottage-moss-deep text-cottage-cream-light border-cottage-moss-deep'
              : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
          }`}
        >
          All Pinned Keepsakes
        </button>
        <button
          onClick={() => setFilter('shared')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            filter === 'shared'
              ? 'bg-cottage-moss-deep text-cottage-cream-light border-cottage-moss-deep'
              : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
          }`}
        >
          Shared Moments
        </button>
        <button
          onClick={() => setFilter('personal')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            filter === 'personal'
              ? 'bg-cottage-moss-deep text-cottage-cream-light border-cottage-moss-deep'
              : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
          }`}
        >
          My Personal Drafts
        </button>
      </div>

      {/* Pinboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-cottage-moss-deep font-medium bg-cottage-sage/40 px-2.5 py-0.5 rounded-full border border-cottage-moss/30">
                  <Globe className="w-3 h-3" />
                  <span>Shared</span>
                </span>
                <span className="text-[11px] text-cottage-brown">{entry.date}</span>
              </div>

              <h3 className="font-serif text-lg font-medium text-cottage-bark">
                {entry.title}
              </h3>

              <div className="p-3.5 rounded-xl bg-cottage-cream border border-cottage-border/50 font-serif italic text-sm text-cottage-brown leading-relaxed">
                &ldquo;{entry.content}&rdquo;
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-cottage-border/40 text-cottage-brown">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-cottage-brown" />
                <span>{entry.tags.join(', ')}</span>
              </div>
              <Heart className="w-3.5 h-3.5 text-cottage-rose-dark fill-cottage-rose/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
