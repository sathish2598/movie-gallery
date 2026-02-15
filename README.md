# MovieGallery — TMDB High-Res Movie Wallpapers

A web app to browse and download high-resolution movie posters and backdrops powered by [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

## Features

- **Search** — Find movies by title from the header search bar.
- **Poster & backdrop** — View and download poster (w500) and ultra-wide backdrop (w1920) in original quality.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build
- **Tailwind CSS** (CDN) — styling
- **Lucide React** — icons
- **TMDB API** — movie search, popular list, and image URLs

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)

## Getting started

1. **Clone or download** the project and open a terminal in its folder.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. `http://localhost:5173`) in your browser.

4. **(Optional)** To use your own TMDB API key, get one at [TMDB](https://www.themoviedb.org/settings/api) and set it in `services/tmdb.ts` (or wire the app to read from an env variable).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |

## Project structure

```
├── App.tsx           # Main UI: search, grid, detail view, downloads
├── index.html        # Entry HTML, Tailwind CDN
├── index.tsx         # React mount
├── types.ts          # Movie & TMDB response types
├── services/
│   └── tmdb.ts       # TMDB API: search, popular, image URLs, download helper
└── package.json
```

## Attribution

All imagery is provided by **The Movie Database (TMDB)**. This project uses the TMDB API but is not endorsed or certified by TMDB.
