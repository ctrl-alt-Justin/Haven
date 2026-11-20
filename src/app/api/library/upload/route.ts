import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateReadingFile, sanitizeFilename } from '@/lib/library/validation'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse form data
    const formData = await request.formData()
    const title = (formData.get('title') as string)?.trim()
    const author = (formData.get('author') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null
    const contentType = (formData.get('content_type') as string) || 'book'
    const categoryId = (formData.get('category_id') as string) || null
    const genresRaw = (formData.get('genres') as string) || ''
    const language = (formData.get('language') as string) || 'en'
    const publicationYear = formData.get('publication_year')
      ? parseInt(formData.get('publication_year') as string, 10)
      : null
    const rightsStatus = (formData.get('rights_status') as string) || 'public_domain'
    const licenseName = (formData.get('license_name') as string)?.trim() || null
    const licenseUrl = (formData.get('license_url') as string)?.trim() || null
    const attribution = (formData.get('attribution') as string)?.trim() || null
    const permissionNotes = (formData.get('permission_notes') as string)?.trim() || null
    const recommendationNote = (formData.get('recommendation_note') as string)?.trim() || null
    const externalLink = (formData.get('external_link') as string)?.trim() || null

    if (!title || !author) {
      return NextResponse.json(
        { error: 'Title and author are required fields.' },
        { status: 400 }
      )
    }

    const file = formData.get('file') as File | null
    const coverFile = formData.get('cover_file') as File | null

    let filePath: string | null = null
    let fileSize: number | null = null
    let mimeType: string | null = null
    let format = 'epub'
    let coverUrl: string | null = null

    // 3. Validate and upload file if provided
    if (file && file.size > 0) {
      const validation = await validateReadingFile(file)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }

      format = validation.format || 'epub'
      fileSize = file.size
      mimeType = validation.mimeType || 'application/octet-stream'

      const safeExt = format === 'cbz' ? 'cbz' : format === 'pdf' ? 'pdf' : 'epub'
      const uniqueFileName = `${crypto.randomUUID()}-${sanitizeFilename(file.name)}.${safeExt}`

      // Upload to private library_files bucket
      const { error: uploadError } = await supabase.storage
        .from('library_files')
        .upload(uniqueFileName, file, {
          contentType: mimeType,
          upsert: false,
        })

      if (uploadError) {
        return NextResponse.json(
          { error: `Storage upload failed: ${uploadError.message}` },
          { status: 500 }
        )
      }

      filePath = uniqueFileName
    }

    // 4. Upload cover image if provided
    if (coverFile && coverFile.size > 0) {
      const coverExt = coverFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      const uniqueCoverName = `cover-${crypto.randomUUID()}.${coverExt}`

      const { error: coverUploadError } = await supabase.storage
        .from('library_covers')
        .upload(uniqueCoverName, coverFile, {
          contentType: coverFile.type || 'image/jpeg',
          upsert: false,
        })

      if (!coverUploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('library_covers')
          .getPublicUrl(uniqueCoverName)
        coverUrl = publicUrlData.publicUrl
      }
    }

    // Format genres array
    const genres = genresRaw
      ? genresRaw
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean)
      : []

    // 5. Create database record
    // Public domain, creative commons, author permission, licensed content can be immediately verified
    // Pending verification stays unverified until reviewed
    const isVerified = rightsStatus !== 'pending_verification'

    const { data: newBook, error: dbError } = await supabase
      .from('library_books')
      .insert({
        title,
        author,
        description,
        content_type: contentType,
        format,
        file_path: filePath,
        file_size: fileSize,
        mime_type: mimeType,
        cover_url: coverUrl,
        category_id: categoryId,
        genres,
        language,
        publication_year: publicationYear,
        rights_status: rightsStatus,
        license_name: licenseName,
        license_url: licenseUrl,
        attribution,
        permission_notes: permissionNotes,
        contributor_id: user.id,
        recommendation_note: recommendationNote,
        external_link: externalLink,
        is_verified: isVerified,
      })
      .select('*')
      .single()

    if (dbError) {
      // Clean up uploaded file if DB insert fails
      if (filePath) {
        await supabase.storage.from('library_files').remove([filePath])
      }
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, book: newBook }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error processing upload.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
