export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  favorite_quote: string | null
  role: 'admin' | 'member'
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: string
  email: string
  token: string
  invited_by: string | null
  status: 'pending' | 'accepted' | 'revoked'
  expires_at: string
  created_at: string
}

export interface SharedSpace {
  id: string
  name: string
  motto: string | null
  theme_settings: Record<string, unknown>
  created_at: string
}

export interface LibraryCategory {
  id: string
  name: string
  slug: string
  type: 'book' | 'comic'
  description: string | null
  display_order: number
  created_at: string
}

export type BookFormat = 'epub' | 'pdf' | 'cbz' | 'cbr' | 'link'
export type RightsStatus =
  | 'public_domain'
  | 'creative_commons'
  | 'author_permission'
  | 'licensed_content'
  | 'pending_verification'

export interface LibraryBook {
  id: string
  title: string
  author: string
  description: string | null
  format: BookFormat
  file_path: string | null
  file_size: number | null
  mime_type: string | null
  cover_url: string | null
  category_id: string | null
  category?: LibraryCategory
  genres: string[]
  rights_status: RightsStatus
  license_details: string | null
  attribution: string | null
  contributor_id: string
  contributor?: Profile
  recommendation_note: string | null
  external_link: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface ReadingProgress {
  id: string
  user_id: string
  book_id: string
  cfi: string | null
  page_number: number | null
  total_pages: number | null
  percentage: number
  last_read_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  book_id: string
  location: string
  label: string | null
  created_at: string
}

export interface Highlight {
  id: string
  user_id: string
  book_id: string
  cfi_range: string
  highlighted_text: string
  color: string
  created_at: string
}

export interface ReadingNote {
  id: string
  user_id: string
  book_id: string
  chapter: string | null
  content: string
  is_shared: boolean
  created_at: string
  updated_at: string
}

export interface MusicItem {
  id: string
  user_id: string
  title: string
  artist: string
  platform: 'spotify' | 'youtube' | 'other'
  url: string
  personal_note: string | null
  collection_name: string
  is_favorite: boolean
  created_at: string
}

export interface ScrapbookEntry {
  id: string
  user_id: string
  entry_type: 'photo' | 'screenshot' | 'quote' | 'note' | 'memory' | 'link'
  title: string | null
  content: string | null
  media_url: string | null
  visibility: 'personal' | 'shared'
  created_at: string
}

export interface PrivateEntry {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  mood: string | null
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  user_id: string
  font_size: 'small' | 'normal' | 'large' | 'extra-large'
  font_family: 'serif' | 'sans'
  reading_theme: 'parchment' | 'cream' | 'night'
  ambient_sound_volume: number
  created_at: string
  updated_at: string
}
