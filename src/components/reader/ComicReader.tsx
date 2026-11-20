'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import JSZip from 'jszip'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Columns,
  Scroll,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

interface ComicReaderProps {
  bookId: string
  title: string
  author: string
  fileUrl: string
  initialPage?: number | null
}

const MAX_DECOMPRESSED_ARCHIVE_BYTES = 400 * 1024 * 1024 // 400MB max decompressed limit to guard against zip bombs

export default function ComicReader({
  bookId,
  title,
  author,
  fileUrl,
  initialPage,
}: ComicReaderProps) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(initialPage || 1)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Modes: 'scroll' (continuous vertical webtoon) vs 'page' (traditional page-by-page)
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('scroll')
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [fitMode, setFitMode] = useState<'width' | 'screen'>('width')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const createdUrlsRef = useRef<string[]>([])

  // Save page progress
  const saveProgress = useCallback(
    async (page: number, total: number) => {
      try {
        const pct = Math.round((page / total) * 100)
        await fetch('/api/library/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId,
            pageNumber: page,
            totalPages: total,
            percentage: pct,
            status: page >= total ? 'finished' : 'currently_reading',
          }),
        })
      } catch (err) {
        console.warn('Could not save comic progress:', err)
      }
    },
    [bookId]
  )

  // Track page change and save progress
  const changePage = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > pages.length) return
    setCurrentPage(newPage)
    saveProgress(newPage, pages.length)
  }, [pages.length, saveProgress])

  // Load and safely extract CBZ archive
  useEffect(() => {
    let active = true
    const urlsToCleanup: string[] = []

    async function loadCbz() {
      setIsLoading(true)
      setLoadError(null)
      setLoadingProgress(10)

      try {
        const response = await fetch(fileUrl)
        if (!response.ok) {
          throw new Error(`Failed to download comic archive (${response.statusText})`)
        }
        setLoadingProgress(40)

        const blob = await response.blob()
        const zip = await JSZip.loadAsync(blob)
        setLoadingProgress(70)

        // Safety check: calculate uncompressed size
        let totalUncompressedSize = 0
        const imageEntries: Array<{ name: string; file: JSZip.JSZipObject }> = []

        const validImageRegex = /\.(jpe?g|png|webp|gif|bmp)$/i

        zip.forEach((relativePath, zipEntry) => {
          // Guard against path traversal
          if (relativePath.includes('..') || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
            return
          }

          // Ignore directories, system files, and non-images
          if (zipEntry.dir || relativePath.includes('__MACOSX') || relativePath.startsWith('.')) {
            return
          }

          if (validImageRegex.test(relativePath)) {
            // Check approximate uncompressed size
            // @ts-expect-error JSZip internal uncompressed size property
            const uncompressed = zipEntry._data?.uncompressedSize || 0
            totalUncompressedSize += uncompressed

            imageEntries.push({ name: relativePath, file: zipEntry })
          }
        })

        if (totalUncompressedSize > MAX_DECOMPRESSED_ARCHIVE_BYTES) {
          throw new Error('Archive exceeds safe decompression limits (possible zip bomb).')
        }

        if (imageEntries.length === 0) {
          throw new Error('No supported image pages found inside this comic archive.')
        }

        // Natural sort by filename (page1, page2, page10)
        imageEntries.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        )

        // Extract image blobs as object URLs
        const imageUrls: string[] = []
        for (let i = 0; i < imageEntries.length; i++) {
          if (!active) return
          const entry = imageEntries[i]
          const imageBlob = await entry.file.async('blob')
          const url = URL.createObjectURL(imageBlob)
          imageUrls.push(url)
          urlsToCleanup.push(url)
          setLoadingProgress(70 + Math.round(((i + 1) / imageEntries.length) * 30))
        }

        if (active) {
          setPages(imageUrls)
          setIsLoading(false)
        }
      } catch (err: unknown) {
        if (!active) return
        const msg = err instanceof Error ? err.message : 'Error extracting comic archive.'
        setLoadError(msg)
        setIsLoading(false)
      }
    }

    loadCbz()

    return () => {
      active = false
      // Revoke any created object URLs on unmount
      urlsToCleanup.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [fileUrl])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'page') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          changePage(currentPage + 1)
        } else if (e.key === 'ArrowLeft') {
          changePage(currentPage - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode, currentPage, changePage])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1A1715] text-[#ECE5D8] select-none">
      {/* Top Header Controls */}
      <header className="h-14 px-4 bg-[#231F1C] border-b border-[#362E29] flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-[#453B34] bg-[#2E2824] hover:bg-[#3B322D] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Library</span>
          </Link>
          <div className="hidden sm:flex flex-col">
            <span className="font-serif font-medium text-sm line-clamp-1">{title}</span>
            <span className="text-[11px] text-[#A89885] line-clamp-1">{author}</span>
          </div>
        </div>

        {/* Reader Mode & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Scroll vs Page Mode */}
          <div className="flex items-center rounded-lg bg-[#2E2824] border border-[#453B34] p-0.5 text-xs">
            <button
              onClick={() => setViewMode('scroll')}
              title="Continuous Vertical Scroll (Webtoon style)"
              className={`p-1.5 rounded-md flex items-center gap-1 ${
                viewMode === 'scroll' ? 'bg-cottage-moss-deep text-white font-medium' : 'text-[#A89885]'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Vertical Scroll</span>
            </button>
            <button
              onClick={() => setViewMode('page')}
              title="Page-by-page (Manga style)"
              className={`p-1.5 rounded-md flex items-center gap-1 ${
                viewMode === 'page' ? 'bg-cottage-moss-deep text-white font-medium' : 'text-[#A89885]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Page-by-Page</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#2E2824] border border-[#453B34] rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
              className="p-1.5 hover:bg-[#3B322D] rounded text-[#A89885]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1 font-mono">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
              className="p-1.5 hover:bg-[#3B322D] rounded text-[#A89885]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 hover:bg-[#3B322D] rounded text-[#A89885]"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#2E2824] border border-[#453B34] text-[#A89885] hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Comic Pages Viewing Area */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative flex justify-center bg-[#151210]"
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-cottage-moss-deep border-t-transparent animate-spin" />
            <p className="font-serif text-sm text-[#A89885]">
              Decompressing comic archive... {loadingProgress}%
            </p>
          </div>
        )}

        {loadError && (
          <div className="p-6 my-auto rounded-2xl border border-red-500/30 bg-red-950/40 text-red-200 max-w-md text-center space-y-3">
            <p className="font-serif text-lg font-medium">Comic Extraction Failed</p>
            <p className="text-xs text-red-300">{loadError}</p>
            <Link
              href="/library"
              className="inline-block px-4 py-1.5 rounded-full bg-red-900/50 hover:bg-red-800/50 text-xs font-medium"
            >
              Return to Library
            </Link>
          </div>
        )}

        {/* View Mode: Continuous Vertical Scroll (Webtoon style) */}
        {!isLoading && !loadError && viewMode === 'scroll' && (
          <div
            className="flex flex-col items-center py-4 space-y-1 transition-all"
            style={{ width: `${zoomLevel}%`, maxWidth: '900px' }}
          >
            {pages.map((pageUrl, idx) => (
              <img
                key={idx}
                src={pageUrl}
                alt={`Page ${idx + 1}`}
                loading="lazy"
                className="w-full h-auto shadow-md rounded-xs"
              />
            ))}
          </div>
        )}

        {/* View Mode: Page-by-Page (Manga style) */}
        {!isLoading && !loadError && viewMode === 'page' && (
          <div className="w-full h-full flex items-center justify-center relative p-2 sm:p-4">
            {/* Click zones */}
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 z-10"
              title="Previous Page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {pages[currentPage - 1] && (
              <img
                src={pages[currentPage - 1]}
                alt={`Page ${currentPage}`}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-xs transition-transform"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              />
            )}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage >= pages.length}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 z-10"
              title="Next Page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-11 px-4 bg-[#231F1C] border-t border-[#362E29] flex items-center justify-between text-xs text-[#A89885] z-20">
        <span className="font-mono">
          Page {currentPage} of {pages.length || '...'}
        </span>

        {viewMode === 'page' && pages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={1}
              max={pages.length}
              value={currentPage}
              onChange={(e) => changePage(parseInt(e.target.value, 10))}
              className="w-32 sm:w-64 accent-cottage-moss-deep"
            />
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage >= pages.length}
              className="p-1 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <span className="hidden sm:inline-block">
          {Math.round((currentPage / (pages.length || 1)) * 100)}% read
        </span>
      </footer>
    </div>
  )
}
