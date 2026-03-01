# 🇬🇹 Guate Explorer

> Discover the beauty, culture, and heritage of Guatemala — interactively.

[![CI](https://github.com/Carlosmarroquin20/guate-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/Carlosmarroquin20/guate-explorer/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20ES-success)](./src/i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

**Guate Explorer** is an interactive travel guide for Guatemala built with React 19 and TypeScript. It combines an OpenStreetMap-powered map, a Wikimedia image gallery, a Groq-powered AI assistant, and a guided auto-tour — all in a polished, accessible interface with dark mode and English/Spanish support.

![Guate Explorer screenshot](https://via.placeholder.com/1200x600/1e3a5f/ffffff?text=Guate+Explorer+—+screenshot+placeholder)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Interactive Map** | OpenStreetMap via React Leaflet — custom category icons, fly-to animation on place selection |
| 🖼️ **Fullscreen Lightbox** | Click any gallery image to open a fullscreen viewer with keyboard navigation |
| 🤖 **AI Assistant** | Groq-powered chat (llama-3.1-8b-instant) with SSE streaming, context-aware per place |
| 🎬 **Guided Tour Mode** | Auto-flies through all places with an SVG progress-ring countdown |
| 🔗 **URL Deep Linking** | Shareable URLs (`?place=tikal`) — browser back/forward works natively |
| 🔍 **Search & Filter** | Real-time search by name/department + category chips + favorites |
| ❤️ **Favorites** | Persist across sessions via `localStorage` |
| 🌙 **Dark / Light Mode** | CSS custom properties, preference remembered |
| 🌐 **i18n EN / ES** | Full UI translation via react-i18next, language preference persisted |
| ⌨️ **Keyboard Navigation** | Arrow keys for gallery, Escape for lightbox |
| 🎭 **Slide Transitions** | Directional slide animation between list and detail views |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1 — Clone & install

```bash
git clone https://github.com/Carlosmarroquin20/guate-explorer.git
cd guate-explorer
npm install
```

### 2 — Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your **free** Groq API key (no credit card required):

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get a free key at [console.groq.com/keys](https://console.groq.com/keys).
The app works fully without a key — the AI chat section is simply disabled.

### 3 — Run

```bash
npm run dev        # Start dev server → http://localhost:5173
npm run build      # Type-check + production build → dist/
npm run preview    # Serve the production build locally
npm run lint       # Run ESLint
```

---

## 🏗️ Architecture

### Project structure

```
guate-explorer/
├── .github/
│   └── workflows/
│       └── ci.yml              # Type-check + lint + build on every push / PR
├── src/
│   ├── components/
│   │   ├── ImageGallery/       # Wikimedia image carousel + thumbnails
│   │   ├── Lightbox/           # Fullscreen image modal (React Portal)
│   │   ├── Map/                # React Leaflet map + fly-to controller
│   │   ├── PlaceChat/          # AI chat UI (collapsible, per-place)
│   │   ├── Sidebar/            # Search, filters, list, detail views
│   │   └── TourControls/       # Floating tour start/stop/next panel
│   ├── context/
│   │   └── ThemeContext.tsx    # Light/dark mode via CSS custom properties
│   ├── data/
│   │   └── places.json         # 18 Guatemalan destinations (typed)
│   ├── hooks/
│   │   ├── useGroqChat.ts      # Groq SSE streaming + AbortController
│   │   ├── useTour.ts          # Auto-tour interval logic
│   │   └── useWikimediaImages.ts # Wikimedia Commons image fetching
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── es.json
│   ├── types/
│   │   └── index.ts            # Place, Category, Department, PlaceImage
│   └── utils/
│       └── icons.ts            # Category → icon/color mapping
├── .env.example                # Template for environment variables
├── vite.config.ts
├── tsconfig.app.json           # Strict TypeScript
└── package.json
```

### Key design decisions

- **No external state management** — all state lives in `AppContent` via `useState` + `useMemo`; props flow downward.
- **URL as source of truth** — `selectedPlace` is synced to `?place=<id>` via `history.pushState` / `popstate`; `replaceState` on first render avoids duplicate history entries.
- **Custom hooks own side effects** — `useGroqChat`, `useTour`, and `useWikimediaImages` each manage their own `AbortController` / `clearInterval` cleanup.
- **CSS custom properties for theming** — zero JS overhead; toggling `data-theme` on `:root` switches the full palette.
- **React Portal for Lightbox** — rendered directly into `document.body` to escape `overflow: hidden` stacking contexts.

---

## 🤖 AI Assistant — Groq

The AI chat uses the [Groq API](https://groq.com) with **llama-3.1-8b-instant** — one of the fastest inference endpoints available. Responses stream in real-time via Server-Sent Events (SSE).

**How it works:**

1. When a place is opened, `PlaceChat` mounts with the place's name, category, department, and description pre-injected into the system prompt.
2. The system prompt language matches the current i18n locale (EN/ES).
3. Each user message streams back token-by-token using `ReadableStream` + `TextDecoder`.
4. Changing the place aborts any in-flight request (`AbortController`) and resets the conversation.

The feature degrades gracefully — if `VITE_GROQ_API_KEY` is not set, the UI shows a friendly setup message instead of an error.

---

## 🎬 Guided Tour

Click **▶ Tour** (bottom-right of the map) to start an automated tour of all currently visible places.

- The map flies to each place using Leaflet's `flyTo` animation.
- An **SVG progress ring** drains over 7 seconds per place (CSS animation reset via React `key` trick).
- The tour snapshots the `filteredPlaces` array at start time — changing filters mid-tour has no effect.
- **⏭ Skip** / **⏹ Stop** controls are always visible during the tour.

---

## 🌐 Internationalization

All UI strings are in `src/i18n/locales/`. To add a new language:

1. Create `src/i18n/locales/<code>.json` (copy `en.json` as a template).
2. Register the locale in `src/i18n/index.ts`.
3. The language switcher button in the header will cycle through available languages.

---

## 📍 Adding New Places

Places are defined in [`src/data/places.json`](src/data/places.json). Each entry follows this schema:

```jsonc
{
  "id": "unique-kebab-id",          // used in ?place= URL param
  "name": "Display Name",
  "description": "One paragraph description in English.",
  "category": "archaeological",     // see Category type below
  "department": "Petén",            // must match the Department union type
  "wikimediaQuery": "search terms for Wikimedia Commons images",
  "coordinates": {
    "lat": 17.222,
    "lng": -89.623
  }
}
```

**Valid categories:** `archaeological` · `volcano` · `lake` · `nature` · `colonial` · `beach` · `cave`

**Valid departments:** All 22 Guatemalan departments are listed in [`src/types/index.ts`](src/types/index.ts).

> TypeScript will error at build time if an invalid category or department is used.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev) | 19 | UI framework |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Type safety (strict mode) |
| [Vite](https://vitejs.dev) | 7 | Build tool + dev server |
| [React Leaflet](https://react-leaflet.js.org) | 5 | Interactive map (OpenStreetMap) |
| [react-i18next](https://react.i18next.com) | 16 | Internationalization |
| [Groq API](https://groq.com) | — | AI chat (free tier, llama-3.1-8b-instant) |
| [Wikimedia Commons API](https://commons.wikimedia.org/wiki/API) | — | Place images |
| ESLint + typescript-eslint | 9 / 8 | Linting |

---

## 🤝 Contributing

Contributions are very welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

Quick summary:

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make your changes and ensure CI passes: `npm run lint && npm run build`
3. Open a Pull Request with a clear description

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

**Made with ❤️ for Guatemala** · *Explore. Discover. Connect.*

</div>
