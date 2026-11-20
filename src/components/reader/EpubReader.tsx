'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import ePub, { Book, Rendition, Contents } from 'epubjs'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings,
  List,
  Bookmark as BookmarkIcon,
  Maximize2,
  Minimize2,
  Type,
  Sun,
  Moon,
  BookOpen,
  Sparkles,
  AlignLeft,
  AlignJustify,
} from 'lucide-react'

interface EpubReaderProps {
  bookId: string
  title: string
  author: string
  fileUrl: string
  initialCfi?: string | null
}

interface TocItem {
  id: string
  href: string
  label: string
  subitems?: TocItem[]
}

const THEMES = {
  cream: {
    bg: '#F4EFE3',
    fg: '#2E2620',
    name: 'Warm Cream',
  },
  paper: {
    bg: '#FAF7F0',
    fg: '#26211C',
    name: 'Clean Paper',
  },
  sepia: {
    bg: '#EFE5D0',
    fg: '#433422',
    name: 'Cozy Sepia',
  },
  night: {
    bg: '#1C1917',
    fg: '#D6CFC7',
    name: 'Calm Night',
  },
}

const FONTS = [
  { id: 'georgia', name: 'Georgia (Classic Serif)', family: 'Georgia, serif' },
  { id: 'lora', name: 'Lora (Literary Serif)', family: 'var(--font-cormorant), Georgia, serif' },
  { id: 'bookerly-alt', name: 'Warm Editorial (Bookerly style)', family: '"Palatino Linotype", Book Antiqua, Palatino, serif' },
  { id: 'atkinson', name: 'Atkinson Hyperlegible (Clean)', family: 'system-ui, -apple-system, sans-serif' },
  { id: 'opendyslexic', name: 'Dyslexic Friendly (Wide letterform)', family: 'Comic Sans MS, sans-serif' },
]

