-- ==============================================================================
-- A Little Place for Us ♡
-- Initial Database Migration: Schema, Indexes, and Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "pgcrypto";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bio text,
  favorite_quote text,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles visible to authenticated members"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- 2. INVITATIONS (Strict invite-only gate)
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  token text unique not null,
  invited_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.invitations enable row level security;

create policy "Admins can view and manage invitations"
  on public.invitations for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
    )
  );

-- 3. SHARED SPACES
create table if not exists public.shared_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'A Little Place for Us',
  motto text default 'Our gentle sanctuary',
  theme_settings jsonb not null default '{"palette": "cottagecore", "ambient_sound": "rain"}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.shared_spaces enable row level security;

create policy "Authenticated users can view shared spaces"
  on public.shared_spaces for select
  to authenticated
  using (true);

create policy "Authenticated users can update shared spaces"
  on public.shared_spaces for update
  to authenticated
  using (true)
  with check (true);

-- 4. LIBRARY CATEGORIES
create table if not exists public.library_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('book', 'comic')),
  description text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.library_categories enable row level security;

create policy "Authenticated members can view categories"
  on public.library_categories for select
  to authenticated
  using (true);

create policy "Authenticated members can insert categories"
  on public.library_categories for insert
  to authenticated
  with check (true);

-- 5. LIBRARY BOOKS & COMICS
create table if not exists public.library_books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  description text,
  format text not null check (format in ('epub', 'pdf', 'cbz', 'cbr', 'link')),
  file_path text,
  file_size bigint,
  mime_type text,
  cover_url text,
  category_id uuid references public.library_categories(id) on delete set null,
  genres text[] not null default '{}'::text[],
  rights_status text not null default 'public_domain' check (
    rights_status in ('public_domain', 'creative_commons', 'author_permission', 'licensed_content', 'pending_verification')
  ),
  license_details text,
  attribution text,
  contributor_id uuid not null references auth.users(id) on delete cascade,
  recommendation_note text,
  external_link text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.library_books enable row level security;

-- Only verified items or items uploaded by the contributor are visible
create policy "Books visible to authenticated members"
  on public.library_books for select
  to authenticated
  using (is_verified = true or (select auth.uid()) = contributor_id);

create policy "Users can contribute books"
  on public.library_books for insert
  to authenticated
  with check ((select auth.uid()) = contributor_id);

create policy "Contributors can update their own books"
  on public.library_books for update
  to authenticated
  using ((select auth.uid()) = contributor_id)
  with check ((select auth.uid()) = contributor_id);

create policy "Contributors can delete their own books"
  on public.library_books for delete
  to authenticated
  using ((select auth.uid()) = contributor_id);

-- 6. READING PROGRESS (Strictly private)
create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.library_books(id) on delete cascade,
  cfi text,
  page_number int,
  total_pages int,
  percentage numeric(5,2) not null default 0,
  last_read_at timestamptz not null default now(),
  constraint unique_user_book_progress unique (user_id, book_id)
);

alter table public.reading_progress enable row level security;

create policy "Private reading progress select"
  on public.reading_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Private reading progress insert"
  on public.reading_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Private reading progress update"
  on public.reading_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Private reading progress delete"
  on public.reading_progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 7. BOOKMARKS (Strictly private)
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.library_books(id) on delete cascade,
  location text not null,
  label text,
  created_at timestamptz not null default now()
);

alter table public.bookmarks enable row level security;

create policy "Private bookmarks select"
  on public.bookmarks for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Private bookmarks insert"
  on public.bookmarks for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Private bookmarks delete"
  on public.bookmarks for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 8. HIGHLIGHTS (Strictly private)
create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.library_books(id) on delete cascade,
  cfi_range text not null,
  highlighted_text text not null,
  color text not null default 'sage',
  created_at timestamptz not null default now()
);

alter table public.highlights enable row level security;

create policy "Private highlights select"
  on public.highlights for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Private highlights insert"
  on public.highlights for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Private highlights delete"
  on public.highlights for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 9. READING NOTES (Private by default, optionally shared)
create table if not exists public.reading_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.library_books(id) on delete cascade,
  chapter text,
  content text not null,
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reading_notes enable row level security;

create policy "Notes select if owner or explicitly shared"
  on public.reading_notes for select
  to authenticated
  using ((select auth.uid()) = user_id or is_shared = true);

create policy "Notes insert by owner"
  on public.reading_notes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Notes update by owner"
  on public.reading_notes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Notes delete by owner"
  on public.reading_notes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 10. MUSIC ITEMS
create table if not exists public.music_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  artist text not null,
  platform text not null check (platform in ('spotify', 'youtube', 'other')),
  url text not null,
  personal_note text,
  collection_name text not null default 'Our Favorites',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.music_items enable row level security;

create policy "Music items select by authenticated members"
  on public.music_items for select
  to authenticated
  using (true);

create policy "Music items insert by member"
  on public.music_items for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Music items update by owner"
  on public.music_items for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Music items delete by owner"
  on public.music_items for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 11. SCRAPBOOK ENTRIES
