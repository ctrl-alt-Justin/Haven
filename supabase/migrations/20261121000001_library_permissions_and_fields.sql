-- ==============================================================================
-- A Little Place for Us ♡
-- Migration: Library Permissions Correction & Phase 2 Schema Extensions
-- ==============================================================================

-- 1. Helper function: verify sanctuary membership
create or replace function public.is_sanctuary_member(lookup_user_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = lookup_user_id
    and role in ('admin', 'member')
  );
$$;

-- 2. Add missing metadata fields to library_books
alter table public.library_books 
  add column if not exists content_type text not null default 'book' 
    check (content_type in ('book', 'light_novel', 'manga', 'manhwa', 'manhua', 'comic', 'graphic_novel', 'webcomic')),
  add column if not exists language text not null default 'en',
  add column if not exists publication_year int,
  add column if not exists license_name text,
  add column if not exists license_url text,
  add column if not exists permission_notes text;

-- 3. Add personal bookshelf status and favorite fields to reading_progress
alter table public.reading_progress
  add column if not exists status text not null default 'currently_reading'
    check (status in ('currently_reading', 'want_to_read', 'finished')),
  add column if not exists is_favorite boolean not null default false;

-- 4. Correct library_books RLS: Both authorized sanctuary users can collaborate!
drop policy if exists "Books visible to authenticated members" on public.library_books;
drop policy if exists "Users can contribute books" on public.library_books;
drop policy if exists "Contributors can update their own books" on public.library_books;
drop policy if exists "Contributors can delete their own books" on public.library_books;

create policy "Books visible to sanctuary members"
  on public.library_books for select
  to authenticated
  using (
    public.is_sanctuary_member((select auth.uid()))
    and (is_verified = true or (select auth.uid()) = contributor_id)
  );

create policy "Sanctuary members can contribute books"
  on public.library_books for insert
  to authenticated
  with check (
    public.is_sanctuary_member((select auth.uid()))
    and (select auth.uid()) = contributor_id
  );

create policy "Sanctuary members can update shared catalogue"
  on public.library_books for update
  to authenticated
  using (public.is_sanctuary_member((select auth.uid())))
  with check (public.is_sanctuary_member((select auth.uid())));

create policy "Contributors and admins can delete books"
  on public.library_books for delete
  to authenticated
  using (
    public.is_sanctuary_member((select auth.uid()))
    and (
      (select auth.uid()) = contributor_id
      or exists (
        select 1 from public.profiles
        where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
      )
    )
  );

-- 5. Storage RLS: Ensure only authorized sanctuary members can access library files
drop policy if exists "Authenticated members can view library files" on storage.objects;
drop policy if exists "Authenticated members can upload library files" on storage.objects;

create policy "Sanctuary members can view library files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'library_files'
    and public.is_sanctuary_member((select auth.uid()))
  );

create policy "Sanctuary members can upload library files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'library_files'
    and public.is_sanctuary_member((select auth.uid()))
  );
