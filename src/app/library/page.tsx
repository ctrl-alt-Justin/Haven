'use client'

import { useState } from 'react'
import {
  BookOpen,
  Search,
  Filter,
  PlusCircle,
  FileText,
  ShieldCheck,
  ExternalLink,
  BookMarked,
  Heart,
  Info,
  Sparkles,
  Layers,
  ChevronRight,
  Upload,
} from 'lucide-react'

// Demo categories based on project specification
const BOOK_CATEGORIES = [
  'All Books',
  'Light Novels',
  'Fantasy',
  'Romance',
  'Mystery',
  'Adventure',
  'Contemporary Fiction',
  'Classics',
  'Short Stories',
  'Poetry',
]

const COMIC_CATEGORIES = [
  'All Comics',
  'Manga',
  'Manhwa',
  'Manhua',
  'Western Comics',
  'Graphic Novels',
  'Webcomics',
]

// Sample initial legal/public domain catalogue items
const SAMPLE_CATALOGUE = [
  {
    id: '1',
    title: 'Anne of Green Gables',
    author: 'L. M. Montgomery',
    category: 'Classics',
    type: 'book',
    format: 'EPUB',
    rightsStatus: 'public_domain',
    rightsLabel: 'Public Domain',
    description:
      'The heartwarming story of Anne Shirley, an imaginative, talkative red-headed orphan sent to Prince Edward Island.',
    coverBg: 'from-amber-100 to-emerald-100',
    genres: ['Classics', 'Pastoral', 'Romance'],
    recommendation: 'Perfect for cozy autumn evenings with tea.',
  },
  {
    id: '2',
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    category: 'Adventure',
    type: 'book',
    format: 'EPUB',
    rightsStatus: 'public_domain',
    rightsLabel: 'Public Domain',
    description:
      'A young girl discovers a locked, neglected garden and helps it bloom alongside newfound friends.',
    coverBg: 'from-emerald-100 to-green-200',
    genres: ['Adventure', 'Nature', 'Classics'],
    recommendation: 'Reminds me of our own quiet sanctuary.',
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    type: 'book',
    format: 'EPUB',
    rightsStatus: 'public_domain',
    rightsLabel: 'Public Domain',
    description:
      'The turbulent relationship between Elizabeth Bennet and Fitzwilliam Darcy in 19th-century England.',
    coverBg: 'from-rose-100 to-pink-100',
    genres: ['Romance', 'Historical', 'Classics'],
    recommendation: 'A timeless treasure to read together.',
  },
  {
    id: '4',
    title: 'Pepper & Carrot (Episodic Comic)',
    author: 'David Revoy',
    category: 'Webcomics',
    type: 'comic',
    format: 'CBZ',
    rightsStatus: 'creative_commons',
    rightsLabel: 'Creative Commons (CC-BY 4.0)',
    description:
      'A gentle, beautifully illustrated comedy comic about a young witch, Pepper, and her playful cat, Carrot.',
    coverBg: 'from-orange-100 to-yellow-100',
    genres: ['Webcomics', 'Fantasy', 'Humour'],
    recommendation: 'Charming artwork and lovely wholesome stories.',
  },
]

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'comics' | 'myshelf'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Filter items
  const filteredItems = SAMPLE_CATALOGUE.filter((item) => {
    if (activeTab === 'books' && item.type !== 'book') return false
    if (activeTab === 'comics' && item.type !== 'comic') return false
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.author.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-8">
      {/* Header & Milestone Status Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cottage-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cottage-sage/50 text-cottage-moss-deep text-xs font-medium mb-2 border border-cottage-moss/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Highest Priority Room</span>
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
            className="flex items-center gap-2 bg-cottage-moss-deep hover:bg-cottage-bark text-cottage-cream-light px-4 py-2 rounded-full text-sm font-medium shadow-soft transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add a Title</span>
          </button>
        </div>
      </div>

      {/* Architecture Transparency Banner */}
      <div className="rounded-cottage border border-cottage-moss/40 bg-cottage-sage/30 p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-cottage-brown">
        <Info className="w-5 h-5 text-cottage-moss-deep shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-cottage-bark">
            Milestone 1 Foundation Active: Catalogue & Rights Architecture
          </p>
          <p className="leading-relaxed">
            This establishes the shared catalogue, category taxonomy, rights verification metadata, and upload pipeline.
            In <strong>Milestone 2</strong>, the embedded <strong>EPUB.js</strong> engine and custom continuous-scroll <strong>Comic Reader (CBZ/CBR)</strong> will be connected directly to private Supabase Storage buckets.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center p-1 rounded-full bg-cottage-cream-light border border-cottage-border shadow-xs">
          <button
            onClick={() => {
              setActiveTab('all')
              setSelectedCategory('All')
            }}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeTab === 'all'
                ? 'bg-cottage-sage text-cottage-bark font-semibold shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            All Titles
          </button>
          <button
            onClick={() => {
              setActiveTab('books')
              setSelectedCategory('All')
            }}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeTab === 'books'
                ? 'bg-cottage-sage text-cottage-bark font-semibold shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            Books & Light Novels
          </button>
          <button
            onClick={() => {
              setActiveTab('comics')
              setSelectedCategory('All')
            }}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeTab === 'comics'
                ? 'bg-cottage-sage text-cottage-bark font-semibold shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            Comics & Graphic Novels
          </button>
          <button
            onClick={() => setActiveTab('myshelf')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeTab === 'myshelf'
                ? 'bg-cottage-sage text-cottage-bark font-semibold shadow-xs'
                : 'text-cottage-brown hover:text-cottage-bark'
            }`}
          >
            My Private Shelf
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cottage-brown" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cottage-cream-light border border-cottage-border rounded-full pl-9 pr-4 py-1.5 text-xs sm:text-sm text-cottage-bark placeholder:text-cottage-brown/60 focus:outline-none focus:border-cottage-moss-deep"
          />
        </div>
      </div>

      {/* Category Pills (Sub-filters) */}
      {activeTab !== 'myshelf' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border transition ${
              selectedCategory === 'All'
                ? 'bg-cottage-moss-deep text-cottage-cream-light border-cottage-moss-deep font-medium'
                : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
            }`}
          >
            All Genres
          </button>
          {(activeTab === 'comics' ? COMIC_CATEGORIES : BOOK_CATEGORIES)
            .filter((c) => !c.startsWith('All'))
            .map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border transition ${
                  selectedCategory === cat
                    ? 'bg-cottage-moss-deep text-cottage-cream-light border-cottage-moss-deep font-medium'
                    : 'bg-cottage-cream-light text-cottage-brown border-cottage-border hover:bg-cottage-cream'
                }`}
              >
                {cat}
              </button>
            ))}
        </div>
      )}

      {/* View: My Private Shelf Tab */}
      {activeTab === 'myshelf' ? (
        <div className="space-y-6">
          <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light p-6 space-y-4">
            <h2 className="font-serif text-xl font-medium text-cottage-bark flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-cottage-moss-deep" />
              <span>Your Personal Reading Corner</span>
            </h2>
            <p className="text-xs sm:text-sm text-cottage-brown leading-relaxed">
              Your bookmarks, reading percentages, highlights, and thoughts are kept completely private via Supabase Row Level Security.
              Neither account can view the other&apos;s progress unless a note is explicitly marked as shared.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light/80 p-5 space-y-3">
              <span className="text-xs font-semibold text-cottage-brown uppercase tracking-wider">
                Currently Reading (Private)
              </span>
              <div className="flex items-center gap-4">
                <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-emerald-100 border border-cottage-border flex items-center justify-center font-serif text-xs text-cottage-bark shadow-xs">
                  Anne
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-serif font-medium text-cottage-bark">Anne of Green Gables</h4>
                  <p className="text-xs text-cottage-brown">Chapter 4 — Morning at Green Gables</p>
                  <div className="w-full bg-cottage-border/50 rounded-full h-2 mt-2">
                    <div className="bg-cottage-moss-deep h-2 rounded-full w-[42%]" />
                  </div>
                  <span className="text-[10px] text-cottage-brown block text-right">42% completed</span>
                </div>
              </div>
            </div>

            <div className="rounded-cottage border border-cottage-border bg-cottage-cream-light/80 p-5 space-y-3">
              <span className="text-xs font-semibold text-cottage-brown uppercase tracking-wider">
                Private Bookmarks & Notes
              </span>
              <div className="space-y-2 text-xs text-cottage-brown">
                <div className="p-2.5 rounded-lg bg-cottage-cream border border-cottage-border/60">
                  <span className="font-medium text-cottage-bark block">Page 84 — The White Way of Delight</span>
                  <p className="text-[11px] text-cottage-brown-light italic mt-0.5">
                    &ldquo;Dear old world, you are very lovely, and I am glad to be alive in you.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Catalogue Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-cottage border border-cottage-border bg-cottage-cream-light p-5 flex flex-col justify-between hover:shadow-card hover:border-cottage-moss/60 transition-all"
            >
              <div className="space-y-4">
                {/* Book Card Top: Format & Rights */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-cottage-moss-deep bg-cottage-sage/50 px-2.5 py-0.5 rounded-full border border-cottage-moss/30">
                    {item.format}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-cottage-brown bg-cottage-cream px-2 py-0.5 rounded-full border border-cottage-border">
                    <ShieldCheck className="w-3 h-3 text-cottage-moss-deep" />
                    <span>{item.rightsLabel}</span>
                  </span>
                </div>

                {/* Cover and details */}
                <div className="flex gap-4">
                  <div
                    className={`w-20 h-28 rounded-lg bg-gradient-to-br ${item.coverBg} border border-cottage-border/80 flex flex-col items-center justify-center p-2 text-center shadow-xs shrink-0`}
                  >
                    <BookOpen className="w-5 h-5 text-cottage-bark/60 mb-1" />
                    <span className="font-serif text-[11px] font-bold text-cottage-bark leading-tight line-clamp-2">
                      {item.title}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-medium text-cottage-bark group-hover:text-cottage-moss-deep transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-cottage-brown font-medium">by {item.author}</p>
                    <p className="text-xs text-cottage-brown/80 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Recommendation note */}
                {item.recommendation && (
                  <div className="p-2.5 rounded-xl bg-cottage-cream border border-cottage-border/60 text-[11px] text-cottage-brown italic flex items-start gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-cottage-rose-dark shrink-0 mt-0.5" />
                    <span>&ldquo;{item.recommendation}&rdquo;</span>
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="pt-4 mt-4 border-t border-cottage-border/50 flex items-center justify-between text-xs">
                <span className="text-cottage-brown">{item.category}</span>
                <button
                  onClick={() => alert(`Reader engine for ${item.title} (${item.format}) will be connected in Milestone 2!`)}
                  className="flex items-center gap-1 font-medium text-cottage-moss-deep hover:text-cottage-bark bg-cottage-sage/40 hover:bg-cottage-sage px-3 py-1.5 rounded-full border border-cottage-moss/30 transition"
                >
                  <span>Open in Reader</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload & Rights Verification Modal Preview */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 bg-cottage-bark/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-cottage-cream rounded-cottage-lg border border-cottage-border shadow-lifted max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-cottage-border/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-cottage-sage text-cottage-moss-deep">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-cottage-bark">
                    Contribute to Our Library
                  </h3>
                  <p className="text-xs text-cottage-brown">
                    Share a legally permitted book or comic
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-xs text-cottage-brown hover:text-cottage-bark p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-cottage-sage/30 border border-cottage-moss/30 text-xs text-cottage-brown space-y-1">
                <p className="font-semibold text-cottage-bark flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-cottage-moss-deep" />
                  <span>Content Rights & Compliance</span>
                </p>
                <p>
                  Only upload titles that are in the public domain, under Creative Commons, or with explicit author permission. We do not pirate or redistribute commercial publications.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-cottage-bark block">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Anne of Green Gables"
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-cottage-bark block">Author</label>
                <input
                  type="text"
                  placeholder="e.g. L. M. Montgomery"
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-medium text-cottage-bark block">Format</label>
                  <select className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep">
                    <option value="epub">EPUB (Reflowable text)</option>
                    <option value="cbz">CBZ (Comic archive)</option>
                    <option value="cbr">CBR (Comic rar archive)</option>
                    <option value="pdf">PDF (Fixed layout)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-cottage-bark block">Rights Status</label>
                  <select className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2 text-xs focus:outline-none focus:border-cottage-moss-deep">
                    <option value="public_domain">Public Domain</option>
                    <option value="creative_commons">Creative Commons</option>
                    <option value="author_permission">Author Permission</option>
                    <option value="licensed_content">Licensed Content</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-cottage-bark block">File Attachment</label>
                <div className="border-2 border-dashed border-cottage-border rounded-xl p-4 text-center bg-cottage-cream-light/50 hover:bg-cottage-cream-light transition cursor-pointer">
                  <Upload className="w-6 h-6 text-cottage-brown mx-auto mb-1" />
                  <p className="text-xs text-cottage-bark font-medium">Select file (EPUB, CBZ, PDF)</p>
                  <p className="text-[10px] text-cottage-brown mt-0.5">Stored in private Supabase Storage bucket</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-cottage-bark block">Optional Recommendation</label>
                <textarea
                  rows={2}
                  placeholder="Why do you think we will love this story? ♡"
                  className="w-full rounded-lg border border-cottage-border bg-cottage-cream-light p-2.5 text-xs focus:outline-none focus:border-cottage-moss-deep"
                />
              </div>
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
                type="button"
                onClick={() => {
                  alert('Upload verification pipeline registered for Milestone 2 implementation!')
                  setShowUploadModal(false)
                }}
                className="px-5 py-2 rounded-full text-xs font-medium bg-cottage-moss-deep text-cottage-cream-light hover:bg-cottage-bark shadow-xs transition"
              >
                Submit Title
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
