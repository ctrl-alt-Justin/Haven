'use client'

import React, { useState } from 'react'
import {
  Camera,
  Heart,
  PlusCircle,
  Quote,
  Lock,
  Globe,
  Tag,
  Paperclip,
  Sparkles,
  Pin,
  Image as ImageIcon,
} from 'lucide-react'

const KEEPSAKES = [
  {
    id: '1',
    type: 'quote',
    title: 'An Autumn Thought',
    content:
      'I cannot remember the books I have read any more than the meals I have eaten; even so, they have made me. — Ralph Waldo Emerson',
    author: 'Sanctuary Reading',
    date: 'October Memory',
    visibility: 'shared',
    tapeColor: 'bg-amber-200/70',
    rotation: '-rotate-1',
    tags: ['Reading', 'Warmth'],
  },
  {
    id: '2',
    type: 'memory',
    title: 'Tea by the Rain Window',
    content:
      'The kettle was whistling on the stove, rain was drumming gently against the sill, and we both sat reading without needing to say a word.',
    author: 'Quiet Afternoon',
    date: 'Autumn Rain',
    visibility: 'shared',
    tapeColor: 'bg-rose-200/70',
    rotation: 'rotate-1',
    tags: ['Cottage', 'Tea'],
  },
  {
    id: '3',
    type: 'note',
    title: 'A Little Wish for Us',
    content:
      'Let us find an afternoon soon to just sit under the warm lamp, have cinnamon tea, and finish that chapter together.',
    author: 'Gentle Wish',
    date: 'Sanctuary Note',
    visibility: 'shared',
    tapeColor: 'bg-emerald-200/70',
    rotation: '-rotate-2',
    tags: ['Wish', 'Together'],
  },
]

export default function ScrapbookPage() {
  const [filter, setFilter] = useState<'all' | 'shared' | 'personal'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Atmosphere Header: Storybook Craft Desk */}
      <div className="relative rounded-cottage-lg overflow-hidden border-2 border-[#D9CEBA] bg-gradient-to-r from-[#8E745A] via-[#A88C70] to-[#765D46] text-[#FDF8EC] p-6 sm:p-10 shadow-lifted">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFA6]/20 border border-[#FFEFA6]/30 text-xs font-medium text-[#FFEFA6]">
            <Camera className="w-3.5 h-3.5" />
            <span>The Scrapbook Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight">
            Memories pinned with gentle care.
          </h1>
          <p className="text-xs sm:text-sm text-[#EFE4D6] leading-relaxed">
            Our wooden craft desk for polaroids, quotes, screenshots, and little notes.
            Each keepsake can be pinned openly for both of us, or saved as a personal draft.
          </p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Washi-style Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Keepsakes' },
            { id: 'shared', label: 'Shared Moments ♡' },
            { id: 'personal', label: 'Personal Keepsakes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'shared' | 'personal')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
                filter === tab.id
                  ? 'storybook-wood text-white shadow-xs font-semibold'
                  : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 storybook-wood text-white px-4 py-2 rounded-full text-xs font-medium shadow-soft hover:scale-105 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-200" />
          <span>Pin a Keepsake</span>
        </button>
      </div>

      {/* Wooden Pinboard Floor with Polaroid & Note Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
        {KEEPSAKES.map((item) => (
          <div
            key={item.id}
            className={`relative storybook-card p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1.5 transition-all ${item.rotation} shadow-card`}
          >
            {/* Washi Tape strip at top */}
            <div
              className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 ${item.tapeColor} opacity-85 rotate-[-2deg] shadow-xs border-y border-dashed border-black/10`}
            />

            {/* Pushpin in corner */}
            <div className="absolute top-3 right-3 text-[#B86851] opacity-75">
              <Pin className="w-4 h-4" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-cottage-moss-deep font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider">{item.visibility}</span>
              </div>

              <h3 className="font-serif text-xl font-medium text-cottage-bark leading-snug">
                {item.title}
              </h3>

              {/* Handwritten Paper Body */}
              <div className="storybook-parchment p-4 rounded-xl font-serif text-sm text-cottage-brown italic leading-relaxed">
                &ldquo;{item.content}&rdquo;
              </div>
            </div>

            <div className="pt-3 border-t border-cottage-border/50 flex items-center justify-between text-xs text-cottage-brown">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-cottage-brown" />
                <span className="text-[11px]">{item.tags.join(', ')}</span>
              </div>
              <span className="text-[11px] italic font-serif">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pin a Keepsake Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="storybook-card max-w-md w-full p-6 sm:p-8 space-y-4 shadow-lifted animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-cottage-border/70 pb-3">
              <h3 className="font-serif text-xl font-medium text-cottage-bark">
                Pin a New Keepsake
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
                <label className="font-medium text-cottage-bark block">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon by the Window"
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-cottage-bark block">Keepsake Text / Quote</label>
                <textarea
                  rows={3}
                  placeholder="Write a sweet memory, quote, or note..."
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-cottage-bark block">Visibility</label>
                <select className="w-full rounded-lg border border-cottage-border bg-cottage-cream p-2 text-xs focus:outline-none focus:border-cottage-moss-deep">
                  <option value="shared">Shared with both of us ♡</option>
                  <option value="personal">Personal to me only</option>
                </select>
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
                  alert('Keepsake pinned to our craft desk!')
                  setShowAddModal(false)
                }}
                className="px-5 py-1.5 rounded-full text-xs font-medium storybook-wood text-white shadow-xs"
              >
                Pin Keepsake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
