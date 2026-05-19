# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal life dashboard — React + TypeScript + Vite, deployed to GitHub Pages. Tracks weekly work hours (live Toggl API), habits, fantasy novel word count, drama course progress, and a frontend learning roadmap. Dark cyberpunk aesthetic.

## Commands

```bash
# Dev
npm install
npm run dev

# Build & deploy to GitHub Pages
npm run build
npm run deploy

# Deploy the Cloudflare Worker (Toggl CORS proxy)
wrangler deploy worker/toggl-proxy.ts --name life-os-toggl
wrangler secret put TOGGL_TOKEN      # paste Toggl API token
wrangler secret put ALLOWED_ORIGIN   # e.g. https://yourusername.github.io
```

Environment: copy `.env.example` to `.env.local` and set `VITE_TOGGL_WORKER_URL`.

## Architecture

### Routing
No React Router. `App.tsx` holds a `View` union type state (`'dashboard' | 'schedule' | 'roadmap' | 'projects' | 'habits'`). `Sidebar` calls `onNavigate(view)` to switch views. `Topbar` reads the current view for the header title.

### Data flow
- **Live data**: `useToggl` hook uses React Query to poll `VITE_TOGGL_WORKER_URL/weekly` every 60s. The Cloudflare Worker (`worker/toggl-proxy.ts`) proxies Toggl API v9 with Basic auth — required because Toggl API doesn't support CORS from GitHub Pages.
- **Local state**: `useHabits` manages habits and tasks in `useState` (no persistence yet — resets on reload).
- **Static data**: `src/data/roadmap.ts`, `src/data/courses.ts`, `src/data/schedule.ts` are plain TypeScript arrays.

### Component layers
- `src/components/ui/` — primitives (`Card`, `ProgressBar`, `GlowNumber`). `Card` has a top-edge gradient accent line via an `accent` prop (`'cyan' | 'pink' | 'green' | 'orange' | 'purple'`).
- `src/components/dashboard/` — cards used on the Dashboard view.
- `src/components/views/` — full-page views rendered by `App.tsx`.
- `src/components/layout/` — `Sidebar` and `Topbar` shell.

### Styling
Tailwind CSS with two custom fonts: `font-orbitron` (headings/numbers) and `font-rajdhani` (body). The base bg is `#0a0a1a`, cards are `#0f0f2a`. Accent colors are applied as inline `style` gradients, not Tailwind colors, so they glow correctly with `boxShadow`.

### TypeScript path alias
`@/` maps to `./src/` — use this throughout (`@/components/...`, `@/hooks/...`, etc.).

### Toggl Worker logic
The worker aggregates Mon–Fri time entries only (index 0–4 from week start), converts running entries (negative `duration`) to elapsed seconds in real time, and returns `{ totalHours, todayHours, isRunning, currentDesc }`. Secrets (`TOGGL_TOKEN`, `ALLOWED_ORIGIN`) are stored in Cloudflare, never in code.
