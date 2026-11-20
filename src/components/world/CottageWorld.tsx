'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Music,
  Camera,
  Flower2,
  Lock,
  Heart,
  Sparkles,
  Compass,
  Mail,
  Feather,
  Info,
  ChevronRight,
  Home,
  CheckCircle,
} from 'lucide-react'

interface RoomHotspot {
  id: string
  title: string
  href: string
  icon: React.ElementType
  tooltip: string
  badge: string
  badgeColor: string
}

const ROOMS: RoomHotspot[] = [
  {
    id: 'library',
    title: 'The Library',
    href: '/library',
    icon: BookOpen,
    tooltip: 'Warm reading nook with bookshelves, armchairs, and legally shared stories.',
    badge: 'Reading Sanctuary',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'music',
    title: 'The Music Room',
    href: '/music',
    icon: Music,
    tooltip: 'Cozy attic nook with our turntable, string lights, and shared Spotify tracks.',
    badge: 'Shared Melodies',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'scrapbook',
    title: 'The Scrapbook',
    href: '/scrapbook',
    icon: Camera,
    tooltip: 'Craft desk with polaroids, paper scraps, and shared memories.',
    badge: 'Keepsakes',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'garden',
    title: 'The Garden',
    href: '/garden',
    icon: Flower2,
    tooltip: 'Blooming lavender and pond lilies. Zero pressure, no streaks.',
    badge: 'Peaceful Bloom',
    badgeColor: 'bg-green-100 text-green-800 border-green-300',
  },
  {
    id: 'hideaway',
    title: 'The Hideaway',
    href: '/hideaway',
    icon: Lock,
    tooltip: 'Your private twilight journal. Encrypted and visible only to you.',
    badge: 'Private Space',
    badgeColor: 'bg-stone-200 text-stone-800 border-stone-300',
  },
]

