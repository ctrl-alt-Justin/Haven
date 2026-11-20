# A Little Place for Us ♡

A private, invitation-only digital sanctuary for two people, crafted with warmth, peaceful pacing, and cottagecore aesthetics.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (Auth, PostgreSQL, Storage, Row Level Security)**.

---

## 🌿 Sanctuary Philosophy

- **Complements, never replaces**: Spotify remains the streaming service; Kindle remains an optional reader. Our website organizes, bookmarks, and curates without locking anyone in.
- **No surveillance**: No read receipts, no last-seen timestamps, no online presence dots, no tracking of reading duration or visited pages.
- **Zero pressure**: No streaks, no daily check-in demands, and no activity-based notifications.
- **Strict privacy & RLS**: Personal journal notes, reading progress, and private shelves are isolated by PostgreSQL Row Level Security (`auth.uid() = user_id`).

---

## 🏡 Navigation & Sanctuary Rooms

1. **The Cottage (`/`)**: Welcoming home with quote of the day, gentle sanctuary principles, and doorways to all rooms.
2. **The Library (`/library`)**: Highest priority reading sanctuary for books, light novels, and comics.
3. **The Music Room (`/music`)**: Curated playlists and shared Spotify/YouTube links with gentle personal notes.
4. **The Scrapbook (`/scrapbook`)**: Polaroid cards, shared memories, screenshots, and quotes with explicit personal vs. shared visibility.
5. **The Garden (`/garden`)**: Interactive botanical bed with calm, blooming flowers. No streaks or obligations.
6. **The Hideaway (`/hideaway`)**: Private personal sanctuary for encrypted journal entries, visible only to the author.
7. **Settings (`/settings`)**: Profile details, reading typography preferences, and single-use partner invitation generator.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + custom cottagecore palette (`#F4EFE3`, `#DCE5D2`, `#EBD9D5`, `#B8C6B0`, `#806F5B`, `#4A6146`, `#2E2620`)
- **Typography**: Cormorant Garamond (headings) & Plus Jakarta Sans (interface text)
- **Authentication**: Supabase Auth with Server-Side Auth (`@supabase/ssr`)
- **Database & Storage**: Supabase PostgreSQL with Row Level Security (RLS) & private storage buckets
- **Deployment**: Vercel
- **Source Control**: Git & GitHub

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (Node 20+ or 22+ recommended)
- A Supabase project (Free tier or self-hosted)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-service-role-key
ADMIN_EMAILS=your_email@example.com
```

### 4. Apply Database Migration
Run the SQL migration in `supabase/migrations/20261121000000_initial_schema.sql` via either:
- **Supabase Dashboard** -> SQL Editor -> Paste and run the file.
- **Supabase CLI**:
  ```bash
  supabase db push
  ```

This automatically provisions:
- Core tables: `profiles`, `invitations`, `shared_spaces`, `library_categories`, `library_books`, `reading_progress`, `bookmarks`, `highlights`, `reading_notes`, `music_items`, `scrapbook_entries`, `private_entries`, `user_preferences`.
- Row Level Security (RLS) policies enforcing ownership and private/shared visibility.
- Private Storage buckets (`library_files`, `library_covers`, `scrapbook_media`, `avatars`).
- Seed categories for books (Light Novels, Fantasy, Romance, etc.) and comics (Manga, Manhwa, etc.).

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Connecting GitHub & Deploying to Vercel

1. **Commit and Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Milestone 1 foundation"
   git remote add origin https://github.com/your-username/a-little-place-for-us.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Import your GitHub repository `a-little-place-for-us`.
   - In **Environment Variables**, add:
     - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app`
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (Server-only)
   - Click **Deploy**.

3. **Supabase Auth Configuration**:
   - In your Supabase Dashboard under **Authentication -> URL Configuration**:
     - Set **Site URL** to `https://your-domain.vercel.app`.
     - Add `https://your-domain.vercel.app/auth/callback` to **Redirect URLs**.
     - Under **Authentication -> Sign In / Providers -> Email**, disable public sign-ups if you want to strictly control user creation via invitations.

---

## 🗺️ Development Roadmap

- [x] **Milestone 1 — Foundation (Current)**
  - [x] Next.js 15 App Router setup & TypeScript strict configuration
  - [x] Tailwind CSS cottagecore palette & typography (Cormorant Garamond + Plus Jakarta Sans)
  - [x] Responsive navigation (desktop header + mobile bottom thumb bar)
  - [x] The Cottage home page with sanctuary philosophy
  - [x] The Library layout, taxonomy, and upload/rights metadata architecture
  - [x] Placeholder rooms: The Music Room, The Scrapbook, The Garden, The Hideaway, Settings
  - [x] Supabase `@supabase/ssr` server/client/middleware integration
  - [x] Database migration with RLS policies, storage rules, and initial seeds
  - [x] Zero lint or build errors
- [ ] **Milestone 2 — The Library** (EPUB.js reflowable reader, custom continuous-scroll Comic Reader for CBZ/CBR, personal reading progress sync)
- [ ] **Milestone 3 — Music Room & Scrapbook** (Spotify/YouTube link embedding, memory cards with shared/private visibility)
- [ ] **Milestone 4 — Garden & Hideaway** (Interactive discoveries, encrypted private journal entries)
- [ ] **Milestone 5 — Production Testing & Polishing**
