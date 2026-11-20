'use client'

import React, { useState } from 'react'
import {
  Flower2,
  Sun,
  Wind,
  Sparkles,
  Sprout,
  Heart,
  Droplets,
  Bird,
} from 'lucide-react'

const BOTANICAL_DISCOVERIES = [
  {
    id: 1,
    name: 'Sanctuary Lavender',
    meaning: 'Calm & Restful Sleep',
    lore: 'Planted near the stone path to brush against sleeves and release its soothing scent as you walk past.',
    color: 'bg-purple-100/90 text-purple-900 border-purple-300',
    flowerColor: '#9366B4',
  },
  {
    id: 2,
    name: 'Meadow Chamomile',
    meaning: 'Warm Herbal Tea & Patience',
    lore: 'Tiny white and golden sunbursts. Perfect for drying in small bundles on the kitchen sill.',
    color: 'bg-amber-100/90 text-amber-950 border-amber-300',
    flowerColor: '#F5C242',
  },
  {
    id: 3,
    name: 'Cottage Forget-Me-Not',
    meaning: 'True Affection & Memories',
    lore: 'Thrives in the cool shade beside the library window sill.',
    color: 'bg-sky-100/90 text-sky-950 border-sky-300',
    flowerColor: '#6BB5E5',
  },
  {
    id: 4,
    name: 'Woodland Moss Rose',
    meaning: 'Gentle Devotion',
    lore: 'Soft, velvety petals that hold morning dew drops long after the sunrise.',
    color: 'bg-rose-100/90 text-rose-950 border-rose-300',
    flowerColor: '#DE7083',
  },
  {
    id: 5,
    name: 'Wild Apple Blossom',
    meaning: 'Hope & Sweet Autumns',
    lore: 'Drifts down onto our scrapbook table like warm fragrant snow.',
    color: 'bg-emerald-100/90 text-emerald-950 border-emerald-300',
    flowerColor: '#72A86E',
  },
  {
    id: 6,
    name: 'Golden Honeysuckle',
    meaning: 'Sweet Bonds & Twilight Whispers',
    lore: 'Climbs the wooden garden gate, welcoming hummingbirds and evening bees.',
    color: 'bg-yellow-100/90 text-yellow-950 border-yellow-300',
    flowerColor: '#E8B638',
  },
]

export default function GardenPage() {
  const [tendedIds, setTendedIds] = useState<number[]>([1, 3])
  const [activeFlower, setActiveFlower] = useState<number | null>(null)

  const toggleTend = (id: number) => {
    setActiveFlower(id)
    setTendedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-8">
      {/* Atmosphere Header: Storybook Garden Gate */}
      <div className="relative rounded-cottage-lg overflow-hidden border-2 border-[#C9D9C3] bg-gradient-to-r from-[#4A6445] via-[#5F7C59] to-[#40563C] text-[#F9F7EE] p-6 sm:p-10 shadow-lifted">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2E8]/20 border border-[#EAF2E8]/30 text-xs font-medium text-[#D8EADB]">
            <Flower2 className="w-3.5 h-3.5" />
            <span>The Cottage Garden</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight">
            A peaceful garden that blooms without hurry.
          </h1>
          <p className="text-xs sm:text-sm text-[#D7E4D4] leading-relaxed">
            There are no daily streaks here, no wilt timers, and no penalties.
            The flowers wait patiently for whenever you wish to visit and listen to the breeze.
          </p>
        </div>

        {/* Ambient floating butterflies */}
        <div className="absolute top-6 right-10 pointer-events-none opacity-80 animate-bounce hidden sm:block">
          <span className="text-2xl">🦋</span>
        </div>
      </div>

      {/* Gentle Philosophy Banner */}
      <div className="storybook-card p-5 flex items-start gap-3.5 text-xs sm:text-sm text-cottage-brown">
        <Sprout className="w-5 h-5 text-cottage-moss-deep shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-cottage-bark">Zero Pressure Philosophy</p>
          <p className="leading-relaxed">
            In our world, tending a flower is simply an act of quiet contemplation. No numbers, no levels, and no notifications are ever sent.
          </p>
        </div>
      </div>

      {/* Interactive Flowerbed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-cottage-bark">
              The Sanctuary Flowerbed
            </h2>
            <p className="text-xs text-cottage-brown">
              Click any plant to tend it and reveal its quiet lore ♡
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cottage-moss-deep bg-cottage-sage/40 px-3 py-1.5 rounded-full border border-cottage-moss/40">
            <Droplets className="w-3.5 h-3.5" />
            <span>{tendedIds.length} of {BOTANICAL_DISCOVERIES.length} Blooming</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOTANICAL_DISCOVERIES.map((flower) => {
            const isTended = tendedIds.includes(flower.id)

            return (
              <div
                key={flower.id}
                onClick={() => toggleTend(flower.id)}
                className={`cursor-pointer storybook-card p-6 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 select-none ${
                  isTended ? 'ring-2 ring-cottage-moss-deep/70 shadow-lifted' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${flower.flowerColor}25` }}
                    >
                      <Flower2
                        className={`w-6 h-6 ${isTended ? 'animate-sway' : ''}`}
                        style={{ color: flower.flowerColor }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isTended
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-cottage-cream text-cottage-brown border-cottage-border'
                      }`}
                    >
                      {isTended ? 'In Full Bloom 🌸' : 'Quiet Bud'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-cottage-bark">
                      {flower.name}
                    </h3>
                    <p className="text-xs font-serif italic text-cottage-rose-dark mt-0.5">
                      Meaning: {flower.meaning}
                    </p>
                    <p className="text-xs text-cottage-brown leading-relaxed mt-2 storybook-parchment p-3 rounded-xl">
                      {flower.lore}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-cottage-border/40 flex items-center justify-between text-xs text-cottage-brown">
                  <span>{isTended ? 'Tended with warmth' : 'Tap to warm gently'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-cottage-moss-deep" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