export default function CottageWorld() {
  const router = useRouter()
  const [activeSpot, setActiveSpot] = useState<RoomHotspot | null>(null)
  const [showMailboxLetter, setShowMailboxLetter] = useState(false)
  const [catPurring, setCatPurring] = useState(false)
  const [pondRipples, setPondRipples] = useState(false)
  const [viewMode, setViewMode] = useState<'world' | 'story'>('world')

  const handleCatPet = () => {
    setCatPurring(true)
    setTimeout(() => setCatPurring(false), 3000)
  }

  const handlePondClick = () => {
    setPondRipples(true)
    setTimeout(() => setPondRipples(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Top Storybook Plaque & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl storybook-wood flex items-center justify-center text-amber-200 shadow-md">
            <Home className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-cottage-bark">
              The Cottage Sanctuary
            </h1>
            <p className="text-xs text-cottage-brown">
              Tap the windows, doorways, or garden paths to explore our world ♡
            </p>
          </div>
        </div>

        <div className="flex items-center rounded-full bg-cottage-cream-light border border-cottage-border p-1 text-xs self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setViewMode('world')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition ${
              viewMode === 'world'
                ? 'storybook-wood text-white shadow-xs font-semibold'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            Illustrated World
          </button>
          <button
            onClick={() => setViewMode('story')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition ${
              viewMode === 'story'
                ? 'storybook-wood text-white shadow-xs font-semibold'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            Storybook Index
          </button>
        </div>
      </div>

      {/* 1. ILLUSTRATED INTERACTIVE GAME WORLD VIEW */}
      {viewMode === 'world' && (
        <div className="relative w-full rounded-cottage-lg overflow-hidden border-2 border-[#DDD0BC] shadow-lifted bg-gradient-to-b from-[#E7EFF5] via-[#F4EFE3] to-[#DCE5D2] select-none">
          {/* Layer 1: Sky & Atmospheric Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Drifting Clouds */}
            <div className="absolute top-4 left-6 opacity-60 animate-smoke-1">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="#FFFFFF">
                <path d="M10,30 Q20,10 40,20 Q60,5 80,18 Q100,8 110,30 Z" />
              </svg>
            </div>
            <div className="absolute top-8 right-12 opacity-50 animate-smoke-2">
              <svg width="140" height="45" viewBox="0 0 140 45" fill="#FFFFFF">
                <path d="M15,35 Q30,12 55,24 Q80,6 105,20 Q125,10 135,35 Z" />
              </svg>
            </div>

            {/* Distant Hills */}
            <svg
              className="absolute bottom-40 w-full opacity-40"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              fill="#A2B79A"
            >
              <path d="M0,120 Q250,50 500,100 T1000,70 L1000,200 L0,200 Z" />
            </svg>
            <svg
              className="absolute bottom-28 w-full opacity-60"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              fill="#839B7A"
            >
              <path d="M0,140 Q350,60 700,110 T1000,90 L1000,200 L0,200 Z" />
            </svg>

            {/* Fireflies / Pollen particles */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-yellow-200 animate-firefly" />
            <div
              className="absolute top-2/3 right-1/4 w-2.5 h-2.5 rounded-full bg-yellow-300 animate-firefly"
              style={{ animationDelay: '1.5s' }}
            />
            <div
              className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-amber-200 animate-firefly"
              style={{ animationDelay: '2.8s' }}
            />
          </div>

          {/* Layer 2: Main Illustrated World SVG Graphic */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[460px] flex items-center justify-center p-4">
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full max-h-[640px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7E4A35" />
                  <stop offset="100%" stopColor="#532F21" />
                </linearGradient>
                <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFF9EB" />
                  <stop offset="100%" stopColor="#EADEC8" />
                </linearGradient>
                <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C4830" />
                  <stop offset="100%" stopColor="#4A2F1C" />
                </linearGradient>
                <radialGradient id="windowGlow">
                  <stop offset="0%" stopColor="#FFF8BA" />
                  <stop offset="70%" stopColor="#FAD368" />
                  <stop offset="100%" stopColor="#DB9624" />
                </radialGradient>
                <radialGradient id="pondGrad">
                  <stop offset="0%" stopColor="#A8D4D6" />
                  <stop offset="100%" stopColor="#6DA6A9" />
                </radialGradient>
              </defs>

              {/* Garden Meadow Floor */}
              <ellipse cx="500" cy="560" rx="600" ry="240" fill="#A8BF9F" />
              <ellipse cx="500" cy="590" rx="550" ry="180" fill="#8FA986" />

              {/* Cobblestone Winding Pathway */}
              <path
                d="M 500,470 C 490,520 460,560 430,650 L 530,650 C 530,570 515,510 500,470 Z"
                fill="#CFC3AD"
              />
              {/* Stepping stones */}
              <ellipse cx="495" cy="485" rx="18" ry="8" fill="#B3A58E" />
              <ellipse cx="485" cy="515" rx="22" ry="10" fill="#B3A58E" />
              <ellipse cx="475" cy="550" rx="26" ry="11" fill="#B3A58E" />
              <ellipse cx="465" cy="590" rx="30" ry="12" fill="#B3A58E" />

              {/* Stone Pond on Left */}
              <g className="cursor-pointer" onClick={handlePondClick}>
                <ellipse cx="180" cy="530" rx="90" ry="45" fill="#5F8B8D" />
                <ellipse cx="180" cy="528" rx="84" ry="40" fill="url(#pondGrad)" />
                {/* Water lily */}
                <ellipse cx="160" cy="525" rx="14" ry="8" fill="#467351" />
                <circle cx="162" cy="523" r="4" fill="#F8B4C4" />
                <ellipse cx="205" cy="535" rx="12" ry="6" fill="#467351" />
                {/* Pond stones */}
                <circle cx="110" cy="540" r="10" fill="#8E998B" />
                <circle cx="130" cy="565" r="12" fill="#758272" />
                <circle cx="230" cy="555" r="11" fill="#8E998B" />
                <circle cx="260" cy="525" r="9" fill="#758272" />
                {pondRipples && (
                  <ellipse
                    cx="180"
                    cy="528"
                    rx="60"
                    ry="28"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}
              </g>

              {/* Apple Tree on Right (behind Scrapbook bench) */}
              <g>
                <path
                  d="M 830,550 Q 820,440 790,360 Q 820,380 840,550 Z"
                  fill="#5A4332"
                />
                <circle cx="770" cy="330" r="70" fill="#698A62" />
                <circle cx="830" cy="310" r="65" fill="#7A9C72" />
                <circle cx="790" cy="270" r="60" fill="#8BAD82" />
                {/* Red apples */}
                <circle cx="750" cy="340" r="6" fill="#C94A4A" />
                <circle cx="810" cy="300" r="6" fill="#C94A4A" />
                <circle cx="830" cy="350" r="6" fill="#C94A4A" />
              </g>

              {/* ============================================================== */}
              {/* THE COTTAGE BUILDING */}
              {/* ============================================================== */}
              {/* Chimney */}
              <rect x="560" y="160" width="38" height="90" fill="#806253" rx="3" />
              <rect x="555" y="155" width="48" height="12" fill="#5E4336" rx="2" />
              {/* Chimney Smoke puffs */}
              <circle cx="580" cy="140" r="10" fill="#FFFFFF" opacity="0.7" className="animate-smoke-1" />
              <circle cx="585" cy="118" r="14" fill="#FFFFFF" opacity="0.6" className="animate-smoke-2" />
              <circle cx="595" cy="90" r="18" fill="#FFFFFF" opacity="0.5" className="animate-smoke-3" />

              {/* Cottage Main Walls */}
              <polygon points="340,470 660,470 660,300 500,200 340,300" fill="url(#wallGrad)" />
              {/* Timber framing beams */}
              <line x1="340" y1="310" x2="660" y2="310" stroke="#684A33" strokeWidth="7" />
              <line x1="340" y1="470" x2="660" y2="470" stroke="#684A33" strokeWidth="8" />
              <line x1="500" y1="200" x2="500" y2="310" stroke="#684A33" strokeWidth="6" />
              <line x1="340" y1="310" x2="340" y2="470" stroke="#684A33" strokeWidth="8" />
              <line x1="660" y1="310" x2="660" y2="470" stroke="#684A33" strokeWidth="8" />
              {/* Timber diagonals */}
              <line x1="340" y1="310" x2="420" y2="470" stroke="#7A583E" strokeWidth="5" />
              <line x1="660" y1="310" x2="580" y2="470" stroke="#7A583E" strokeWidth="5" />

              {/* Roof */}
              <polygon points="310,315 500,185 690,315 675,328 500,205 325,328" fill="url(#roofGrad)" />

              {/* ============================================================== */}
              {/* ROOM HOTSPOT 1: THE LIBRARY (Left Bay Window) */}
              {/* ============================================================== */}
              <g
                className="cursor-pointer group"
                onClick={() => router.push('/library')}
                onMouseEnter={() => setActiveSpot(ROOMS[0])}
                onMouseLeave={() => setActiveSpot(null)}
              >
                {/* Window Frame */}
                <rect x="365" y="340" width="70" height="90" rx="8" fill="#583B25" />
                {/* Glowing Window Panes */}
                <rect x="370" y="345" width="60" height="80" rx="6" fill="url(#windowGlow)" className="group-hover:opacity-100 transition-opacity" />
                {/* Bookshelf silhouette inside */}
                <rect x="375" y="380" width="50" height="4" fill="#6A4D2E" opacity="0.6" />
                <rect x="380" y="365" width="8" height="15" fill="#4B3B2B" opacity="0.7" />
                <rect x="390" y="362" width="7" height="18" fill="#5A3A2A" opacity="0.7" />
                <rect x="400" y="367" width="10" height="13" fill="#3D4B39" opacity="0.7" />
                {/* Window Mullions */}
                <line x1="400" y1="345" x2="400" y2="425" stroke="#583B25" strokeWidth="3" />
                <line x1="370" y1="385" x2="430" y2="385" stroke="#583B25" strokeWidth="3" />
                {/* Window Flowerbox */}
                <rect x="360" y="425" width="80" height="12" rx="3" fill="#4A3423" />
                <circle cx="375" cy="425" r="5" fill="#E88297" />
                <circle cx="395" cy="423" r="6" fill="#F4D36D" />
                <circle cx="415" cy="425" r="5" fill="#9FB898" />
                <circle cx="430" cy="424" r="4" fill="#E88297" />
              </g>

              {/* ============================================================== */}
              {/* ROOM HOTSPOT 2: THE MUSIC ROOM (Upstairs Attic Dormer) */}
              {/* ============================================================== */}
              <g
                className="cursor-pointer group"
                onClick={() => router.push('/music')}
                onMouseEnter={() => setActiveSpot(ROOMS[1])}
                onMouseLeave={() => setActiveSpot(null)}
              >
                {/* Dormer roof & window */}
                <polygon points="465,260 500,215 535,260" fill="url(#roofGrad)" />
                <rect x="475" y="250" width="50" height="48" rx="6" fill="#583B25" />
                <rect x="480" y="255" width="40" height="38" rx="4" fill="url(#windowGlow)" />
                <line x1="500" y1="255" x2="500" y2="293" stroke="#583B25" strokeWidth="2.5" />
                <line x1="480" y1="274" x2="520" y2="274" stroke="#583B25" strokeWidth="2.5" />
                {/* Floating music note icon */}
                <text x="515" y="245" fontSize="18" fill="#E8927C" className="animate-bounce">♪</text>
              </g>

              {/* ============================================================== */}
              {/* ROOM HOTSPOT 3: THE HIDEAWAY (Right Upper Balcony Window) */}
              {/* ============================================================== */}
              <g
                className="cursor-pointer group"
                onClick={() => router.push('/hideaway')}
                onMouseEnter={() => setActiveSpot(ROOMS[4])}
                onMouseLeave={() => setActiveSpot(null)}
              >
                <rect x="575" y="335" width="55" height="70" rx="8" fill="#583B25" />
                <rect x="580" y="340" width="45" height="60" rx="6" fill="url(#windowGlow)" opacity="0.9" />
                <line x1="602" y1="340" x2="602" y2="400" stroke="#583B25" strokeWidth="2.5" />
                <line x1="580" y1="370" x2="625" y2="370" stroke="#583B25" strokeWidth="2.5" />
                {/* Little quiet lantern */}
                <circle cx="602" cy="380" r="4" fill="#FFE58F" />
                <circle cx="602" cy="380" r="8" fill="#FFE58F" opacity="0.3" className="animate-ping" />
              </g>

              {/* ============================================================== */}
              {/* FRONT DOOR / ENTRANCE */}
              {/* ============================================================== */}
              <g
                className="cursor-pointer group"
                onClick={() => router.push('/')}
              >
                <title>The Cottage Doorway</title>
                <rect x="470" y="365" width="60" height="105" rx="5" fill="url(#doorGrad)" stroke="#382113" strokeWidth="3" />
                <ellipse cx="478" cy="418" rx="3.5" ry="3.5" fill="#F9D976" />
                {/* Porch roof & warm light */}
                <polygon points="455,365 500,345 545,365" fill="#4A2F1C" />
                <circle cx="500" cy="358" r="5" fill="#FFE58F" />
                {/* Wreath on door */}
                <circle cx="500" cy="395" r="11" fill="none" stroke="#577A50" strokeWidth="4" />
                <circle cx="500" cy="406" r="3" fill="#DE6B78" />
              </g>

              {/* Porch step & SLEEPING CAT (Miso) */}
              <rect x="455" y="468" width="90" height="8" rx="2" fill="#B4A691" />
              <g
                className="cursor-pointer animate-cat-breath"
                onClick={handleCatPet}
              >
                <title>Click to pet Miso the cottage cat ♡</title>
                {/* Ginger cat sleeping */}
                <ellipse cx="445" cy="466" rx="14" ry="9" fill="#DE8C49" />
                <circle cx="456" cy="462" r="7" fill="#DE8C49" />
                <polygon points="458,454 463,459 455,459" fill="#B86725" />
                <polygon points="452,454 457,459 449,459" fill="#B86725" />
                <path d="M 432,467 Q 425,462 432,458" fill="none" stroke="#DE8C49" strokeWidth="3" />
                {catPurring && (
                  <text x="440" y="445" fontSize="12" fill="#806F5B" className="font-serif italic animate-bounce">
                    purr... ♡
                  </text>
                )}
              </g>

              {/* ============================================================== */}
              {/* ROOM HOTSPOT 4: THE GARDEN (Flowerbed & Arch on Left) */}
              {/* ============================================================== */}
              <g
                className="cursor-pointer group"
                onClick={() => router.push('/garden')}
                onMouseEnter={() => setActiveSpot(ROOMS[3])}
                onMouseLeave={() => setActiveSpot(null)}
              >
                {/* Wooden Garden Gate */}
                <rect x="275" y="420" width="8" height="60" fill="#75583E" />
                <rect x="325" y="420" width="8" height="60" fill="#75583E" />
                <rect x="275" y="440" width="58" height="6" fill="#8F6E50" />
                <rect x="275" y="460" width="58" height="6" fill="#8F6E50" />
                {/* Swaying Sunflowers and Lavender */}
                <g className="animate-sway">
                  <line x1="260" y1="480" x2="260" y2="430" stroke="#466B3F" strokeWidth="3" />
                  <circle cx="260" cy="430" r="10" fill="#F4CB42" />
                  <circle cx="260" cy="430" r="5" fill="#69431D" />
                </g>
                <g className="animate-sway-slow">
                  <line x1="240" y1="485" x2="240" y2="445" stroke="#466B3F" strokeWidth="2.5" />
                  <ellipse cx="240" cy="442" rx="4" ry="10" fill="#9C77B8" />
                  <ellipse cx="240" cy="432" rx="3" ry="8" fill="#B897D1" />
                </g>
                <g className="animate-sway">
                  <line x1="285" y1="485" x2="285" y2="450" stroke="#466B3F" strokeWidth="2.5" />
                  <circle cx="285" cy="448" r="7" fill="#E88297" />
                </g>
              </g>

              {/* ============================================================== */}
              {/* ROOM HOTSPOT 5: THE SCRAPBOOK (Wooden Bench & Photo Desk) */}
              {/* ============================================================== */}
              <g
                className="cursor-pointer group"
                onClick={() => router.push('/scrapbook')}
                onMouseEnter={() => setActiveSpot(ROOMS[2])}
                onMouseLeave={() => setActiveSpot(null)}
              >
                {/* Wooden rustic table / craft bench */}
                <rect x="710" y="460" width="90" height="12" rx="3" fill="#806249" />
                <rect x="725" y="472" width="8" height="35" fill="#5F4734" />
                <rect x="775" y="472" width="8" height="35" fill="#5F4734" />
                {/* Pinned Polaroid on bench */}
                <rect x="730" y="445" width="22" height="26" fill="#FFFFFF" rx="1" stroke="#D3C7B5" transform="rotate(-8 730 445)" />
                <rect x="732" y="447" width="18" height="18" fill="#A8BF9F" transform="rotate(-8 730 445)" />
                <rect x="755" y="448" width="22" height="26" fill="#FFFFFF" rx="1" stroke="#D3C7B5" transform="rotate(6 755 448)" />
                <rect x="757" y="450" width="18" height="18" fill="#E8B4B8" transform="rotate(6 755 448)" />
              </g>

              {/* ============================================================== */}
              {/* INTERACTIVE MAILBOX (Discovery Note) */}
              {/* ============================================================== */}
              <g
                className="cursor-pointer group"
                onClick={() => setShowMailboxLetter(true)}
              >
                <title>Click to open the cottage mailbox ♡</title>
                <rect x="635" y="500" width="7" height="45" fill="#684D37" />
                <rect x="625" y="475" width="28" height="25" rx="6" fill="#A85747" />
                <circle cx="639" cy="487" r="4" fill="#DDB26A" />
                {/* Heart flag */}
                <line x1="648" y1="482" x2="648" y2="470" stroke="#FFFFFF" strokeWidth="2" />
                <polygon points="648,470 658,474 648,478" fill="#E87C87" />
              </g>
            </svg>
          </div>

          {/* Active Hotspot Storybook Card Overlay (Interactive Tooltip) */}
          {activeSpot && (
            <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 storybook-card p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeSpot.badgeColor}`}>
                  {activeSpot.badge}
                </span>
                <span className="text-[11px] text-cottage-brown">Click to step inside</span>
              </div>
              <h3 className="font-serif text-lg font-medium text-cottage-bark flex items-center gap-1.5">
                <span>{activeSpot.title}</span>
                <ChevronRight className="w-4 h-4 text-cottage-moss-deep" />
              </h3>
              <p className="text-xs text-cottage-brown mt-0.5 leading-relaxed">
                {activeSpot.tooltip}
              </p>
            </div>
          )}

          {/* Bottom Quick-Tap Rooms Bar for Mobile Explorers */}
          <div className="bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#DDD3BE] p-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-serif font-medium text-cottage-brown shrink-0 mr-1 hidden sm:inline">
              Cottage Rooms:
            </span>
            {ROOMS.map((room) => {
              const Icon = room.icon
              return (
                <Link
                  key={room.id}
                  href={room.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-cottage-bark border border-cottage-border text-xs whitespace-nowrap shadow-xs hover:border-cottage-moss transition-all"
                >
                  <Icon className="w-3.5 h-3.5 text-cottage-moss-deep" />
                  <span>{room.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* 2. STORYBOOK INDEX VIEW (Alternative peaceful card layout) */}
      {viewMode === 'story' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOMS.map((room) => {
            const Icon = room.icon
            return (
              <Link
                key={room.id}
                href={room.href}
                className="group storybook-card p-6 flex flex-col justify-between hover:border-cottage-moss hover:-translate-y-1 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl storybook-wood flex items-center justify-center text-amber-100 shadow-sm">
                      <Icon className="w-5 h-5 text-amber-200" />
                    </div>
                    <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${room.badgeColor}`}>
                      {room.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-cottage-bark group-hover:text-cottage-moss-deep transition-colors">
                      {room.title}
                    </h3>
                    <p className="text-xs text-cottage-brown leading-relaxed mt-1">
                      {room.tooltip}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-cottage-border/50 flex items-center justify-between text-xs font-medium text-cottage-moss-deep group-hover:translate-x-1 transition-transform">
                  <span>Enter Room</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Discovery Modal: The Mailbox Letter */}
      {showMailboxLetter && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="storybook-card max-w-md w-full p-6 sm:p-8 space-y-4 shadow-lifted animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between border-b border-cottage-border/70 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cottage-moss-deep" />
                <span className="font-serif font-medium text-base text-cottage-bark">
                  A Letter from the Cottage ♡
                </span>
              </div>
              <button
                onClick={() => setShowMailboxLetter(false)}
                className="text-xs text-cottage-brown hover:text-cottage-bark p-1"
              >
                ✕
              </button>
            </div>

            <div className="storybook-parchment p-5 rounded-xl space-y-3 font-serif text-sm text-cottage-brown leading-relaxed italic">
              <p>
                &ldquo;Dearest traveler, you have stepped into a quiet refuge created to shelter our days.
              </p>
              <p>
                There are no obligations here. The kettle is always warm on the stove, the armchairs in the library are waiting, and the garden flowers bloom without hurry.
              </p>
              <p className="text-right not-italic text-xs font-semibold text-cottage-bark pt-1">
                — With love, from our sanctuary ♡
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowMailboxLetter(false)}
                className="px-5 py-1.5 rounded-full text-xs font-medium storybook-wood text-white shadow-xs"
              >
                Close Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sanctuary Peace Banner */}
      <div className="storybook-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-serif text-lg font-medium text-cottage-bark flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cottage-moss-deep" />
            <span>A Sanctuary with Zero Pressure</span>
          </h4>
          <p className="text-xs text-cottage-brown leading-relaxed max-w-2xl">
            No streaks to maintain. No read receipts or last-seen timestamps. No notifications demanding attention.
            Visit whenever you feel like reading, listening to a melody, or simply resting.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-cottage-brown-dark bg-cottage-cream px-3 py-1.5 rounded-full border border-cottage-border shrink-0 self-start sm:self-auto">
          <Heart className="w-3.5 h-3.5 text-cottage-rose-dark fill-cottage-rose/50" />
          <span>Made for Two</span>
        </div>
      </div>
    </div>
  )
}