export default function EpubReader({
  bookId,
  title,
  author,
  fileUrl,
  initialCfi,
}: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<Book | null>(null)
  const renditionRef = useRef<Rendition | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  const [showToc, setShowToc] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string>('')
  const [percentage, setPercentage] = useState<number>(0)
  const [chapterTitle, setChapterTitle] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Typography & Theme preferences
  const [fontSize, setFontSize] = useState<number>(18)
  const [selectedFont, setSelectedFont] = useState<string>('bookerly-alt')
  const [currentTheme, setCurrentTheme] = useState<'cream' | 'paper' | 'sepia' | 'night'>('cream')
  const [lineSpacing, setLineSpacing] = useState<number>(1.6)
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify')
  const [margins, setMargins] = useState<'compact' | 'normal' | 'wide'>('normal')

  // Bookmarks
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Save progress to database
  const saveProgress = useCallback(
    async (cfi: string, pct: number) => {
      try {
        await fetch('/api/library/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId,
            cfi,
            percentage: pct,
            status: pct >= 98 ? 'finished' : 'currently_reading',
          }),
        })
      } catch (err) {
        console.warn('Could not save reading progress:', err)
      }
    },
    [bookId]
  )

  // Apply theme & font rules into rendition
  const applyStyles = useCallback(() => {
    if (!renditionRef.current) return
    const theme = THEMES[currentTheme]
    const font = FONTS.find((f) => f.id === selectedFont)?.family || 'serif'

    const marginX = margins === 'compact' ? '4%' : margins === 'wide' ? '14%' : '8%'

    renditionRef.current.themes.default({
      body: {
        background: `${theme.bg} !important`,
        color: `${theme.fg} !important`,
        'font-family': `${font} !important`,
        'font-size': `${fontSize}px !important`,
        'line-height': `${lineSpacing} !important`,
        'text-align': `${textAlign} !important`,
        padding: `0 ${marginX} !important`,
      },
      p: {
        'font-family': `${font} !important`,
        'line-height': `${lineSpacing} !important`,
        'text-align': `${textAlign} !important`,
        margin: '0 0 1em 0 !important',
      },
      a: {
        color: 'inherit !important',
      },
    })
  }, [currentTheme, selectedFont, fontSize, lineSpacing, textAlign, margins])

  // Initialize book and rendition
  useEffect(() => {
    if (!viewerRef.current || !fileUrl) return

    setIsLoading(true)
    setLoadError(null)

    try {
      const book = ePub(fileUrl)
      bookRef.current = book

      const rendition = book.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        flow: 'paginated',
        spread: 'auto',
      })
      renditionRef.current = rendition

      // Apply initial styling
      applyStyles()

      // Handle table of contents
      book.loaded.navigation
        .then((nav) => {
          setToc(nav.toc as TocItem[])
        })
        .catch(() => {})

      // Display initial location or start
      const startLocation = initialCfi || undefined
      rendition
        .display(startLocation)
        .then(() => {
          setIsLoading(false)
        })
        .catch((err) => {
          console.warn('Initial location display failed, falling back to start:', err)
          rendition.display().then(() => setIsLoading(false))
        })

      // Generate locations for percentage calculation
      book.ready.then(() => {
        book.locations.generate(1024).then(() => {
          if (rendition.location) {
            const loc = rendition.location.start
            const pct = Math.round(book.locations.percentageFromCfi(loc.cfi) * 100)
            setPercentage(pct)
          }
        })
      })

      // Relocated listener
      rendition.on('relocated', (location: { start: { cfi: string; href: string } }) => {
        if (!location?.start) return
        const cfi = location.start.cfi
        setCurrentLocation(cfi)

        if (book.locations?.length()) {
          const pct = Math.round(book.locations.percentageFromCfi(cfi) * 100)
          setPercentage(pct)
          saveProgress(cfi, pct)
        } else {
          saveProgress(cfi, 0)
        }

        // Get chapter title from TOC
        const chapter = (book.navigation?.toc as TocItem[])?.find((item) =>
          location.start.href?.includes(item.href)
        )
        if (chapter) setChapterTitle(chapter.label.trim())
      })

      // Key listeners for page flip
      rendition.on('keyup', (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          rendition.next()
        } else if (e.key === 'ArrowLeft') {
          rendition.prev()
        }
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading EPUB'
      setLoadError(msg)
      setIsLoading(false)
    }

    return () => {
      try {
        bookRef.current?.destroy()
      } catch {}
    }
  }, [fileUrl, initialCfi, saveProgress, applyStyles])

  // Update styles whenever typography settings change
  useEffect(() => {
    applyStyles()
  }, [applyStyles])

  const handleNext = () => renditionRef.current?.next()
  const handlePrev = () => renditionRef.current?.prev()

  const handleJumpToHref = (href: string) => {
    renditionRef.current?.display(href)
    setShowToc(false)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const activeThemeObj = THEMES[currentTheme]

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none transition-colors duration-300"
      style={{ backgroundColor: activeThemeObj.bg, color: activeThemeObj.fg }}
    >
      {/* Top Reading Navigation Bar */}
      <header
        className="h-14 px-4 border-b flex items-center justify-between transition-colors z-20"
        style={{
          borderColor: currentTheme === 'night' ? '#2A2420' : '#E0D7C4',
          backgroundColor: activeThemeObj.bg,
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition"
            style={{
              borderColor: currentTheme === 'night' ? '#3E352F' : '#D1C6B4',
              backgroundColor: currentTheme === 'night' ? '#26201B' : '#FAF7F0',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Library</span>
          </Link>
          <div className="hidden sm:flex flex-col">
            <span className="font-serif font-medium text-sm line-clamp-1">{title}</span>
            <span className="text-[11px] opacity-70 line-clamp-1">{author}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {chapterTitle && (
            <span className="hidden md:inline-block text-xs font-serif italic opacity-75 max-w-[200px] truncate mr-2">
              {chapterTitle}
            </span>
          )}

          <button
            onClick={() => setShowToc(!showToc)}
            title="Table of Contents"
            className="p-2 rounded-full hover:bg-black/5 transition"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Reading Settings"
            className="p-2 rounded-full hover:bg-black/5 transition"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
            className="p-2 rounded-full hover:bg-black/5 transition"
          >
            <BookmarkIcon
              className={`w-4 h-4 ${isBookmarked ? 'fill-current text-cottage-rose-dark' : ''}`}
            />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-full hover:bg-black/5 transition hidden sm:inline-flex"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main EPUB Reading Container */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-10 h-10 rounded-full border-2 border-cottage-moss-deep border-t-transparent animate-spin" />
            <p className="font-serif text-sm opacity-75">Opening gentle pages...</p>
          </div>
        )}

        {/* Load Error */}
        {loadError && (
          <div className="p-6 rounded-2xl border border-red-200 bg-red-50 text-red-900 max-w-md text-center space-y-3 z-10">
            <p className="font-serif text-lg font-medium">Could not load this EPUB</p>
            <p className="text-xs">{loadError}</p>
            <Link
              href="/library"
              className="inline-block px-4 py-1.5 rounded-full bg-red-100 hover:bg-red-200 text-xs font-medium"
            >
              Return to Library
            </Link>
          </div>
        )}

        {/* Previous page touch/click zone */}
        <button
          onClick={handlePrev}
          aria-label="Previous Page"
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 flex items-center justify-start pl-2 opacity-0 hover:opacity-40 transition-opacity"
        >
          <div className="p-2 rounded-full bg-black/10">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </button>

        {/* The Rendition Container */}
        <div ref={viewerRef} className="w-full h-full max-w-4xl mx-auto" />

        {/* Next page touch/click zone */}
        <button
          onClick={handleNext}
          aria-label="Next Page"
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 flex items-center justify-end pr-2 opacity-0 hover:opacity-40 transition-opacity"
        >
          <div className="p-2 rounded-full bg-black/10">
            <ChevronRight className="w-6 h-6" />
          </div>
        </button>
      </main>

      {/* Bottom Progress Bar */}
      <footer
        className="h-10 px-4 border-t flex items-center justify-between text-xs z-20"
        style={{
          borderColor: currentTheme === 'night' ? '#2A2420' : '#E0D7C4',
          backgroundColor: activeThemeObj.bg,
        }}
      >
        <span className="opacity-75">{percentage}% completed</span>
        <div className="w-48 sm:w-80 h-1.5 rounded-full bg-black/10 overflow-hidden mx-4">
          <div
            className="h-full bg-cottage-moss-deep transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-1 hover:bg-black/5 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={handleNext} className="p-1 hover:bg-black/5 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Table of Contents Drawer */}
      {showToc && (
        <div
          className="fixed inset-y-0 left-0 w-80 max-w-full z-40 border-r shadow-lifted p-6 overflow-y-auto space-y-4 animate-in slide-in-from-left duration-200"
          style={{
            backgroundColor: activeThemeObj.bg,
            borderColor: currentTheme === 'night' ? '#2A2420' : '#E0D7C4',
          }}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif text-lg font-medium">Table of Contents</h3>
            <button
              onClick={() => setShowToc(false)}
              className="text-xs p-1 hover:bg-black/5 rounded"
            >
              ✕
            </button>
          </div>
          {toc.length === 0 ? (
            <p className="text-xs opacity-60">No chapters indexed in this EPUB.</p>
          ) : (
            <ul className="space-y-1 text-xs">
              {toc.map((item) => (
                <li key={item.id || item.href}>
                  <button
                    onClick={() => handleJumpToHref(item.href)}
                    className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-black/5 transition truncate font-serif"
                  >
                    {item.label?.trim() || 'Chapter'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Reading Settings Drawer */}
      {showSettings && (
        <div
          className="fixed top-14 right-4 w-80 z-40 rounded-2xl border shadow-lifted p-5 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150"
          style={{
            backgroundColor: activeThemeObj.bg,
            borderColor: currentTheme === 'night' ? '#2A2420' : '#E0D7C4',
          }}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-serif font-medium text-sm">Reading Settings</span>
            <button onClick={() => setShowSettings(false)}>✕</button>
          </div>

          {/* Theme selection */}
          <div className="space-y-1.5">
            <span className="font-medium opacity-80 block">Theme</span>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((key) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`p-2 rounded-xl text-center border text-[11px] font-medium transition ${
                    currentTheme === key ? 'ring-2 ring-cottage-moss-deep' : ''
                  }`}
                  style={{
                    backgroundColor: THEMES[key].bg,
                    color: THEMES[key].fg,
                    borderColor: '#C0B7A6',
                  }}
                >
                  {THEMES[key].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Typography font family */}
          <div className="space-y-1.5">
            <span className="font-medium opacity-80 block">Typography</span>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-2 rounded-lg border text-xs bg-transparent"
              style={{ borderColor: currentTheme === 'night' ? '#3E352F' : '#D1C6B4' }}
            >
              {FONTS.map((font) => (
                <option
                  key={font.id}
                  value={font.id}
                  style={{ background: activeThemeObj.bg, color: activeThemeObj.fg }}
                >
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size controls */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium opacity-80">Font Size</span>
              <span>{fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(13, fontSize - 1))}
                className="flex-1 py-1.5 rounded border text-center hover:bg-black/5"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(Math.min(32, fontSize + 1))}
                className="flex-1 py-1.5 rounded border text-center hover:bg-black/5 font-bold"
              >
                A+
              </button>
            </div>
          </div>

          {/* Line spacing & Text Alignment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <span className="font-medium opacity-80 block">Line Spacing</span>
              <div className="flex items-center gap-1">
                {[1.4, 1.6, 1.9].map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => setLineSpacing(spacing)}
                    className={`flex-1 py-1 rounded border text-center text-[10px] ${
                      lineSpacing === spacing ? 'bg-cottage-moss-deep text-white' : ''
                    }`}
                  >
                    {spacing}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-medium opacity-80 block">Alignment</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTextAlign('justify')}
                  className={`flex-1 py-1 rounded border flex justify-center ${
                    textAlign === 'justify' ? 'bg-cottage-moss-deep text-white' : ''
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTextAlign('left')}
                  className={`flex-1 py-1 rounded border flex justify-center ${
                    textAlign === 'left' ? 'bg-cottage-moss-deep text-white' : ''
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
