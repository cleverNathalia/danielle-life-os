# 🚀 Life OS — React + Vite + TypeScript Setup Guide

## Project Structure
```
life-os/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── dashboard/
│   │   │   ├── WorkCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── HabitTracker.tsx
│   │   │   ├── TodaySchedule.tsx
│   │   │   ├── DramaCoursesCard.tsx
│   │   │   └── RoadmapPreview.tsx
│   │   ├── views/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Schedule.tsx
│   │   │   ├── Roadmap.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Habits.tsx
│   │   └── ui/
│   │       ├── Card.tsx
│   │       ├── GlowNumber.tsx
│   │       └── ProgressBar.tsx
│   ├── hooks/
│   │   ├── useToggl.ts
│   │   ├── useClock.ts
│   │   └── useHabits.ts
│   ├── types/
│   │   ├── toggl.ts
│   │   ├── habits.ts
│   │   └── schedule.ts
│   ├── data/
│   │   ├── roadmap.ts
│   │   ├── courses.ts
│   │   └── schedule.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── worker/
│   └── toggl-proxy.ts
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Step 1 — Create the Project

```bash
npm create vite@latest life-os -- --template react-ts
cd life-os
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @tanstack/react-query recharts lucide-react
npm install -D @types/react @types/react-dom
```

---

## Step 2 — tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Step 3 — vite.config.ts

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/life-os/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

---

## Step 4 — src/types/toggl.ts

```ts
export interface TogglWeeklyData {
  totalHours: number
  todayHours: number
  isRunning: boolean
  currentDesc: string
  dailyBreakdown: DailyEntry[]
}

export interface DailyEntry {
  date: string        // YYYY-MM-DD
  hours: number
  projects: ProjectSummary[]
}

export interface ProjectSummary {
  name: string
  client: string
  hours: number
}

export interface TogglTimeEntry {
  id: number
  description: string
  start: string
  stop: string | null
  duration: number    // negative if running
  project_id: number | null
}
```

---

## Step 5 — src/types/habits.ts

```ts
export interface Habit {
  id: string
  name: string
  color: string
  done: number[]   // 0 or 1 for each day of the week (Mon=0 ... Sun=6)
}

export interface Task {
  id: number
  text: string
  tag: TaskTag
  done: boolean
}

export type TaskTag = 'work' | 'learn' | 'write' | 'drama' | 'personal'
```

---

## Step 6 — src/types/schedule.ts

```ts
export type BlockType = 'work' | 'exercise' | 'learning' | 'writing' | 'drama' | 'lunch' | 'games' | 'free'

export interface ScheduleBlock {
  time: string
  label: string
  type: BlockType
  days: number[]   // 0=Mon ... 6=Sun
}

export interface RoadmapPhase {
  phase: string
  status: 'active' | 'upcoming' | 'done'
  title: string
  weeks: string
  items: string[]
  activeItems: string[]
}

export interface Course {
  name: string
  instructor: string
  progress: number
  hours: string
  emoji: string
}
```

---

## Step 7 — src/data/roadmap.ts

```ts
import type { RoadmapPhase } from '@/types/schedule'

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: 'PHASE 1', status: 'active',
    title: 'HTML & CSS Foundations', weeks: 'Weeks 1–4 (Current)',
    items: ['Semantic HTML5', 'CSS Flexbox', 'CSS Grid', 'Responsive Design', 'CSS Variables', 'Box Model'],
    activeItems: ['CSS Grid', 'Responsive Design'],
  },
  {
    phase: 'PHASE 2', status: 'upcoming',
    title: 'JavaScript Core', weeks: 'Weeks 5–10',
    items: ['ES6+ Syntax', 'DOM Manipulation', 'Events & Forms', 'Fetch API', 'Async/Await', 'LocalStorage'],
    activeItems: [],
  },
  {
    phase: 'PHASE 3', status: 'upcoming',
    title: 'React Fundamentals', weeks: 'Weeks 11–18',
    items: ['JSX & Components', 'Props & State', 'useEffect', 'Context API', 'React Router', 'Custom Hooks'],
    activeItems: [],
  },
  {
    phase: 'PHASE 4', status: 'upcoming',
    title: 'Tooling & Ecosystem', weeks: 'Weeks 19–24',
    items: ['Vite/Webpack', 'TypeScript', 'Git Advanced', 'Testing', 'Tailwind CSS', 'Storybook'],
    activeItems: [],
  },
  {
    phase: 'PHASE 5', status: 'upcoming',
    title: 'Advanced & Portfolio', weeks: 'Weeks 25–32',
    items: ['Next.js', 'Performance', 'Accessibility', 'CI/CD', '3 Portfolio Projects'],
    activeItems: [],
  },
]
```

---

## Step 8 — src/data/courses.ts

```ts
import type { Course } from '@/types/schedule'

