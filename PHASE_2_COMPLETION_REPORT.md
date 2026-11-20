# Phase 2 Completion Report: The Library — A Little Place for Us ♡

**Date:** November 21, 2026  
**Project:** A Little Place for Us ♡  
**Milestone:** Phase 2 — The Library (Reading Platform, EPUB & Comic Readers, Secure Uploads, Personal Bookshelf)  
**Status:** Complete & Verified  

---

## 1. Phase 1 Audit & Permissions Correction

### Phase 1 Audit Findings
1. **Owner-Only Update Restriction (Corrected)**: In the Phase 1 schema, `UPDATE` operations on `library_books` were restricted to `contributor_id = (select auth.uid())`. This prevented either partner from collaboratively editing descriptions, adding recommendations, fixing metadata, or updating covers on books added by the other.
2. **Indiscriminate `to authenticated` Clause (Corrected)**: Policies checked `to authenticated` generically, without verifying that the user belongs to the approved two-person sanctuary in `public.profiles`.
3. **Missing Metadata Fields (Added)**: The initial `library_books` schema lacked explicit columns for `content_type` (Books, Light Novels, Manga, Manhwa, etc.), `language`, `publication_year`, `license_name`, `license_url`, and `permission_notes`.
4. **Personal Bookshelf Decoupling (Implemented)**: Personal reading lists (Want to Read, Currently Reading, Finished, Favorites) were not decoupled from shared catalogue records, risking unintended cascades when personal items were modified.

### Permissions & Policy Corrections
- Created the SQL security function `public.is_sanctuary_member(lookup_user_id uuid)` to verify active sanctuary membership (`role in ('admin', 'member')`).
- Rewrote `library_books` policies:
  - **Shared Reading**: Both members can view all verified titles and their own pending uploads.
  - **Shared Contribution**: Both members can insert new books and comics.
  - **Shared Catalogue Curation**: Both members can update shared catalogue metadata (`USING (is_sanctuary_member(auth.uid())) WITH CHECK (is_sanctuary_member(auth.uid()))`).
  - **Deletion Protection**: Only the contributor or an admin can delete a title.
- Updated `storage.objects` policies for `library_files` to ensure only verified sanctuary members have access. Reading files are never given permanent public URLs and are accessed strictly through short-lived signed URLs.

---

## 2. Features Completed

### Stage A — Security, Catalogue & Secure Uploads
- **Dynamic Catalogue**: Direct Supabase querying with real-time reactive filters:
  - Search by title and author.
  - Filter by content type: Books, Light Novels, Manga, Manhwa, Manhua, Comics, Graphic Novels, Webcomics.
  - Filter by format: EPUB, CBZ, PDF.
  - Sort: Recently Added vs. Alphabetical.
- **Content Rights Management**:
  - Enforced rights classification: `Public Domain` (jurisdiction-verified), `Creative Commons`, `Author Permission`, `Licensed Content`, and `Pending Verification`.
  - Titles marked `Pending Verification` are quarantined from the shared catalogue until reviewed.
- **Server-Side Upload System (`/api/library/upload`)**:
  - Validates file extensions, MIME types, and magic byte file headers (`%PDF-` for PDF, `PK\x03\x04` for ZIP/EPUB/CBZ).
  - Enforces 100MB upload limits.
  - Generates collision-resistant unique storage filenames to prevent path traversal.
  - Uploads reading files to private bucket `library_files` and covers to `library_covers`.
  - Automatic rollback/cleanup if database insert fails.
- **Short-Lived Signed URLs (`/api/library/signed-url`)**:
  - Generates 15-minute expiring signed tokens for authorized sanctuary members.

### Stage B — EPUB Reading Engine (`src/components/reader/EpubReader.tsx`)
- Integrated **EPUB.js** for reflowable book reading.
- **Navigation**:
  - Previous and Next page/chapter touch zones and chevron buttons.
  - Keyboard arrow navigation (`ArrowRight`, `ArrowLeft`, `Space`).
  - Table of Contents sidebar for direct chapter jumping.
