import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET reading progress and bookshelf status for a book or all user books
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get('bookId')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let query = supabase
    .from('reading_progress')
    .select('*, book:library_books(*)')
    .eq('user_id', user.id)

  if (bookId) {
    query = query.eq('book_id', bookId)
    const { data, error } = await query.maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ progress: data })
  }

  const { data, error } = await query.order('last_read_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ progressList: data || [] })
}

// POST or update private reading progress & status
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    bookId,
    cfi,
    pageNumber,
    totalPages,
    percentage,
    status,
    isFavorite,
  } = body

  if (!bookId) {
    return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {
    user_id: user.id,
    book_id: bookId,
    last_read_at: new Date().toISOString(),
  }

  if (cfi !== undefined) updateData.cfi = cfi
  if (pageNumber !== undefined) updateData.page_number = pageNumber
  if (totalPages !== undefined) updateData.total_pages = totalPages
  if (percentage !== undefined) updateData.percentage = Math.min(100, Math.max(0, percentage))
  if (status !== undefined) updateData.status = status
  if (isFavorite !== undefined) updateData.is_favorite = isFavorite

  const { data, error } = await supabase
    .from('reading_progress')
    .upsert(updateData, { onConflict: 'user_id, book_id' })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, progress: data })
}

// DELETE to remove from personal bookshelf without deleting the shared book
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get('bookId')

  if (!bookId) {
    return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('reading_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('book_id', bookId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
