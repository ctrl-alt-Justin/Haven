'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react'

// Dynamically import readers with ssr: false to prevent window / DOM errors during SSR
const EpubReader = dynamic(() => import('@/components/reader/EpubReader'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-cottage-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-cottage-moss-deep border-t-transparent animate-spin" />
        <p className="font-serif text-cottage-bark">Loading EPUB Reader...</p>
      </div>
    </div>
  ),
})

const ComicReader = dynamic(() => import('@/components/reader/ComicReader'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1715] text-[#ECE5D8]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-cottage-moss-deep border-t-transparent animate-spin" />
        <p className="font-serif text-sm">Loading Comic Reader...</p>
      </div>
    </div>
  ),
})

interface SignedUrlData {
  signedUrl: string
  format: 'epub' | 'pdf' | 'cbz' | 'cbr' | 'link'
  title: string
  author: string
}

export default function ReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SignedUrlData | null>(null)
  const [initialProgress, setInitialProgress] = useState<{
    cfi?: string | null
    pageNumber?: number | null
  }>({})

  useEffect(() => {
    if (!bookId) return

    async function fetchBookAndAccess() {
      setLoading(true)
      setError(null)

      try {
        // 1. Fetch signed URL
        const res = await fetch(`/api/library/signed-url?bookId=${bookId}`)
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to obtain access to this title.')
        }
        const signedData = await res.json()
        setData(signedData)

        // 2. Fetch saved reading progress
        const progRes = await fetch(`/api/library/progress?bookId=${bookId}`)
        if (progRes.ok) {
          const progData = await progRes.json()
          if (progData.progress) {
            setInitialProgress({
              cfi: progData.progress.cfi,
              pageNumber: progData.progress.page_number,
            })
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error accessing reading file.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchBookAndAccess()
  }, [bookId])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-cottage-moss-deep border-t-transparent animate-spin" />
        <p className="font-serif text-base text-cottage-bark">
          Retrieving book from our sanctuary shelves...
        </p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-cottage-lg border border-red-200 bg-red-50 p-6 sm:p-8 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="font-serif text-xl font-medium text-red-900">
            Cannot Open Reader
          </h2>
          <p className="text-xs text-red-800 leading-relaxed">
            {error || 'The requested reading file could not be accessed.'}
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-800 hover:bg-red-900 text-white text-xs font-medium shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Library</span>
          </Link>
        </div>
      </div>
    )
  }

  // Render appropriate reader based on format
  if (data.format === 'cbz' || data.format === 'cbr') {
    return (
      <ComicReader
        bookId={bookId}
        title={data.title}
        author={data.author}
        fileUrl={data.signedUrl}
        initialPage={initialProgress.pageNumber}
      />
    )
  }

  // EPUB Reader
  return (
    <EpubReader
      bookId={bookId}
      title={data.title}
      author={data.author}
      fileUrl={data.signedUrl}
      initialCfi={initialProgress.cfi}
    />
  )
}