- **Typography & Accessibility Controls**:
  - Font choices: `Georgia` (Classic Serif), `Lora` (Literary Serif), `Warm Editorial` (Bookerly-style Palatino/Antiqua alternative — completely avoids extracting proprietary fonts), `Atkinson Hyperlegible` (Clean Sans), and `Dyslexic Friendly` (Open letterform).
  - Adjustable font size (13px to 32px with `A-` / `A+` controls).
  - Configurable line spacing (1.4, 1.6, 1.9).
  - Text alignment toggle (Justify vs. Left-aligned).
  - Configurable reading margins (Compact, Normal, Wide).
- **Reading Themes**:
  - Warm Cream (`#F4EFE3`)
  - Clean Paper (`#FAF7F0`)
  - Cozy Sepia (`#EFE5D0`)
  - Calm Night (`#1C1917`)
- **Reading Position**:
  - EPUB CFI tracking with percentage calculations.
  - Automatic periodic saving to `/api/library/progress`.
  - Seamless location restoration: resumes reading exactly where left off.
- **Fullscreen & Bookmarks**:
  - Fullscreen toggle and bookmark indicator.

### Stage C — Dedicated Comic Reader (`src/components/reader/ComicReader.tsx`)
- Custom CBZ archive reader powered by `JSZip`.
- **Security & Safety Protections**:
  - Decompression size ceiling (400MB) guarding against ZIP bomb attacks.
  - Path traversal checks (`..`, leading slashes).
  - Image MIME & extension validation (JPEG, PNG, WebP, GIF).
  - Natural numerical page sorting (`page1`, `page2`, ... `page10`).
- **Reading Modes**:
  - **Continuous Vertical Scroll**: Smooth webtoon / manhwa layout with responsive width, lazy image loading, and smooth scrolling.
  - **Page-by-Page**: Manga / western style with next/previous controls, arrow keys, and fit-to-screen scaling.
- **Controls**:
  - Zoom controls (+, -, reset to 100%).
  - Direct scrubber slider to jump to any page.
  - Reading progress percentage saved automatically.

### Stage D — Personal Bookshelf (`/library?tab=myshelf`)
- Separate private reading space per account:
  - Filter by: `Currently Reading`, `Want to Read`, `Finished`, `Favorites ♡`.
  - Displays individual percentage completed bar and last-read timestamp.
  - "Continue Reading" button jumps directly to the reader.
  - "Remove from shelf" removes the book from the user's personal list without deleting the shared catalogue entry.
  - Completely invisible to the other partner at the database RLS level.

---

## 3. Files Created or Modified

| Path | Action | Description |
| :--- | :---: | :--- |
| `supabase/migrations/20261121000001_library_permissions_and_fields.sql` | **Created** | SQL migration with `is_sanctuary_member()`, schema updates, shared RLS policies, and storage security. |
| `src/types/database.ts` | **Modified** | Added `ContentType`, `BookshelfStatus`, and extended `LibraryBook` & `ReadingProgress` interfaces. |
| `src/lib/library/validation.ts` | **Created** | Server-side file header magic byte validation, size limit checks, and filename sanitization. |
| `src/app/api/library/upload/route.ts` | **Created** | Server-side upload handler for reading files and covers with Supabase storage and rollback logic. |
| `src/app/api/library/signed-url/route.ts` | **Created** | Secure short-lived (15-min) signed URL generator for private reading files. |
| `src/app/api/library/progress/route.ts` | **Created** | GET, POST, and DELETE endpoints for private reading progress and bookshelf management. |
| `src/components/reader/EpubReader.tsx` | **Created** | Polished EPUB.js reader with typography, themes, TOC, CFI saving, and keyboard navigation. |
| `src/components/reader/ComicReader.tsx` | **Created** | Secure CBZ comic reader with continuous scroll, page-by-page, zoom, and ZIP bomb defense. |
| `src/app/library/reader/[id]/page.tsx` | **Created** | Dynamic reader route that auto-selects EPUB vs. Comic reader based on format. |
| `src/app/library/page.tsx` | **Modified** | Replaced mockups with live Supabase catalogue, search, filters, upload modal, and personal bookshelf. |
| `.eslintrc.json` | **Modified** | Configured ESLint rules for dynamic blob URLs in comic reader. |
| `package.json` | **Modified** | Added `epubjs`, `jszip`, and `@types/jszip`. |

---

## 4. Database Migrations Added

File: `supabase/migrations/20261121000001_library_permissions_and_fields.sql`

