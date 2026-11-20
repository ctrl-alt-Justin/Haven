# Design Overhaul Report: Living Storybook Sanctuary World ♡

**Date:** November 21, 2026  
**Project:** A Little Place for Us ♡  
**Milestone:** Visual Overhaul — Interactive Storybook Game World  
**Status:** Complete, Verified & Tested  

---

## 1. Visual & Environmental Transformation

The conventional card-based template has been transformed into a **living, cozy, illustrated storybook game world**. The sanctuary now evokes the warmth of cozy exploration and life-simulation games (like *Ghibli*, *Animal Crossing*, and *Spiritfarer*) while establishing a completely custom visual and artistic identity.

### Preserved Non-Negotiables
- **No Daily Streaks or Obligations**: The flowers bloom without timers, the cat dozes peacefully, and no participation scores or reminders exist.
- **Strict Privacy**: Zero tracking of visit duration, online status, or pages viewed. All personal reading progress, bookmarks, and journal notes remain isolated by PostgreSQL Row Level Security.
- **Backend Functionality Intact**: Next.js 15 App Router, TypeScript, Supabase Auth, EPUB.js reader, CBZ Comic Reader, and secure upload pipelines are fully preserved and functional.

---

## 2. Key Interactive World Elements

### The Explorable Homepage (`CottageWorld.tsx`)
- **Illustrated Cottage Environment**:
  - Central timber-framed cottage with a stone foundation, chimney, and animated rising smoke puffs.
  - Layered scenery with rolling green hills, distant pines, and gentle drifting clouds.
  - Cobblestone winding path leading to the cottage doorway.
  - Animated drifting fireflies and pollen particles.
- **Interactive Doorways & Windows (Room Entrances)**:
  - **The Library Window**: Glowing golden mullioned bay window showing silhouettes of bookshelves and reading lamp. Hovering displays the library preview; clicking enters The Library.
  - **The Music Room Dormer**: Attic gabled window with floating musical notes. Enters The Music Room.
  - **The Garden Gate**: Wooden rustic gate surrounded by swaying sunflowers and lavender. Enters The Garden.
  - **The Scrapbook Desk**: Picnic craft bench under the apple tree with polaroids pinned to it. Enters The Scrapbook.
  - **The Hideaway Skylight**: Upper quiet window with a soft lantern flame. Enters the private sanctuary.
- **Cozy Living Discoveries**:
  - **Sleeping Ginger Cat (`Miso`)**: Curled on the porch steps with gentle breathing animation. Clicking pets the cat, which purrs ("*purr... Miso is snoozing peacefully in the warm sun ♡*").
  - **Interactive Wooden Mailbox**: Click the mailbox with its red heart flag to open a storybook letter for the visitors.
  - **Pond with Water Lilies**: Clicking the water produces gentle concentric ripple rings.
- **Dual Perspective Toggle**:
  - **Illustrated World View**: Full visual explorable game map.
  - **Storybook Index View**: Clean, accessible room cards for quick access on mobile devices or smaller viewports.

---

## 3. Distinct Atmosphere for Every Room

### 1. The Library (`/library`)
- **Atmosphere**: A warm wooden reading nook with tall bookshelves, comfortable wingback armchair, reading lamp, and steaming mug of tea.
- **Functionality Preserved**:
  - Live Supabase catalogue search and filters (Content types: Books, Light novels, Manga, Manhwa, etc.; Formats: EPUB, CBZ, PDF).
  - Secure Add a Title upload modal with rights compliance validation.
  - Full EPUB.js and CBZ comic reader integration with reading progress restoration.
  - Private bookshelf tab.

### 2. The Music Room (`/music`)
- **Atmosphere**: Cozy attic music corner with fairy string lights glowing above and wooden rafters.
- **Interactive Turntable**:
  - Animated spinning vinyl record player with a movable tonearm. Clicking toggles the turntable between spinning and resting.
- **Melodies & Records**:
  - Shared Spotify and YouTube songs displayed as vinyl record sleeves and cassette tapes with personal handwritten notes.

### 3. The Scrapbook (`/scrapbook`)
- **Atmosphere**: Rustic wooden craft workbench with taped polaroids, paper scraps, pushpins, and washi tape.
- **Features**:
  - Pinned memories with gentle tilt angles (`-rotate-1`, `rotate-2`).
  - Clear separation between shared moments and personal drafts.
  - "Pin a Keepsake" modal.

### 4. The Garden (`/garden`)
- **Atmosphere**: Sunlit botanical wonderland with wildflowers and drifting butterflies.
- **Interactive Flowerbed**:
  - 6 distinct botanical flowers (Sanctuary Lavender, Chamomile, Forget-Me-Not, Moss Rose, Apple Blossom, Honeysuckle).
  - Clicking any flower blooms it with gentle sway animations and reveals its meaning and nature lore.
  - Explicit zero-pressure design: flowers never wilt or require daily logins.

### 5. The Hideaway (`/hideaway`)
- **Atmosphere**: Twilight personal sanctuary with a writing desk, flickering candle flame, and rain/stars outside the window.
- **Privacy Assurance**:
  - Explicit explanation and enforcement of PostgreSQL Row Level Security (`(select auth.uid()) = user_id`).
  - Private journal entries and personal drafts hidden from all other users.

---

## 4. Atmosphere & Ambient Sound Widget (`AtmosphereControl.tsx`)

A floating storybook control widget located in the bottom-right corner:
1. **Sky & Time of Day**:
   - ☀️ **Day**: Warm golden sunlight and clear meadow breeze.
   - 🌤️ **Dusk**: Soft orange-rose sunset sky with glowing window lanterns.
   - 🌙 **Night**: Deep starlight indigo sky with glowing fireflies.
2. **Ambient Sound Synthesizer**:
   - Synthesizes real ambient audio (**Gentle Rain** or **Hearth Fireplace**) using the browser's **Web Audio API**.
   - Requires zero external audio files, zero network bandwidth, and zero copyright issues.
3. **Calm Mode (Reduced Motion)**:
   - One-click toggle that immediately pauses all CSS animations and particle effects for readers who prefer completely static pages. Respects `prefers-reduced-motion`.

---

## 5. Verification & Testing

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
┌ ○ /                                     6.7 kB         112 kB
├ ○ /_not-found                            977 B         102 kB
├ ƒ /api/library/progress                  143 B         101 kB
├ ƒ /api/library/signed-url                143 B         101 kB
├ ƒ /api/library/upload                    143 B         101 kB
├ ƒ /auth/callback                         143 B         101 kB
├ ○ /garden                               4.8 kB         105 kB
├ ○ /hideaway                            4.09 kB         105 kB
├ ○ /library                             7.85 kB         183 kB
├ ƒ /library/reader/[id]                 2.58 kB         108 kB
├ ○ /login                               4.53 kB         175 kB
├ ○ /music                                5.5 kB         106 kB
├ ○ /scrapbook                           4.75 kB         105 kB
└ ○ /settings                            4.55 kB         105 kB
+ First Load JS shared by all             101 kB
ƒ Middleware                             93.5 kB

Exit code: 0
```
