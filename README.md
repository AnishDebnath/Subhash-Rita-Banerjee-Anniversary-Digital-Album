# Subhash & Rita Banerjee Anniversary Digital Album

A realistic, high-fidelity interactive digital wedding photo album engineered with 3D physical page-turning, authentic double-page panoramic spreads, tactile paper audio feedback, and responsive viewport geometry.

Designed to faithfully simulate an ultra-luxury 18" × 12" flush-mount photographic wedding album (36" × 12" when open).

---

## 📖 Key Features

1. **Photorealistic 3D Page Turning**:
   - Powered by `StPageFlip` with realistic paper bending, corner grabbing, dynamic lighting shadows, and physical hardcover cover boards (`data-density="hard"` for covers, `"soft"` for archival leaves).
   - Interaction support via:
     - **Mouse clicks** (click right page to flip forward, left page to flip back)
     - **Mouse corner drag** (grab page edges/corners and fold naturally)
     - **Touch gestures** (smooth finger swipe and tracking on touch devices)
     - **Keyboard navigation** (← / → arrows, `Home` to restart, `End` to close)

2. **Genuine Panoramic Two-Page Spreads (3:1 Spread across facing 3:2 Pages)**:
   - True continuous panoramic photography without independent cropping or face misalignment.
   - Left leaf renders left 50%, right leaf renders right 50%.
   - Seamless center fold alignment with subtle central binding crease and paper highlights.

3. **Autonomous Asset Management & Simple Customization**:
   - Centralized configuration in `src/data/album.config.ts`.
   - Replace pictures, add pages, insert panoramic spreads, or customize the photographer credits without modifying the page-turning engine.

4. **Realistic Paper Sound Effects**:
   - Real-time synthesized luxury matte/silk paper rustle via the Web Audio API (100% offline, zero audio file dependencies).
   - Includes volume control and mute toggle.

5. **Automated Slideshow (Autoplay)**:
   - Configurable intervals (3s, 5s, 8s, 10s).
   - Pauses on user manual interaction and stops automatically at the back cover.

