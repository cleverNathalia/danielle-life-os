# danielle-life-os

A personal life dashboard built with React, TypeScript, and Vite. Tracks work hours via live Toggl integration, weekly habits, a fantasy novel word count, drama course progress, and a frontend learning roadmap — all in one dark, cyberpunk-styled interface. Deployed on GitHub Pages with a Cloudflare Worker handling the Toggl API proxy.

## Prerequisites

- Node.js 18+
- A [Toggl Track](https://track.toggl.com) account and API token (found in Profile Settings)
- A [Cloudflare](https://cloudflare.com) account (free tier) for the API proxy worker

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set `VITE_TOGGL_WORKER_URL` to your Cloudflare Worker URL (you'll get this after step 3).

### 3. Deploy the Cloudflare Worker

The worker proxies your Toggl API calls — required because Toggl's API doesn't allow direct browser requests from GitHub Pages (CORS).

```bash
# Install Wrangler if you don't have it
npm install -g wrangler
wrangler login

# Deploy the worker
wrangler deploy worker/toggl-proxy.ts --name life-os-toggl

# Add your secrets (you'll be prompted to paste the values)
wrangler secret put TOGGL_TOKEN      # your Toggl API token
wrangler secret put ALLOWED_ORIGIN   # e.g. https://yourusername.github.io
```

The worker URL will be printed after deployment — paste it into `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173/life-os/](http://localhost:5173/life-os/).

## Deployment

Deploys to GitHub Pages via the `gh-pages` package:

```bash
npm run deploy
```

This builds the project and pushes `dist/` to the `gh-pages` branch. Make sure GitHub Pages is configured to serve from that branch in your repo settings.

## Project structure

```
src/
├── components/
│   ├── ui/          # Card, ProgressBar, GlowNumber primitives
│   ├── layout/      # Sidebar, Topbar
│   ├── dashboard/   # Dashboard cards (WorkCard, HabitTracker, etc.)
│   └── views/       # Full-page views (Dashboard, Schedule, Roadmap, Projects, Habits)
├── hooks/           # useToggl, useHabits, useClock
├── types/           # TypeScript interfaces
└── data/            # Static data (roadmap, courses, schedule)
worker/
└── toggl-proxy.ts   # Cloudflare Worker — Toggl CORS proxy
```