export const COURSES: Course[] = [
  { name: 'Complete Acting Masterclass', instructor: 'Steve Martin', progress: 34, hours: '12.5h', emoji: '🎭' },
  { name: 'Voice & Speech for Actors', instructor: 'Patricia Fripp', progress: 12, hours: '6h', emoji: '🎙️' },
  { name: 'Improv Comedy Foundations', instructor: 'UCB Faculty', progress: 0, hours: '8h', emoji: '😂' },
]
```

---

## Step 9 — src/hooks/useClock.ts

```ts
import { useState, useEffect } from 'react'

export function useClock(): Date {
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

export function getWeekNumber(d: Date): number {
  const onejan = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7)
}
```

---

## Step 10 — src/hooks/useToggl.ts

```ts
import { useQuery } from '@tanstack/react-query'
import type { TogglWeeklyData } from '@/types/toggl'

const WORKER_URL = import.meta.env.VITE_TOGGL_WORKER_URL as string

async function fetchWeeklyHours(): Promise<TogglWeeklyData> {
  const res = await fetch(`${WORKER_URL}/weekly`)
  if (!res.ok) throw new Error(`Toggl fetch failed: ${res.status}`)
  return res.json() as Promise<TogglWeeklyData>
}

export function useToggl() {
  return useQuery<TogglWeeklyData, Error>({
    queryKey: ['toggl-weekly'],
    queryFn: fetchWeeklyHours,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 2,
  })
}
```

---

## Step 11 — src/hooks/useHabits.ts

```ts
import { useState } from 'react'
import type { Habit, Task } from '@/types/habits'

const DEFAULT_HABITS: Habit[] = [
  { id: 'exercise',  name: 'Exercise',       color: '#ff2d78', done: [1,0,1,0,1,1,0] },
  { id: 'frontend',  name: 'Frontend Study', color: '#9d4edd', done: [1,1,0,1,1,0,1] },
  { id: 'writing',   name: 'Book Writing',   color: '#00ff9d', done: [1,1,1,0,1,1,1] },
  { id: 'drama',     name: 'Drama Course',   color: '#ff9100', done: [0,1,0,1,0,1,0] },
  { id: 'reading',   name: 'Read',           color: '#00e5ff', done: [1,0,1,1,0,1,1] },
]

const DEFAULT_TASKS: Task[] = [
  { id: 1, text: 'Review React hooks documentation', tag: 'learn', done: false },
  { id: 2, text: 'Write Chapter 3 opening scene',    tag: 'write', done: false },
  { id: 3, text: 'Complete daily standup',           tag: 'work',  done: true  },
  { id: 4, text: 'Watch Udemy drama lecture 5',      tag: 'drama', done: false },
  { id: 5, text: '30 min cardio session',            tag: 'personal', done: true },
  { id: 6, text: 'Push frontend feature branch',    tag: 'work',  done: false },
]

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS)
  const [tasks, setTasks]   = useState<Task[]>(DEFAULT_TASKS)

  const toggleHabit = (habitId: string, dayIndex: number): void => {
    setHabits(prev => prev.map(h =>
      h.id === habitId
        ? { ...h, done: h.done.map((d, i) => (i === dayIndex ? (d ? 0 : 1) : d)) }
        : h
    ))
  }

  const toggleTask = (taskId: number): void => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, done: !t.done } : t
    ))
  }

  const addTask = (text: string, tag: Task['tag']): void => {
    setTasks(prev => [...prev, { id: Date.now(), text, tag, done: false }])
  }

  return { habits, tasks, toggleHabit, toggleTask, addTask }
}
```

---

## Step 12 — src/components/ui/Card.tsx

```tsx
import type { ReactNode } from 'react'

