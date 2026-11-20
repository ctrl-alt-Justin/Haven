import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get('bookId')

  if (!bookId) {
    return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
  }

  const supabase = await createClient()

  // 1. Verify user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Fetch the book record
  const { data: book, error: bookError } = await supabase
    .from('library_books')
    .select('id, title, author, format, file_path, rights_status, is_verified, contributor_id')
    .eq('id', bookId)
    .single()

  if (bookError || !book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  // Check verification or contributor access
  if (!book.is_verified && book.contributor_id !== user.id) {
    return NextResponse.json(
      { error: 'This title is pending rights verification' },
      { status: 403 }
    )
  }

  if (!book.file_path) {
    return NextResponse.json(
      { error: 'No reading file attached to this title' },
      { status: 404 }
    )
  }

  // 3. Generate short-lived signed URL (15 minutes = 900 seconds)
  const { data: signedData, error: signedError } = await supabase.storage
    .from('library_files')
    .createSignedUrl(book.file_path, 900)

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json(
      { error: 'Could not generate signed access URL' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    signedUrl: signedData.signedUrl,
    format: book.format,
    title: book.title,
    author: book.author,
    expiresIn: 900,
  })
}
