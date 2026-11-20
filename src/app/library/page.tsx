'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  PlusCircle,
  ShieldCheck,
  ExternalLink,
  BookMarked,
  Heart,
  Sparkles,
  Upload,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Trash2,
  BookmarkCheck,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type {
  LibraryBook,
  ContentType,
  BookFormat,
  RightsStatus,
  BookshelfStatus,
  ReadingProgress,
} from '@/types/database'

const CONTENT_TYPES: Array<{ id: ContentType | 'all'; label: string }> = [
  { id: 'all', label: 'All Catalogue' },
  { id: 'book', label: 'Books' },
  { id: 'light_novel', label: 'Light Novels' },
  { id: 'manga', label: 'Manga' },
  { id: 'manhwa', label: 'Manhwa' },
  { id: 'manhua', label: 'Manhua' },
  { id: 'comic', label: 'Comics' },
  { id: 'graphic_novel', label: 'Graphic Novels' },
  { id: 'webcomic', label: 'Webcomics' },
]

const FORMAT_FILTERS: Array<{ id: BookFormat | 'all'; label: string }> = [
  { id: 'all', label: 'All Formats' },
  { id: 'epub', label: 'EPUB' },
  { id: 'cbz', label: 'CBZ Comic' },
  { id: 'pdf', label: 'PDF' },
]

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'myshelf'>('catalogue')
  const [books, setBooks] = useState<LibraryBook[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContentType, setSelectedContentType] = useState<ContentType | 'all'>('all')
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | 'all'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent')

  // Personal Shelf State
  const [shelfFilter, setShelfFilter] = useState<BookshelfStatus | 'all' | 'favorites'>('all')
  const [myProgressList, setMyProgressList] = useState<ReadingProgress[]>([])
  const [loadingShelf, setLoadingShelf] = useState(false)

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Form Fields
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [contentType, setContentType] = useState<ContentType>('book')
  const [format, setFormat] = useState<BookFormat>('epub')
  const [genresInput, setGenresInput] = useState('')
  const [language, setLanguage] = useState('en')
  const [publicationYear, setPublicationYear] = useState('')
  const [rightsStatus, setRightsStatus] = useState<RightsStatus>('public_domain')
  const [licenseName, setLicenseName] = useState('')
  const [licenseUrl, setLicenseUrl] = useState('')
  const [attribution, setAttribution] = useState('')
  const [permissionNotes, setPermissionNotes] = useState('')
  const [recommendationNote, setRecommendationNote] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [readingFile, setReadingFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  // Fetch shared books from Supabase
  const fetchCatalogue = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('library_books')
      .select('*, contributor:profiles(*)')

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false })
    } else {
      query = query.order('title', { ascending: true })
    }

    const { data, error } = await query

    if (!error && data) {
      setBooks(data as LibraryBook[])
    }
    setLoading(false)
  }, [sortBy])

  // Fetch personal bookshelf progress
  const fetchMyShelf = useCallback(async () => {
    setLoadingShelf(true)
    try {
      const res = await fetch('/api/library/progress')
      if (res.ok) {
        const json = await res.json()
        setMyProgressList(json.progressList || [])
      }
    } catch {}
    setLoadingShelf(false)
  }, [])

  useEffect(() => {
    fetchCatalogue()
  }, [fetchCatalogue])

  useEffect(() => {
    if (activeTab === 'myshelf') {
      fetchMyShelf()
    }
  }, [activeTab, fetchMyShelf])

  // Filtered catalogue
  const filteredBooks = books.filter((book) => {
    if (selectedContentType !== 'all' && book.content_type !== selectedContentType) return false
    if (selectedFormat !== 'all' && book.format !== selectedFormat) return false
    if (
      searchQuery &&
      !book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !book.author.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  // Filtered personal bookshelf
  const filteredShelf = myProgressList.filter((item) => {
    if (shelfFilter === 'favorites') return item.is_favorite
    if (shelfFilter !== 'all' && item.status !== shelfFilter) return false
    return true
  })

  // Handle Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError(null)
    setUploadSuccess(false)
    setUploadLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('author', author)
      formData.append('description', description)
      formData.append('content_type', contentType)
      formData.append('genres', genresInput)
      formData.append('language', language)
      if (publicationYear) formData.append('publication_year', publicationYear)
      formData.append('rights_status', rightsStatus)
      formData.append('license_name', licenseName)
      formData.append('license_url', licenseUrl)
      formData.append('attribution', attribution)
      formData.append('permission_notes', permissionNotes)
      formData.append('recommendation_note', recommendationNote)
      formData.append('external_link', externalLink)

      if (readingFile) formData.append('file', readingFile)
      if (coverFile) formData.append('cover_file', coverFile)

      const response = await fetch('/api/library/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add title.')
      }

      setUploadSuccess(true)
      setTimeout(() => {
        setShowUploadModal(false)
        setUploadSuccess(false)
        // Reset form
        setTitle('')
        setAuthor('')
        setDescription('')
        setReadingFile(null)
        setCoverFile(null)
        setGenresInput('')
        fetchCatalogue()
      }, 1200)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during upload.'
      setUploadError(msg)
    } finally {
      setUploadLoading(false)
    }
  }

  // Remove from shelf without deleting catalogue book
  const handleRemoveFromShelf = async (bookId: string) => {
    try {
      await fetch(`/api/library/progress?bookId=${bookId}`, {
        method: 'DELETE',
      })
      setMyProgressList((prev) => prev.filter((item) => item.book_id !== bookId))
    } catch {}
  }

  // Toggle Favorite
  const handleToggleFavorite = async (item: ReadingProgress) => {
    try {
      const newFav = !item.is_favorite
      await fetch('/api/library/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: item.book_id,
          isFavorite: newFav,
        }),
      })
      setMyProgressList((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_favorite: newFav } : i))
      )
    } catch {}
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cottage-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cottage-sage/50 text-cottage-moss-deep text-xs font-medium mb-2 border border-cottage-moss/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Phase 2 Reading Platform Active</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-cottage-bark">
            The Library
          </h1>
          <p className="text-sm text-cottage-brown mt-1">
            Our shared sanctuary for legally permitted books, light novels, and comics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-4 py-2 rounded-full text-sm font-medium shadow-soft transition self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add a Title</span>
          </button>
        </div>
      </div>

      {/* Main Tabs: Shared Catalogue vs My Private Shelf */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cottage-border/50 pb-4">
        <div className="flex items-center p-1 rounded-full bg-cottage-cream-light border border-cottage-border shadow-xs">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeTab === 'catalogue'
                ? 'bg-cottage-sage text-cottage-bark font-semibold shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            Shared Catalogue ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('myshelf')}
            className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeTab === 'myshelf'
                ? 'bg-cottage-sage text-cottage-bark font-semibold shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-cottage-moss-deep" />
            <span>My Private Shelf</span>
          </button>
        </div>

        {/* Search Input */}
        {activeTab === 'catalogue' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cottage-brown" />
              <input
                type="text"
                placeholder="Search title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cottage-cream-light border border-cottage-border rounded-full pl-9 pr-4 py-1.5 text-xs sm:text-sm text-cottage-bark placeholder:text-cottage-brown/60 focus:outline-none focus:border-cottage-moss-deep"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-cottage-cream-light border border-cottage-border rounded-full px-3 py-1.5 text-xs text-cottage-brown">
              <ArrowUpDown className="w-3.5 h-3.5 text-cottage-moss-deep" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'title')}
                className="bg-transparent text-cottage-bark focus:outline-none cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* VIEW: CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6">
          {/* Content Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedContentType(type.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap border transition ${
                  selectedContentType === type.id
                    ? 'bg-cottage-moss-deep text-cottage-cream-light border-cottage-moss-deep font-semibold shadow-xs'
                    : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Format Sub-filter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-cottage-brown text-[11px] font-medium mr-1">Format:</span>
            {FORMAT_FILTERS.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  selectedFormat === fmt.id
                    ? 'bg-cottage-sage text-cottage-bark border-cottage-moss font-semibold'
                    : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-56 rounded-cottage border border-cottage-border bg-cottage-cream-light/60 p-5 space-y-4"
                >
                  <div className="h-4 bg-cottage-cream-dark rounded w-1/3" />
                  <div className="flex gap-4">
                    <div className="w-20 h-28 bg-cottage-cream-dark rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-cottage-cream-dark rounded w-3/4" />
                      <div className="h-3 bg-cottage-cream-dark rounded w-1/2" />
                      <div className="h-10 bg-cottage-cream-dark rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBooks.length === 0 && (
            <div className="rounded-cottage-lg border border-cottage-border/80 bg-cottage-cream-light p-10 text-center max-w-md mx-auto space-y-4 shadow-soft">
              <div className="w-14 h-14 mx-auto rounded-full bg-cottage-sage/40 border border-cottage-moss/40 flex items-center justify-center text-cottage-moss-deep">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-medium text-cottage-bark">
                  The Library shelves are quiet
                </h3>
                <p className="text-xs text-cottage-brown leading-relaxed">
                  {searchQuery || selectedContentType !== 'all' || selectedFormat !== 'all'
                    ? 'No titles match your current filter. Try clearing your search.'
                    : 'Be the first to contribute a beloved public domain or permitted book, light novel, or comic.'}
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-5 py-2 rounded-full text-xs font-medium shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Our First Title</span>
              </button>
            </div>
          )}

          {/* Book Cards Grid */}
          {!loading && filteredBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const hasReadingFile = Boolean(book.file_path)

                return (
                  <div
                    key={book.id}
                    className="group rounded-cottage border border-cottage-border bg-cottage-cream-light p-5 flex flex-col justify-between hover:shadow-card hover:border-cottage-moss/60 transition-all"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold uppercase tracking-wider text-cottage-moss-deep bg-cottage-sage/50 px-2.5 py-0.5 rounded-full border border-cottage-moss/30 text-[10px]">
                          {book.format} · {book.content_type.replace('_', ' ')}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-cottage-brown bg-cottage-cream px-2 py-0.5 rounded-full border border-cottage-border">
                          <ShieldCheck className="w-3 h-3 text-cottage-moss-deep" />
                          <span className="capitalize">{book.rights_status.replace('_', ' ')}</span>
                        </span>
                      </div>

                      {/* Cover & Info */}
                      <div className="flex gap-4">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded-lg border border-cottage-border/80 shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-amber-100 to-emerald-100 border border-cottage-border/80 flex flex-col items-center justify-center p-2 text-center shadow-xs shrink-0">
                            <BookOpen className="w-5 h-5 text-cottage-bark/60 mb-1" />
                            <span className="font-serif text-[11px] font-bold text-cottage-bark leading-tight line-clamp-2">
                              {book.title}
                            </span>
                          </div>
                        )}

                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="font-serif text-lg font-medium text-cottage-bark group-hover:text-cottage-moss-deep transition-colors leading-snug line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-xs text-cottage-brown font-medium">by {book.author}</p>
                          {book.description && (
                            <p className="text-xs text-cottage-brown/80 line-clamp-2 leading-relaxed pt-1">
                              {book.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Personal Recommendation note if attached */}
                      {book.recommendation_note && (
                        <div className="p-2.5 rounded-xl bg-cottage-cream border border-cottage-border/60 text-[11px] text-cottage-brown italic flex items-start gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-cottage-rose-dark shrink-0 mt-0.5" />
                          <span className="line-clamp-2">&ldquo;{book.recommendation_note}&rdquo;</span>
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-4 mt-4 border-t border-cottage-border/50 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-cottage-brown truncate max-w-[120px]">
                        {book.language ? book.language.toUpperCase() : 'EN'}
                        {book.publication_year ? ` · ${book.publication_year}` : ''}
                      </span>

                      {hasReadingFile ? (
                        <Link
                          href={`/library/reader/${book.id}`}
                          className="flex items-center gap-1 font-medium text-cottage-cream-light bg-cottage-moss-deep hover:bg-cottage-bark px-3.5 py-1.5 rounded-full shadow-xs transition"
                        >
                          <span>Read Now</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : book.external_link ? (
                        <a
                          href={book.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-medium text-cottage-bark bg-cottage-cream hover:bg-cottage-cream-dark px-3 py-1.5 rounded-full border border-cottage-border transition"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-cottage-brown-light italic">
                          Reference title
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: MY PRIVATE SHELF */}
      {activeTab === 'myshelf' && (
        <div className="space-y-6">
          <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 space-y-2">
            <h2 className="font-serif text-xl font-medium text-cottage-bark flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-cottage-moss-deep" />
              <span>Your Personal Bookshelf & Reading Progress</span>
            </h2>
            <p className="text-xs sm:text-sm text-cottage-brown leading-relaxed">
              Your bookmarks, reading percentages, and personal lists are strictly private.
              Database Row Level Security guarantees that neither account can view the other&apos;s personal reading activity.
            </p>
          </div>

          {/* Bookshelf Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Shelved' },
              { id: 'currently_reading', label: 'Currently Reading' },
              { id: 'want_to_read', label: 'Want to Read' },
              { id: 'finished', label: 'Finished' },
              { id: 'favorites', label: 'Favorites ♡' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setShelfFilter(f.id as BookshelfStatus | 'all' | 'favorites')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                  shelfFilter === f.id
                    ? 'bg-cottage-moss-deep text-cottage-cream-light border-cottage-moss-deep'
                    : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loadingShelf && (
            <div className="text-center py-12 text-xs text-cottage-brown">
              Loading your quiet shelf...
            </div>
          )}

          {!loadingShelf && filteredShelf.length === 0 && (
            <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-8 text-center space-y-2 max-w-sm mx-auto">
              <BookOpen className="w-8 h-8 text-cottage-brown mx-auto" />
              <p className="font-serif text-base text-cottage-bark">No titles on this shelf yet</p>
              <p className="text-xs text-cottage-brown">
                Start reading any book in the Shared Catalogue to track your personal reading progress here.
              </p>
            </div>
          )}

          {!loadingShelf && filteredShelf.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredShelf.map((item) => (
                <div
                  key={item.id}
                  className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-5 flex flex-col justify-between space-y-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cottage-sage/50 text-cottage-moss-deep">
                          {item.status.replace('_', ' ')}
                        </span>
                        {item.is_favorite && (
                          <Heart className="w-3.5 h-3.5 text-cottage-rose-dark fill-cottage-rose/60" />
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-medium text-cottage-bark leading-snug">
                        {item.book?.title || 'Untitled Book'}
                      </h4>
                      <p className="text-xs text-cottage-brown">by {item.book?.author || 'Unknown'}</p>
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(item)}
                      title={item.is_favorite ? 'Remove Favorite' : 'Mark Favorite'}
                      className="p-1.5 rounded-full hover:bg-black/5 text-cottage-brown"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          item.is_favorite ? 'text-cottage-rose-dark fill-cottage-rose/60' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Progress percentage bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-cottage-brown">
                      <span>Reading Progress</span>
                      <span className="font-mono font-medium">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-cottage-border/50 rounded-full h-2">
                      <div
                        className="bg-cottage-moss-deep h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-cottage-border/40 text-xs">
                    <button
                      onClick={() => handleRemoveFromShelf(item.book_id)}
                      className="flex items-center gap-1 text-[11px] text-red-700 hover:text-red-900 transition"
                      title="Remove from your private shelf (keeps shared book in catalogue)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from shelf</span>
                    </button>

                    <Link
                      href={`/library/reader/${item.book_id}`}
                      className="flex items-center gap-1 font-medium bg-cottage-sage hover:bg-cottage-moss/60 text-cottage-bark px-3.5 py-1.5 rounded-full transition"
                    >
                      <span>Continue Reading</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD A TITLE UPLOAD MODAL */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 bg-cottage-bark/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-cottage-cream rounded-cottage-lg border border-cottage-border shadow-lifted max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-cottage-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-cottage-sage text-cottage-moss-deep">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-cottage-bark">
                    Contribute to Our Library
                  </h3>
                  <p className="text-xs text-cottage-brown">
                    Both members can contribute and curate shared books & comics ♡
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-xs text-cottage-brown hover:text-cottage-bark p-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            {/* Rights warning / compliance box */}
            <div className="p-3.5 rounded-xl bg-cottage-sage/30 border border-cottage-moss/30 text-xs text-cottage-brown space-y-1">
              <p className="font-semibold text-cottage-bark flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cottage-moss-deep" />
                <span>Legally Permitted Content Only</span>
              </p>
              <p className="leading-relaxed text-[11px]">
                We only host content we have lawful permission to distribute: Public Domain (assessed for applicable jurisdictions), Creative Commons, or with explicit author permission. We never scrape or redistribute paid Kindle purchases, copyrighted manga, or manhwa.
              </p>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>Title contributed successfully to our shared sanctuary!</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anne of Green Gables"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Author *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. L. M. Montgomery"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentType)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  >
                    <option value="book">Book</option>
                    <option value="light_novel">Light Novel</option>
                    <option value="manga">Manga</option>
                    <option value="manhwa">Manhwa</option>
                    <option value="manhua">Manhua</option>
                    <option value="comic">Comic</option>
                    <option value="graphic_novel">Graphic Novel</option>
                    <option value="webcomic">Webcomic</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Rights Status</label>
                  <select
                    value={rightsStatus}
                    onChange={(e) => setRightsStatus(e.target.value as RightsStatus)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  >
                    <option value="public_domain">Public Domain</option>
                    <option value="creative_commons">Creative Commons</option>
                    <option value="author_permission">Author Permission</option>
                    <option value="licensed_content">Licensed Content</option>
                    <option value="pending_verification">Pending Verification</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Language</label>
                  <input
                    type="text"
                    placeholder="e.g. en, ja, ko"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Genres / Tags</label>
                  <input
                    type="text"
                    placeholder="e.g. Classics, Romance, Pastoral (comma separated)"
                    value={genresInput}
                    onChange={(e) => setGenresInput(e.target.value)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">Publication Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 1908"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-cottage-bark block">Description</label>
                <textarea
                  rows={2}
                  placeholder="A short gentle synopsis..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              {/* File Attachment & Cover Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">
                    Reading File (.epub, .cbz, .pdf)
                  </label>
                  <input
                    type="file"
                    accept=".epub,.cbz,.zip,.pdf"
                    onChange={(e) => setReadingFile(e.target.files?.[0] || null)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-1.5 text-xs focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-xs file:bg-cottage-sage file:text-cottage-bark"
                  />
                  <p className="text-[10px] text-cottage-brown">Max 100MB. Stored in private bucket.</p>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">
                    Cover Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-1.5 text-xs focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-xs file:bg-cottage-sage file:text-cottage-bark"
                  />
                  <p className="text-[10px] text-cottage-brown">JPG, PNG, WebP cover art</p>
                </div>
              </div>

              {/* Rights & Licensing Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">License Name / Details</label>
                  <input
                    type="text"
                    placeholder="e.g. CC BY-SA 4.0 or Gutenberg Public Domain"
                    value={licenseName}
                    onChange={(e) => setLicenseName(e.target.value)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-cottage-bark block">License / Permission URL</label>
                  <input
                    type="url"
                    placeholder="https://creativecommons.org/..."
                    value={licenseUrl}
                    onChange={(e) => setLicenseUrl(e.target.value)}
                    className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                  />
                </div>
              </div>

              {/* Personal Recommendation note */}
              <div className="space-y-1">
                <label className="font-medium text-cottage-bark block">
                  Personal Recommendation Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Why do you think we will love this story? ♡"
                  value={recommendationNote}
                  onChange={(e) => setRecommendationNote(e.target.value)}
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              {/* External link (Kindle, official publisher) */}
              <div className="space-y-1">
                <label className="font-medium text-cottage-bark block">
                  External Reference Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://amazon.com/dp/... or official reader URL"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cottage-border/60">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-cottage-brown hover:bg-cottage-cream-dark/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-5 py-2 rounded-full text-xs font-medium bg-cottage-moss-deep text-cottage-cream-light hover:bg-cottage-bark shadow-xs transition disabled:opacity-50"
                >
                  {uploadLoading ? 'Uploading & Verifying...' : 'Contribute Title'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
