export interface FileValidationResult {
  valid: boolean
  error?: string
  format?: 'epub' | 'pdf' | 'cbz'
  mimeType?: string
}

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024 // 100MB max limit

/**
 * Validates the file extension, size, and magic bytes for reading files.
 * Protects against spoofed extensions, path traversals, and corrupted files.
 */
export async function validateReadingFile(
  file: File
): Promise<FileValidationResult> {
  // Check file size
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 100MB limit (size: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    }
  }

  if (file.size < 100) {
    return {
      valid: false,
      error: 'File is too small to be a valid book or comic archive.',
    }
  }

  const name = file.name.toLowerCase()
  const arrayBuffer = await file.slice(0, 1024).arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  // 1. Check for PDF (%PDF-)
  if (name.endsWith('.pdf')) {
    // Magic bytes: 25 50 44 46 (%PDF)
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      return {
        valid: true,
        format: 'pdf',
        mimeType: 'application/pdf',
      }
    }
    return {
      valid: false,
      error: 'File has a .pdf extension but lacks a valid PDF header signature.',
    }
  }

  // 2. Check for EPUB or CBZ (Both are ZIP containers starting with PK\x03\x04 or PK\x05\x06)
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05)

  if (!isZip) {
    return {
      valid: false,
      error: 'File does not have a valid archive or document signature.',
    }
  }

  if (name.endsWith('.epub')) {
    return {
      valid: true,
      format: 'epub',
      mimeType: 'application/epub+zip',
    }
  }

  if (name.endsWith('.cbz') || name.endsWith('.zip')) {
    return {
      valid: true,
      format: 'cbz',
      mimeType: 'application/vnd.comicbook+zip',
    }
  }

  return {
    valid: false,
    error: 'Unsupported file extension. Allowed formats are .epub, .pdf, and .cbz.',
  }
}

/**
 * Sanitizes a filename to prevent path traversal or unsafe characters.
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  const base = filename.replace(/^.*[\\/]/, '').replace(/\0/g, '')
  // Replace unusual characters with hyphens
  return base.replace(/[^a-zA-Z0-9._-]/g, '_')
}
