'use client'

import { useState } from 'react'
import { Flower2, Sun, CloudRain, Sparkles, Sprout, Wind } from 'lucide-react'

export default function GardenPage() {
  const [bloomedFlowers, setBloomedFlowers] = useState<number[]>([1, 3])

  const toggleBloom = (id: number) => {
    setBloomedFlowers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const FLOWERS = [
    { id: 1, name: 'Sanctuary Lavender', scent: 'Calm & Rest', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 2, name: 'Meadow Chamomile', scent: 'Warm Apple Tea', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 3, name: 'Cottage Forget-Me-Not', scent: 'Gentle Affection', color: 'bg-sky-100 text-sky-800 border-sky-200' },
    { id: 4, name: 'Woodland Moss Rose', scent: 'Petals & Earth', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    { id: 5, name: 'Wild Ivy & Mint', scent: 'Fresh Morning Dew', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 6, name: 'Sweet Honeysuckle', scent: 'Golden Sunset', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-cottage-border/70 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cottage-sage/50 text-cottage-moss-deep text-xs font-medium mb-2 border border-cottage-moss/30">
          <Flower2 className="w-3.5 h-3.5" />
          <span>Interactive Sanctuary Garden</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-cottage-bark">
          The Garden
        </h1>
        <p className="text-sm text-cottage-brown mt-1">
          A place of gentle discoveries, seasonal flowers, and quiet sunlight.
        </p>
      </div>

      {/* Gentle philosophy banner */}
      <div className="rounded-cottage border border-cottage-moss/40 bg-cottage-sage/30 p-5 flex items-start gap-3.5 text-xs sm:text-sm text-cottage-brown">
        <Sprout className="w-5 h-5 text-cottage-moss-deep shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-cottage-bark">Zero Pressure, No Streaks</p>
          <p className="leading-relaxed">
            The flowers in this garden bloom purely for joy. There are no daily login timers, no streaks that reset, and no punishment for being away. Tend to them whenever you feel like pausing.
          </p>
        </div>
      </div>

      {/* Garden Weather & Season Card */}
      <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cottage-sage/40 border border-cottage-moss/30 flex items-center justify-center text-cottage-moss-deep">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-cottage-bark">
              Afternoon Sunbeam & Soft Breeze
            </h3>
            <p className="text-xs text-cottage-brown">
              Mild and quiet in our digital sanctuary. Perfect weather for reading outdoors.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-cottage-brown bg-cottage-cream px-3 py-1.5 rounded-full border border-cottage-border">
          <Wind className="w-3.5 h-3.5 text-cottage-brown-light" />
          <span>Gentle Autumn Air</span>
        </div>
      </div>

      {/* Interactive Flowerbed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-medium text-cottage-bark">
            The Sanctuary Flowerbed
          </h2>
          <span className="text-xs text-cottage-brown">Click any plant to tend it ♡</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLOWERS.map((flower) => {
            const isBloomed = bloomedFlowers.includes(flower.id)
            return (
              <button
                key={flower.id}
                onClick={() => toggleBloom(flower.id)}
                className={`text-left rounded-cottage border p-5 transition-all ${
                  isBloomed
                    ? `${flower.color} shadow-card scale-[1.01]`
                    : 'bg-cottage-cream-light border-cottage-border hover:border-cottage-moss/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-white/70 shadow-xs">
                    <Flower2 className={`w-5 h-5 ${isBloomed ? 'text-current' : 'text-cottage-brown'}`} />
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-white/60">
                    {isBloomed ? 'In Full Bloom' : 'Dozing in the Earth'}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-medium text-cottage-bark">
                  {flower.name}
                </h3>
                <p className="text-xs text-cottage-brown mt-1">
                  Gentle scent: <span className="italic">{flower.scent}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-cottage-brown">
                  <span>{isBloomed ? 'Tended with warmth' : 'Tap to wake gently'}</span>
                  <Sparkles className="w-3.5 h-3.5 opacity-60" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