type AccentColor = 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'default'

interface CardProps {
  children: ReactNode
  accent?: AccentColor
  className?: string
  span?: number
}

const accentMap: Record<AccentColor, string> = {
  cyan:    '#00e5ff',
  pink:    '#ff2d78',
  green:   '#00ff9d',
  orange:  '#ff9100',
  purple:  '#9d4edd',
  default: '#9d4edd',
}

export default function Card({ children, accent = 'default', className = '', span }: CardProps) {
  return (
    <div
      className={`relative rounded-2xl border border-purple-900/25 bg-[#0f0f2a] p-5 overflow-hidden ${className}`}
      style={{ gridColumn: span ? `span ${span}` : undefined }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accentMap[accent]}, transparent)` }}
      />
      {children}
    </div>
  )
}
```

---

## Step 13 — src/components/ui/ProgressBar.tsx

```tsx
interface ProgressBarProps {
  pct: number
  colorStart: string
  colorEnd: string
  height?: number
}

export default function ProgressBar({ pct, colorStart, colorEnd, height = 6 }: ProgressBarProps) {
  return (
    <div className="w-full rounded-full overflow-hidden bg-white/5" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${Math.min(100, pct)}%`,
          background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
          boxShadow: `0 0 8px ${colorEnd}`,
        }}
      />
    </div>
  )
}
```

---

## Step 14 — src/components/dashboard/WorkCard.tsx

```tsx
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { useToggl } from '@/hooks/useToggl'