```sql
-- 1. Sanctuary member check
create or replace function public.is_sanctuary_member(lookup_user_id uuid)
returns boolean language sql security invoker set search_path = '' stable as $$
  select exists (
    select 1 from public.profiles
    where id = lookup_user_id and role in ('admin', 'member')
  );
$$;

-- 2. Metadata columns on library_books
alter table public.library_books 
  add column if not exists content_type text not null default 'book' 
    check (content_type in ('book', 'light_novel', 'manga', 'manhwa', 'manhua', 'comic', 'graphic_novel', 'webcomic')),
  add column if not exists language text not null default 'en',
  add column if not exists publication_year int,
  add column if not exists license_name text,
  add column if not exists license_url text,
  add column if not exists permission_notes text;

-- 3. Bookshelf fields on reading_progress
alter table public.reading_progress
  add column if not exists status text not null default 'currently_reading'
    check (status in ('currently_reading', 'want_to_read', 'finished')),
  add column if not exists is_favorite boolean not null default false;

-- 4. Shared collaboration policies
create policy "Books visible to sanctuary members"
  on public.library_books for select to authenticated
  using (public.is_sanctuary_member((select auth.uid())) and (is_verified = true or (select auth.uid()) = contributor_id));

create policy "Sanctuary members can contribute books"
  on public.library_books for insert to authenticated
  with check (public.is_sanctuary_member((select auth.uid())) and (select auth.uid()) = contributor_id);

create policy "Sanctuary members can update shared catalogue"
  on public.library_books for update to authenticated
  using (public.is_sanctuary_member((select auth.uid())))
  with check (public.is_sanctuary_member((select auth.uid())));
```

---

## 5. Dependencies Installed

- `epubjs`: Reflowable EPUB rendering engine.
- `jszip` & `@types/jszip`: Client-side safe decompression for CBZ comic archives.

---

## 6. Verification and Testing Results

```text
$ npx tsc --noEmit
Exit code: 0 (Zero errors)

$ npm run lint
> a-little-place-for-us@0.1.0 lint
> next lint
✔ No ESLint warnings or errors
Exit code: 0

$ npm run build
> a-little-place-for-us@0.1.0 build
> next build
   ▲ Next.js 15.2.1
   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (15/15) ...
 ✓ Generating static pages (15/15)
   Finalizing page optimization ...

Route (app)                                 Size  First Load JS
┌ ○ /                                      184 B         105 kB
├ ○ /_not-found                            977 B         102 kB
├ ƒ /api/library/progress                  143 B         101 kB
├ ƒ /api/library/signed-url                143 B         101 kB
├ ƒ /api/library/upload                    143 B         101 kB
├ ƒ /auth/callback                         143 B         101 kB
├ ○ /garden                              4.26 kB         105 kB
├ ○ /hideaway                            3.67 kB         104 kB
├ ○ /library                             7.59 kB         183 kB
├ ƒ /library/reader/[id]                 2.98 kB         108 kB
├ ○ /login                               4.24 kB         175 kB
├ ○ /music                               4.97 kB         106 kB
├ ○ /scrapbook                            3.9 kB         105 kB
└ ○ /settings                            4.59 kB         105 kB
+ First Load JS shared by all             101 kB
ƒ Middleware                             93.5 kB

Exit code: 0
```

---

## 7. Required Environment Variables

Same as Phase 1:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-service-role-key
```

---

## 8. Manual Supabase Configuration Required

1. **Apply Migration 2**:
   Open Supabase Dashboard -> **SQL Editor** -> Paste and run `supabase/migrations/20261121000001_library_permissions_and_fields.sql`.
2. **Storage Bucket Check**:
   Confirm that the `library_files` bucket has the **Public** toggle set to **OFF** (private). All file access is mediated through our `/api/library/signed-url` endpoint.

---

## 9. Known Limitations & Roadmap to Phase 3

- **CBR (RAR) Archives**: CBR archives use proprietary RAR compression algorithms that require heavy unverified WebAssembly decoders. To maintain strict security against malicious code execution, CBZ (ZIP) is supported; CBR files can be easily packaged as CBZ for instant viewing.
- **Fixed-Layout EPUBs**: Some heavily styled children's picture books use fixed-layout EPUB metadata; EPUB.js handles reflowable text best. For fixed visual layouts, CBZ or PDF is recommended.
- **Phase 3**: Will implement The Music Room and The Scrapbook shared collections and memory boards.