6. **Minimal User Interface**:
   - Sleek, unobtrusive studio dock with auto-fade idle detection.
   - Size format selector: Standard (12×18"), Extended (13×20"), Large (14×20").
   - Fullscreen mode and thumbnail spread overview drawer.

---

## 📂 Project & Asset Structure

```
src/
├── main.tsx                   # React root: createRoot + StrictMode
├── App.tsx                    # App shell, mounts AlbumViewer
├── index.css                  # Global styles
├── assets/                    # Album images: Cloudinary URLs via env, local copies as fallback
│   ├── index.ts               # `assets.*` = Cloudinary URL only (`${VITE_CLOUDINARY_BASE_URL}/<public_id>`)
│   ├── cloudinaryImages.ts    # Cloudinary public_id map (mindtrix-media, v1791649244)
│   ├── front-cover.jpg        # Front cover image
│   ├── back-cover.jpg         # Back cover image
│   ├── background-music.mp3   # Looping background music (plays by default)
│   └── page-01.jpg … page-24.jpg  # Interior pages, in book order
├── components/
│   ├── AlbumViewer.tsx        # Core page-turning engine & viewport manager
│   ├── Cover.tsx              # Luxury debossed gold foil front cover
│   ├── BackCover.tsx          # Artisan gold-seal exterior back cover
│   ├── DoublePageSpread.tsx   # Synchronized two-page continuous panoramic spread
│   ├── SinglePage.tsx         # Single photographic matte leaf
│   ├── Flyleaf.tsx            # Mulberry silk archival endpaper
│   ├── PhotographerCredit.tsx # Studio branding & acknowledgement page
│   ├── AlbumControls.tsx      # Minimalist floating controls dock
│   ├── ThumbnailStrip.tsx     # All spreads overview drawer
│   └── RotateScreenOverlay.tsx # Portrait orientation hint overlay
├── data/
│   └── album.config.ts        # Centralized album configuration
├── types/
│   └── page-flip.d.ts         # StPageFlip module declarations
└── utils/
    ├── audio.ts               # Web Audio API paper turnover sound synthesizer
    ├── responsive.ts          # Viewport proportional scaling math
    └── albumCompiler.ts       # Leaf sequence compiler for StPageFlip
```

---

## 🛠️ How to Customize the Album

### 1. Replace Photographs
Photos come from Cloudinary only. To swap or add a photo:
1. Upload the image to your Cloudinary account.
2. Open `src/assets/cloudinaryImages.ts`.
3. Put the image's Cloudinary file name in the matching slot (`page-05`, `front-cover`, …).
- Aspect ratio: 3:2 landscape (e.g. 3000 × 2000 px).
- Background music stays local (`src/assets/background-music.mp3`).

### 2. Edit `src/data/album.config.ts`
Modify the couple's names, date, venue, photographer details, or reorder/add pages:

```typescript
import { assets } from '@/assets';

export const albumConfig: AlbumConfig = {
  coupleNames: "Subhash & Rita Banerjee",

  items: [
    // Front cover
    {
      id: 'cover-front',
      type: 'cover',
      src: assets.frontCover,
    },
    // Interior pages in book order
    { id: 'page-01', type: 'single', src: assets.page01 },
    { id: 'page-02', type: 'single', src: assets.page02 },
    { id: 'page-03', type: 'single', src: assets.page03 },
    // Add as many single pages as you wish...
    {
      id: 'cover-back',
      type: 'cover-back',
      src: assets.backCover,
    },
  ]
};
```

---

## 🚀 Development & Deployment

### How the Photos Load
All photos (front cover, back cover, page-01 … page-24) are stored on **Cloudinary** (online image hosting). The website downloads them from there — not from the project folder.

3 things make it work:
1. **Your Cloudinary link** lives in a file called `.env` (one line: `VITE_CLOUDINARY_BASE_URL=...`). This file stays private on your computer.
2. **Photo names** are listed in `src/assets/cloudinaryImages.ts`. Each line pairs a page (`page-01`) with its Cloudinary file name (`page-01_xxxxx.jpg`). Copy the file name from Cloudinary's website after uploading.
3. **Missing name = blank page.** Every one of the 26 keys must have a Cloudinary file name. Right now only `page-22` is filled — add the other 25.

### Run Locally
```bash
npm install
cp .env.example .env   # then paste your Cloudinary link into .env
npm run dev
```

### Deploy on Vercel
`.env` is NOT uploaded automatically. Add the same variable in Vercel: Project → Settings → Environment Variables → add `VITE_CLOUDINARY_BASE_URL` → Redeploy.

### Build for Production
```bash
npm run build
```
The output will be generated in `dist/`, ready for static hosting on Vercel, Netlify, Cloud Run, or GitHub Pages.

---

## 🔍 SEO Setup

Included in `index.html`:
- Title, meta description, `robots` index/follow, canonical URL, theme color
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`) and Twitter Card tags
- JSON-LD structured data (`WebPage` + `Person` for Subhash Banerjee and Rita Banerjee)
- SVG favicon (`public/favicon.png`, linked in `index.html`)
- Visually hidden `<h1>` in `src/App.tsx` for document outline
- Descriptive `alt` text on cover, pages, and spread images

Crawl files in `public/` (copied to site root at build):
- `robots.txt` — allows crawling, points to sitemap
- `sitemap.xml` — single landing URL

### Before deploying, replace placeholders:
1. Domain `https://example.com` appears in: `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD), `public/robots.txt`, `public/sitemap.xml`.
2. Social preview image served from `public/og-cover.jpg` (linked as `/og-cover.jpg` in `og:image` / `twitter:image`). Recommended 1200 × 630 px. Facebook/LinkedIn require absolute URLs — once real domain known, prefix path with it (e.g. `https://your-domain.com/og-cover.jpg`).