export default function WorkCard() {
  const { data, isLoading, isError } = useToggl()

  const total     = data?.totalHours  ?? 0
  const today     = data?.todayHours  ?? 0
  const isRunning = data?.isRunning   ?? false
  const hoursLeft = Math.max(0, 40 - total)
  const pct       = (total / 40) * 100

  const finishTime = new Date(Date.now() + hoursLeft * 3_600_000)
    .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <Card accent="cyan">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Work This Week
      </p>

      {isLoading && <p className="text-xs font-mono text-purple-400">Fetching Toggl...</p>}
      {isError   && <p className="text-xs text-pink-400">⚠ Toggl unavailable</p>}

      {!isLoading && !isError && (
        <>
          <p className="font-orbitron font-black text-4xl leading-none"
            style={{ background: 'linear-gradient(135deg,#00e5ff,#9d4edd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {total.toFixed(1)}h
          </p>
          <p className="text-xs text-purple-400 tracking-wider mt-1">of 40h weekly target</p>

          <div className="mt-3">
            <ProgressBar pct={pct} colorStart="#00e5ff" colorEnd="#9d4edd" />
          </div>

          <div className="mt-2 text-xs text-purple-400">
            Today:{' '}
            <span className="text-cyan-400">{today.toFixed(1)}h</span>
            {isRunning && <span className="text-green-400 ml-1">● live</span>}
            <br />
            {hoursLeft > 0 ? (
              <>
                <span className="text-orange-400">⏱ {hoursLeft.toFixed(1)}h left</span>
                {' · finish ~'}
                <span className="text-cyan-400">{finishTime}</span>
              </>
            ) : (
              <span className="text-green-400">✓ 40h done!</span>
            )}
          </div>
          <p className="mt-1 text-[9px] text-purple-600 font-mono">live via toggl ●</p>
        </>
      )}
    </Card>
  )
}
```

---

## Step 15 — src/App.tsx

```tsx
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import Dashboard from '@/components/views/Dashboard'
import Schedule from '@/components/views/Schedule'
import Roadmap from '@/components/views/Roadmap'
import Projects from '@/components/views/Projects'
import Habits from '@/components/views/Habits'

export type View = 'dashboard' | 'schedule' | 'roadmap' | 'projects' | 'habits'

const queryClient = new QueryClient()

export default function App() {
  const [view, setView] = useState<View>('dashboard')

  const views: Record<View, JSX.Element> = {
    dashboard: <Dashboard />,
    schedule:  <Schedule />,
    roadmap:   <Roadmap />,
    projects:  <Projects />,
    habits:    <Habits />,
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-[#0a0a1a] text-[#e8e8ff] font-rajdhani">
        <Sidebar currentView={view} onNavigate={setView} />
        <div className="flex-1 overflow-y-auto">
          <Topbar currentView={view} />
          <main className="p-7">
            {views[view]}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
}
```

---

## Step 16 — worker/toggl-proxy.ts (Cloudflare Worker)

```ts
interface Env {
  TOGGL_TOKEN: string
  ALLOWED_ORIGIN: string
}

interface TogglEntry {
  id: number
  description: string
  start: string
  stop: string | null
  duration: number
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(req.url)

    if (url.pathname === '/weekly') {
      const auth = 'Basic ' + btoa(`${env.TOGGL_TOKEN}:api_token`)
      const now = new Date()
      const day = now.getDay()
      const todayIdx = day === 0 ? 6 : day - 1

      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - todayIdx)
      weekStart.setHours(0, 0, 0, 0)

      const startDate = weekStart.toISOString().split('T')[0]
      const endDate = new Date(weekStart.getTime() + 6 * 86_400_000)
        .toISOString().split('T')[0]

      const togglRes = await fetch(
        `https://api.track.toggl.com/api/v9/me/time_entries?start_date=${startDate}&end_date=${endDate}`,
        { headers: { Authorization: auth } }
      )

      if (!togglRes.ok) {
        return new Response(JSON.stringify({ error: 'Toggl API error' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }

      const entries = await togglRes.json() as TogglEntry[]
      const byDate: Record<string, number> = {}
      let isRunning = false
      let currentDesc = ''

      entries.forEach(e => {
        const secs = e.duration < 0
          ? Math.floor((Date.now() - new Date(e.start).getTime()) / 1000)
          : e.duration
        const key = new Date(e.start).toISOString().split('T')[0]
        byDate[key] = (byDate[key] ?? 0) + secs
        if (e.duration < 0) { isRunning = true; currentDesc = e.description ?? '' }
      })

      let totalSecs = 0
      let todaySecs = 0
      const todayKey = now.toISOString().split('T')[0]

      for (let d = 0; d <= Math.min(todayIdx, 4); d++) {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + d)
        const key = day.toISOString().split('T')[0]
        const s = byDate[key] ?? 0
        totalSecs += s
        if (key === todayKey) todaySecs = s
      }

      return new Response(
        JSON.stringify({
          totalHours: totalSecs / 3600,
          todayHours: todaySecs / 3600,
          isRunning,
          currentDesc,
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  },
}
```

> **Note:** Store `TOGGL_TOKEN` and `ALLOWED_ORIGIN` as **Cloudflare Worker secrets**, not in code:
> ```bash
> wrangler secret put TOGGL_TOKEN
> wrangler secret put ALLOWED_ORIGIN
> ```

---

## Step 17 — Deploy

```bash
# GitHub Pages
npm run build
npm run deploy

# Cloudflare Worker
wrangler deploy worker/toggl-proxy.ts --name life-os-toggl
wrangler secret put TOGGL_TOKEN      # paste your token
wrangler secret put ALLOWED_ORIGIN   # e.g. https://yourusername.github.io
```

---

## What TypeScript gives you here

| Feature | Benefit |
|---|---|
| `TogglWeeklyData` interface | Autocomplete on API response fields |
| `Habit` / `Task` types | Catch typos like `tsk.done` at compile time |
| `View` union type | Only valid nav routes compile |
| Strict null checks | No more "Cannot read property of undefined" |
| `Env` interface on Worker | Type-safe env vars in Cloudflare |

TypeScript will catch bugs **before** they hit the browser — especially useful as the dashboard grows. 🎯