create table if not exists public.scrapbook_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_type text not null check (entry_type in ('photo', 'screenshot', 'quote', 'note', 'memory', 'link')),
  title text,
  content text,
  media_url text,
  visibility text not null default 'shared' check (visibility in ('personal', 'shared')),
  created_at timestamptz not null default now()
);

alter table public.scrapbook_entries enable row level security;

create policy "Scrapbook select if owner or shared"
  on public.scrapbook_entries for select
  to authenticated
  using ((select auth.uid()) = user_id or visibility = 'shared');

create policy "Scrapbook insert by owner"
  on public.scrapbook_entries for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Scrapbook update by owner"
  on public.scrapbook_entries for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Scrapbook delete by owner"
  on public.scrapbook_entries for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 12. PRIVATE ENTRIES (The Hideaway - Strictly confidential)
create table if not exists public.private_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  tags text[] not null default '{}'::text[],
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.private_entries enable row level security;

create policy "Private entries select only owner"
  on public.private_entries for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Private entries insert only owner"
  on public.private_entries for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Private entries update only owner"
  on public.private_entries for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Private entries delete only owner"
  on public.private_entries for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 13. USER PREFERENCES
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  font_size text not null default 'normal',
  font_family text not null default 'serif',
  reading_theme text not null default 'parchment',
  ambient_sound_volume numeric(3,2) not null default 0.50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "User preferences select only owner"
  on public.user_preferences for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "User preferences insert only owner"
  on public.user_preferences for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "User preferences update only owner"
  on public.user_preferences for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & RELIABILITY
-- ==============================================================================
create index if not exists idx_library_books_category on public.library_books(category_id);
create index if not exists idx_library_books_contributor on public.library_books(contributor_id);
create index if not exists idx_reading_progress_user on public.reading_progress(user_id);
create index if not exists idx_reading_progress_book on public.reading_progress(book_id);
create index if not exists idx_bookmarks_user_book on public.bookmarks(user_id, book_id);
create index if not exists idx_highlights_user_book on public.highlights(user_id, book_id);
create index if not exists idx_reading_notes_book on public.reading_notes(book_id);
create index if not exists idx_music_items_user on public.music_items(user_id);
create index if not exists idx_scrapbook_user on public.scrapbook_entries(user_id);
create index if not exists idx_scrapbook_visibility on public.scrapbook_entries(visibility);
create index if not exists idx_private_entries_user on public.private_entries(user_id);

-- ==============================================================================
-- SEED DATA: CATEGORIES FOR BOOKS AND COMICS
-- ==============================================================================
insert into public.library_categories (name, slug, type, description, display_order)
values
  ('Light Novels', 'light-novels', 'book', 'Japanese & translated light novel stories', 1),
  ('Fantasy', 'fantasy', 'book', 'Magical worlds, folklore, and mythical journeys', 2),
  ('Romance', 'romance', 'book', 'Tender stories of warmth, connection, and affection', 3),
  ('Mystery', 'mystery', 'book', 'Gentle riddles, puzzles, and cosy whodunits', 4),
  ('Adventure', 'adventure', 'book', 'Expeditions, nature discoveries, and journeys', 5),
  ('Contemporary Fiction', 'contemporary-fiction', 'book', 'Modern stories of life, friendship, and quiet moments', 6),
  ('Classics', 'classics', 'book', 'Timeless literary treasures from the public domain', 7),
  ('Short Stories', 'short-stories', 'book', 'Bite-sized tales perfect for evening reading', 8),
  ('Poetry', 'poetry', 'book', 'Reflective verses, pastoral poems, and thoughts', 9),
  ('Manga', 'manga', 'comic', 'Japanese graphic novels and sequential art', 10),
  ('Manhwa', 'manhwa', 'comic', 'Korean full-colour webtoons and comic series', 11),
  ('Manhua', 'manhua', 'comic', 'Chinese illustrated narratives and web series', 12),
  ('Western Comics', 'western-comics', 'comic', 'Classic and indie illustrated books', 13),
  ('Graphic Novels', 'graphic-novels', 'comic', 'Long-form complete visual storytelling', 14),
  ('Webcomics', 'webcomics', 'comic', 'Independent episodic digital strips', 15)
on conflict (slug) do nothing;

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Private & Controlled Access)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values
  ('library_files', 'library_files', false),
  ('library_covers', 'library_covers', true),
  ('scrapbook_media', 'scrapbook_media', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage RLS: library_files (private, signed URLs or authenticated members)
create policy "Authenticated members can view library files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'library_files');

create policy "Authenticated members can upload library files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'library_files');

-- Storage RLS: library_covers (publicly viewable, upload by auth)
create policy "Public can view book covers"
  on storage.objects for select
  to public
  using (bucket_id = 'library_covers');

create policy "Authenticated members can upload covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'library_covers');

-- Storage RLS: scrapbook_media
create policy "Authenticated members can view scrapbook media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'scrapbook_media');

create policy "Authenticated members can upload scrapbook media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'scrapbook_media');

-- Storage RLS: avatars
create policy "Public can view avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');
