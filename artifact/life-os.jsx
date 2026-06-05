import { useState, useEffect, useCallback } from 'react'

// ── Global font import + animations ──────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; }
button { cursor: pointer; border: none; background: none; padding: 0; }
input, select { font-family: inherit; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
@keyframes shimmer { from { opacity: .4; } to { opacity: .7; } }
.pulse-anim { animation: pulse 1.5s ease-in-out infinite; }
.shimmer-anim { animation: shimmer 1.5s ease-in-out infinite alternate; }
`

// ── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  bg: '#0a0a1a', card: '#0f0f2a',
  border: 'rgba(88,28,135,0.25)',
  text: '#e8e8ff',
  muted: 'rgba(167,139,250,0.7)',
  dim: 'rgba(124,58,237,0.5)',
  dimmer: 'rgba(109,40,217,0.4)',
  faint: 'rgba(255,255,255,0.05)',
  cyan: '#00e5ff', pink: '#ff2d78', green: '#00ff9d',
  orange: '#ff9100', purple: '#9d4edd',
  fo: "'Orbitron', monospace",
  fr: "'Rajdhani', sans-serif",
}

const ACCENT = {
  cyan: '#00e5ff', pink: '#ff2d78', green: '#00ff9d',
  orange: '#ff9100', purple: '#9d4edd', default: '#9d4edd',
}

// ── Static data ───────────────────────────────────────────────────────────────
const ROADMAP_DATA = [
  { phase: 'PHASE 1', status: 'active',   title: 'HTML & CSS Foundations', weeks: 'Weeks 1–4 (Current)', items: ['Semantic HTML5','CSS Flexbox','CSS Grid','Responsive Design','CSS Variables','Box Model'], activeItems: ['CSS Grid','Responsive Design'] },
  { phase: 'PHASE 2', status: 'upcoming', title: 'JavaScript Core',         weeks: 'Weeks 5–10',  items: ['ES6+ Syntax','DOM Manipulation','Events & Forms','Fetch API','Async/Await','LocalStorage'], activeItems: [] },
  { phase: 'PHASE 3', status: 'upcoming', title: 'React Fundamentals',      weeks: 'Weeks 11–18', items: ['JSX & Components','Props & State','useEffect','Context API','React Router','Custom Hooks'], activeItems: [] },
  { phase: 'PHASE 4', status: 'upcoming', title: 'Tooling & Ecosystem',     weeks: 'Weeks 19–24', items: ['Vite/Webpack','TypeScript','Git Advanced','Testing','Tailwind CSS','Storybook'], activeItems: [] },
  { phase: 'PHASE 5', status: 'upcoming', title: 'Advanced & Portfolio',    weeks: 'Weeks 25–32', items: ['Next.js','Performance','Accessibility','CI/CD','3 Portfolio Projects'], activeItems: [] },
]

const COURSES_DATA = [
  { name: 'Complete Acting Masterclass', instructor: 'Steve Martin',   progress: 34, hours: '12.5h', emoji: '🎭' },
  { name: 'Voice & Speech for Actors',   instructor: 'Patricia Fripp', progress: 12, hours: '6h',    emoji: '🎙️' },
  { name: 'Improv Comedy Foundations',   instructor: 'UCB Faculty',    progress: 0,  hours: '8h',    emoji: '😂' },
]

const WORD_COUNT = { current: 47250, target: 120000, title: 'The Shattered Throne' }

const PROJECTS_DATA = [
  { name: 'Life OS Dashboard',    description: 'Personal life tracking dashboard with Toggl integration, habits, and learning roadmap.', status: 'active', progress: 65, tags: ['React','TypeScript','Vite','Tailwind'], accent: 'cyan'   },
  { name: 'The Shattered Throne', description: 'Epic fantasy novel. First draft in progress — targeting 120k words.',                    status: 'active', progress: 39, tags: ['Writing','Fantasy','Novel'],            accent: 'green'  },
  { name: 'Frontend Learning Path', description: 'Structured 32-week curriculum from HTML/CSS basics to Next.js and portfolio.',        status: 'active', progress: 12, tags: ['HTML','CSS','JavaScript','React'],      accent: 'purple' },
  { name: 'Acting Portfolio',     description: 'Building skills and a reel through Masterclass courses and local improv.',              status: 'active', progress: 20, tags: ['Drama','Voice','Improv'],               accent: 'orange' },
]

const DEFAULT_HABITS = [
  { id: 'exercise',  name: 'Exercise',       color: T.pink,   done: [1,0,1,0,1,1,0] },
  { id: 'frontend',  name: 'Frontend Study', color: T.purple, done: [1,1,0,1,1,0,1] },
  { id: 'writing',   name: 'Book Writing',   color: T.green,  done: [1,1,1,0,1,1,1] },
  { id: 'drama',     name: 'Drama Course',   color: T.orange, done: [0,1,0,1,0,1,0] },
  { id: 'reading',   name: 'Read',           color: T.cyan,   done: [1,0,1,1,0,1,1] },
]

const DEFAULT_TASKS = [
  { id: 1, text: 'Review React hooks documentation', tag: 'learn',    done: false },
  { id: 2, text: 'Write Chapter 3 opening scene',    tag: 'write',    done: false },
  { id: 3, text: 'Complete daily standup',           tag: 'work',     done: true  },
  { id: 4, text: 'Watch Udemy drama lecture 5',      tag: 'drama',    done: false },
  { id: 5, text: '30 min cardio session',            tag: 'personal', done: true  },
  { id: 6, text: 'Push frontend feature branch',     tag: 'work',     done: false },
]

const TAG_COLORS = { work: T.cyan, learn: T.purple, write: T.green, drama: T.orange, personal: T.pink }

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function getWeekNumber(d) {
  const onejan = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7)
}

function useToggl(workerUrl) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const load = useCallback(async () => {
    if (!workerUrl) return
    setIsLoading(true); setIsError(false)
    try {
      const res = await fetch(`${workerUrl}/weekly`)
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch { setIsError(true) }
    finally { setIsLoading(false) }
  }, [workerUrl])

  useEffect(() => {
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [load])

  return { data, isLoading, isError }
}

function useCalendar(workerUrl) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const load = useCallback(async () => {
    if (!workerUrl) return
    setIsLoading(true); setIsError(false)
    try {
      const res = await fetch(`${workerUrl}/calendar`)
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch { setIsError(true) }
    finally { setIsLoading(false) }
  }, [workerUrl])

  useEffect(() => {
    load()
    const id = setInterval(load, 5 * 60000)
    return () => clearInterval(id)
  }, [load])

  return { data, isLoading, isError }
}

function useHabits() {
  const [habits, setHabits] = useState(DEFAULT_HABITS)
  const [tasks, setTasks] = useState(DEFAULT_TASKS)

  const toggleHabit = (habitId, dayIdx) =>
    setHabits(prev => prev.map(h => h.id === habitId
      ? { ...h, done: h.done.map((d, i) => i === dayIdx ? (d ? 0 : 1) : d) }
      : h
    ))
  const toggleTask = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const addTask = (text, tag) => setTasks(prev => [...prev, { id: Date.now(), text, tag, done: false }])

  return { habits, tasks, toggleHabit, toggleTask, addTask }
}

// ── UI Primitives ─────────────────────────────────────────────────────────────
function Card({ children, accent = 'default', style }) {
  const color = ACCENT[accent] || T.purple
  return (
    <div style={{ position: 'relative', borderRadius: 16, border: `1px solid ${T.border}`, background: T.card, padding: 20, overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, opacity: 0.8, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      {children}
    </div>
  )
}

function ProgressBar({ pct, colorStart, colorEnd, height = 6 }) {
  return (
    <div style={{ width: '100%', borderRadius: 9999, overflow: 'hidden', background: T.faint, height }}>
      <div style={{ height: '100%', borderRadius: 9999, transition: 'width 1s', width: `${Math.min(100, pct)}%`, background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`, boxShadow: `0 0 8px ${colorEnd}` }} />
    </div>
  )
}

function GlowNumber({ value, colorStart = T.cyan, colorEnd = T.purple, style }) {
  return (
    <span style={{ fontFamily: T.fo, fontWeight: 900, lineHeight: 1, background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', ...style }}>
      {value}
    </span>
  )
}

function Label({ children }) {
  return <p style={{ fontSize: 10, fontFamily: T.fo, fontWeight: 'bold', letterSpacing: '0.15em', color: T.muted, textTransform: 'uppercase', marginBottom: 12 }}>{children}</p>
}

// ── Dashboard cards ───────────────────────────────────────────────────────────
function WorkCard({ workerUrl }) {
  const { data, isLoading, isError } = useToggl(workerUrl)
  const DAILY = 8
  const total = data?.totalHours ?? 0
  const today = data?.todayHours ?? 0
  const isRunning = data?.isRunning ?? false
  const hoursLeft = Math.max(0, 40 - total)
  const todayLeft = Math.max(0, DAILY - today)
  const finishTime = new Date(Date.now() + todayLeft * 3600000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <Card accent="cyan">
      <Label>Work This Week</Label>
      {!workerUrl && <p style={{ fontSize: 12, color: T.orange }}>⚙ Set worker URL in settings</p>}
      {workerUrl && isLoading && <p style={{ fontSize: 12, fontFamily: 'monospace', color: T.muted }}>Fetching Toggl...</p>}
      {workerUrl && isError && <p style={{ fontSize: 12, color: T.pink }}>⚠ Toggl unavailable</p>}
      {!isLoading && !isError && (
        <>
          <GlowNumber value={`${total.toFixed(1)}h`} style={{ fontSize: 36 }} />
          <p style={{ fontSize: 12, color: T.muted, letterSpacing: '0.1em', marginTop: 4 }}>of 40h weekly target</p>
          <div style={{ marginTop: 12 }}>
            <ProgressBar pct={(total / 40) * 100} colorStart={T.cyan} colorEnd={T.purple} />
          </div>
          {data?.dailyHours && (
            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
              {data.dailyHours.map(day => {
                const dayPct = Math.min(100, (day.hours / DAILY) * 100)
                return (
                  <div key={day.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', height: 40, borderRadius: 4, background: T.faint, position: 'relative', overflow: 'hidden' }}>
                      {!day.isFuture && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 4, height: `${dayPct}%`, transition: 'height 0.7s', background: day.isToday ? 'linear-gradient(180deg, #9d4edd, #00e5ff)' : dayPct >= 100 ? '#00ff9d55' : '#00e5ff33' }} />
                      )}
                    </div>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: day.isToday ? T.cyan : T.dim }}>{day.label}</span>
                    {!day.isFuture && <span style={{ fontSize: 9, color: T.dim }}>{day.hours.toFixed(1)}h</span>}
                  </div>
                )
              })}
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 12, color: T.muted }}>
            Today: <span style={{ color: T.cyan }}>{today.toFixed(1)}h</span>
            {isRunning && <span className="pulse-anim" style={{ color: T.green, marginLeft: 4 }}>● live</span>}
            <span style={{ marginLeft: 8 }}>
              {todayLeft > 0
                ? <><span style={{ color: T.orange }}>⏱ {todayLeft.toFixed(1)}h left</span>{' · finish ~'}<span style={{ color: T.cyan }}>{finishTime}</span></>
                : <span style={{ color: T.green }}>✓ done for the day!</span>}
            </span>
          </div>
          <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'monospace', color: T.dim }}>
            <span>weekly: {hoursLeft.toFixed(1)}h left</span>
            <span>live via toggl ●</span>
          </div>
        </>
      )}
    </Card>
  )
}

function RoadmapPreview() {
  const active = ROADMAP_DATA.find(p => p.status === 'active')
  const wordPct = (WORD_COUNT.current / WORD_COUNT.target) * 100
  return (
    <Card accent="purple">
      <Label>Learning & Writing</Label>
      {active && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: T.dim }}>{active.phase}</span>
            <span style={{ fontSize: 10, color: T.dimmer }}>{active.weeks}</span>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(221,214,254,1)', fontWeight: 500, marginBottom: 8 }}>{active.title}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {active.items.map(item => {
              const isActive = active.activeItems.includes(item)
              return (
                <span key={item} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', background: isActive ? '#9d4edd33' : T.faint, color: isActive ? '#c77dff' : 'rgba(107,94,138,1)', border: isActive ? '1px solid #9d4edd44' : '1px solid transparent' }}>{item}</span>
              )
            })}
          </div>
        </div>
      )}
      <div style={{ borderTop: `1px solid rgba(88,28,135,0.2)`, paddingTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: T.dim }}>NOVEL</span>
          <span style={{ fontSize: 10, color: T.green }}>{WORD_COUNT.current.toLocaleString()} words</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(196,181,253,1)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{WORD_COUNT.title}</p>
        <ProgressBar pct={wordPct} colorStart={T.green} colorEnd={T.cyan} height={4} />
        <p style={{ fontSize: 9, color: T.dim, marginTop: 4, fontFamily: 'monospace' }}>{(WORD_COUNT.target - WORD_COUNT.current).toLocaleString()} words to go</p>
      </div>
    </Card>
  )
}

function DramaCoursesCard() {
  return (
    <Card accent="orange">
      <Label>Drama Courses</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {COURSES_DATA.map(course => (
          <div key={course.name}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{course.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                  <p style={{ fontSize: 12, color: 'rgba(221,214,254,1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.name}</p>
                  <span style={{ fontSize: 10, fontFamily: T.fo, color: T.orange, flexShrink: 0 }}>{course.progress}%</span>
                </div>
                <p style={{ fontSize: 10, color: T.dimmer }}>{course.instructor} · {course.hours}</p>
              </div>
            </div>
            <ProgressBar pct={course.progress} colorStart={T.orange} colorEnd={T.pink} height={4} />
          </div>
        ))}
      </div>
    </Card>
  )
}

function HabitTracker({ habits, onToggle }) {
  const DAYS = ['M','T','W','T','F','S','S']
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 })()
  return (
    <Card accent="green">
      <Label>Weekly Habits</Label>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 8, paddingRight: 4 }}>
        {DAYS.map((d, i) => <span key={i} style={{ width: 24, textAlign: 'center', fontSize: 10, fontFamily: 'monospace', color: i === todayIdx ? T.cyan : T.dim }}>{d}</span>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {habits.map(habit => {
          const count = habit.done.filter(Boolean).length
          return (
            <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: habit.color, boxShadow: `0 0 4px ${habit.color}`, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(196,181,253,1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{habit.name}</span>
              <span style={{ fontSize: 10, color: T.dim, marginRight: 4 }}>{count}/7</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {habit.done.map((done, i) => (
                  <button key={i} onClick={() => onToggle(habit.id, i)} style={{ width: 24, height: 24, borderRadius: 6, background: done ? habit.color : T.faint, boxShadow: done ? `0 0 6px ${habit.color}66` : i === todayIdx ? `0 0 0 1px ${habit.color}88` : undefined, outline: i === todayIdx ? `1px solid ${habit.color}44` : 'none', outlineOffset: 2, transition: 'all 0.2s' }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function TaskList({ tasks, onToggle, onAdd }) {
  const [input, setInput] = useState('')
  const [tag, setTag] = useState('work')
  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

  const handleAdd = () => {
    const t = input.trim()
    if (!t) return
    onAdd(t, tag)
    setInput('')
  }

  return (
    <Card accent="purple">
      <Label>Today's Tasks</Label>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        {[...pending, ...done].map(task => (
          <li key={task.id} onClick={() => onToggle(task.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '2px 0' }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: task.done ? 'none' : `1px solid rgba(124,58,237,0.5)`, background: task.done ? TAG_COLORS[task.tag] : 'transparent', boxShadow: task.done ? `0 0 6px ${TAG_COLORS[task.tag]}66` : undefined }}>
              {task.done && <span style={{ fontSize: 8, color: '#0a0a1a', fontWeight: 'bold' }}>✓</span>}
            </span>
            <span style={{ fontSize: 12, flex: 1, color: task.done ? T.dim : 'rgba(221,214,254,1)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</span>
            <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '1px 4px', borderRadius: 4, color: TAG_COLORS[task.tag], background: `${TAG_COLORS[task.tag]}18` }}>{task.tag}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={tag} onChange={e => setTag(e.target.value)} style={{ background: T.faint, border: `1px solid rgba(88,28,135,0.3)`, borderRadius: 8, padding: '4px 8px', fontSize: 12, color: TAG_COLORS[tag] }}>
          {Object.keys(TAG_COLORS).map(t => <option key={t} value={t} style={{ background: T.card, color: TAG_COLORS[t] }}>{t}</option>)}
        </select>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Add task..." style={{ flex: 1, background: T.faint, border: `1px solid rgba(88,28,135,0.3)`, borderRadius: 8, padding: '4px 12px', fontSize: 12, color: 'rgba(221,214,254,1)', outline: 'none' }} />
        <button onClick={handleAdd} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(88,28,135,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(196,181,253,1)', fontSize: 18, transition: 'background 0.2s' }}>+</button>
      </div>
    </Card>
  )
}

function TodaySchedule({ workerUrl }) {
  const now = useClock()
  const { data, isLoading, isError } = useCalendar(workerUrl)
  const TZ = 2 * 60 * 60 * 1000
  const todayKey = new Date(now.getTime() + TZ).toISOString().split('T')[0]
  const todayEvents = data?.days?.find(d => d.date === todayKey)?.events ?? []
  const toMins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const curMins = now.getHours() * 60 + now.getMinutes()

  return (
    <Card accent="orange">
      <Label>Today's Schedule</Label>
      {!workerUrl && <p style={{ fontSize: 12, color: T.dimmer }}>Set worker URL to see calendar</p>}
      {workerUrl && isLoading && <p style={{ fontSize: 12, fontFamily: 'monospace', color: T.muted }}>Loading...</p>}
      {workerUrl && isError && <p style={{ fontSize: 12, color: T.pink }}>⚠ Calendar unavailable</p>}
      {!isLoading && !isError && todayEvents.length === 0 && workerUrl && <p style={{ fontSize: 12, color: T.dimmer }}>No events today</p>}
      {!isLoading && !isError && todayEvents.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {todayEvents.filter(e => e.allDay).map(e => (
            <div key={e.id} style={{ padding: '4px 8px', borderRadius: 8, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: `${e.color}22`, color: e.color, border: `1px solid ${e.color}44` }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', opacity: 0.6, marginRight: 8 }}>ALL DAY</span>{e.title}
            </div>
          ))}
          {todayEvents.filter(e => !e.allDay).map(e => {
            const startM = toMins(e.start), endM = toMins(e.end)
            const isActive = curMins >= startM && curMins < endM
            const isPast = curMins >= endM
            return (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, background: isActive ? T.faint : 'transparent' }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: T.dim, width: 80, flexShrink: 0 }}>{e.start}–{e.end}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: e.color, opacity: isPast ? 0.3 : 1, boxShadow: isActive ? `0 0 6px ${e.color}` : undefined, flexShrink: 0 }} />
                <span style={{ fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isPast ? T.dim : isActive ? '#fff' : 'rgba(196,181,253,1)', textDecoration: isPast ? 'line-through' : 'none' }}>{e.title}</span>
                {isActive && <span className="pulse-anim" style={{ fontSize: 9, color: T.green, fontFamily: 'monospace', flexShrink: 0 }}>NOW</span>}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

// ── Views ─────────────────────────────────────────────────────────────────────
function Dashboard({ workerUrl, habits, tasks, toggleHabit, toggleTask, addTask }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <WorkCard workerUrl={workerUrl} />
      <RoadmapPreview />
      <DramaCoursesCard />
      <div style={{ gridColumn: 'span 2' }}>
        <HabitTracker habits={habits} onToggle={toggleHabit} />
      </div>
      <TodaySchedule workerUrl={workerUrl} />
      <div style={{ gridColumn: 'span 3' }}>
        <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
      </div>
    </div>
  )
}

function HabitsView({ habits, tasks, toggleHabit, toggleTask, addTask }) {
  const DAYS_S = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const totalDone = habits.reduce((sum, h) => sum + h.done.filter(Boolean).length, 0)
  const totalPossible = habits.length * 7
  const pct = Math.round((totalDone / totalPossible) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <Card accent="pink">
          <Label>Weekly Score</Label>
          <GlowNumber value={`${pct}%`} colorStart={T.pink} colorEnd={T.purple} style={{ fontSize: 36 }} />
          <p style={{ fontSize: 12, color: T.dim, marginTop: 4 }}>{totalDone}/{totalPossible} habit days</p>
        </Card>
        {habits.slice(0, 2).map(habit => {
          const count = habit.done.filter(Boolean).length
          return (
            <Card key={habit.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: habit.color, boxShadow: `0 0 6px ${habit.color}` }} />
                <p style={{ fontSize: 10, fontFamily: T.fo, fontWeight: 'bold', letterSpacing: '0.15em', color: T.muted, textTransform: 'uppercase' }}>{habit.name}</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {habit.done.map((done, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: done ? habit.color : T.faint, boxShadow: done ? `0 0 8px ${habit.color}66` : undefined }} />
                    <span style={{ fontSize: 9, color: T.dimmer }}>{DAYS_S[i][0]}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: T.dim, marginTop: 8 }}>{count}/7 days</p>
            </Card>
          )
        })}
      </div>
      <HabitTracker habits={habits} onToggle={toggleHabit} />
      <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
    </div>
  )
}

function RoadmapView() {
  const wordPct = (WORD_COUNT.current / WORD_COUNT.target) * 100
  const STATUS = {
    active:   { accent: 'purple', badge: { bg: '#9d4edd22', color: '#9d4edd', border: '#9d4edd44', text: 'ACTIVE'   } },
    upcoming: { accent: 'default', badge: { bg: T.faint,   color: T.dim,      border: 'rgba(255,255,255,0.1)', text: 'UPCOMING' } },
    done:     { accent: 'green',  badge: { bg: '#00ff9d18', color: T.green,   border: '#00ff9d33', text: 'DONE'    } },
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {ROADMAP_DATA.map(phase => {
        const s = STATUS[phase.status]
        return (
          <Card key={phase.phase} accent={s.accent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: T.dim }}>{phase.phase}</span>
                <h3 style={{ fontFamily: T.fo, fontWeight: 'bold', fontSize: 16, color: 'rgba(237,233,254,1)', marginTop: 2 }}>{phase.title}</h3>
                <p style={{ fontSize: 12, color: T.dim }}>{phase.weeks}</p>
              </div>
              <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, border: `1px solid ${s.badge.border}`, background: s.badge.bg, color: s.badge.color, flexShrink: 0 }}>{s.badge.text}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {phase.items.map(item => {
                const isActive = phase.activeItems.includes(item)
                return (
                  <span key={item} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', ...(isActive ? { background: '#9d4edd33', color: '#c77dff', border: '1px solid #9d4edd44' } : phase.status === 'done' ? { background: '#00ff9d18', color: `${T.green}88` } : { background: T.faint, color: 'rgba(74,61,106,1)' }) }}>
                    {phase.status === 'done' ? '✓ ' : ''}{item}
                  </span>
                )
              })}
            </div>
          </Card>
        )
      })}
      <Card accent="green">
        <Label>Novel Progress — {WORD_COUNT.title}</Label>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 12 }}>
          <GlowNumber value={WORD_COUNT.current.toLocaleString()} colorStart={T.green} colorEnd={T.cyan} style={{ fontSize: 30 }} />
          <span style={{ fontSize: 14, color: T.dim, marginBottom: 2 }}>/ {WORD_COUNT.target.toLocaleString()} words</span>
        </div>
        <ProgressBar pct={wordPct} colorStart={T.green} colorEnd={T.cyan} height={8} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: T.dim }}>
          <span>{wordPct.toFixed(1)}% complete</span>
          <span>{(WORD_COUNT.target - WORD_COUNT.current).toLocaleString()} words remaining</span>
        </div>
      </Card>
    </div>
  )
}

function ProjectsView() {
  const STATUS_BADGE = {
    active:  { bg: '#00ff9d18', color: T.green,  text: 'ACTIVE'  },
    paused:  { bg: '#ff910018', color: T.orange, text: 'PAUSED'  },
    planned: { bg: '#9d4edd18', color: T.purple, text: 'PLANNED' },
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
      {PROJECTS_DATA.map(p => {
        const badge = STATUS_BADGE[p.status]
        return (
          <Card key={p.name} accent={p.accent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontFamily: T.fo, fontWeight: 'bold', fontSize: 14, color: 'rgba(237,233,254,1)' }}>{p.name}</h3>
              <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, background: badge.bg, color: badge.color, flexShrink: 0, marginLeft: 8 }}>{badge.text}</span>
            </div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 12, lineHeight: 1.625 }}>{p.description}</p>
            <ProgressBar pct={p.progress} colorStart={T.purple} colorEnd={T.cyan} height={5} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {p.tags.map(tag => <span key={tag} style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 4, background: T.faint, color: T.dim }}>{tag}</span>)}
              </div>
              <span style={{ fontSize: 12, fontFamily: T.fo, color: T.muted }}>{p.progress}%</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function ScheduleView({ workerUrl }) {
  const now = useClock()
  const { data, isLoading, isError } = useCalendar(workerUrl)
  const DAYS_FULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const TZ = 2 * 60 * 60 * 1000
  const todayKey = new Date(now.getTime() + TZ).toISOString().split('T')[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!workerUrl && (
        <Card accent="orange">
          <p style={{ fontSize: 12, color: T.orange }}>⚙ Set your worker URL in settings to load live calendar data.</p>
        </Card>
      )}
      {workerUrl && isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16 }}>
          {DAYS_FULL.map(day => (
            <Card key={day}>
              <p style={{ fontSize: 10, fontFamily: T.fo, color: T.dimmer, textTransform: 'uppercase', marginBottom: 16 }}>{day.slice(0,3)}</p>
              {[1,2,3].map(i => <div key={i} className="shimmer-anim" style={{ height: 40, borderRadius: 8, background: T.faint, marginBottom: 8 }} />)}
            </Card>
          ))}
        </div>
      )}
      {workerUrl && isError && <Card accent="pink"><p style={{ fontSize: 12, color: T.pink }}>⚠ Could not load calendar.</p></Card>}
      {!isLoading && !isError && data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16 }}>
            {data.days.map((day, i) => {
              const isToday = day.date === todayKey
              return (
                <Card key={day.date} accent={isToday ? 'cyan' : 'default'} style={isToday ? { outline: '1px solid rgba(0,229,255,0.2)', outlineOffset: 0 } : {}}>
                  <p style={{ fontSize: 10, fontFamily: T.fo, fontWeight: 'bold', color: isToday ? T.cyan : T.dimmer, textTransform: 'uppercase', marginBottom: 16 }}>{DAYS_FULL[i].slice(0,3)}</p>
                  {day.events.length === 0
                    ? <p style={{ fontSize: 12, color: T.dimmer }}>—</p>
                    : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {day.events.filter(e => e.allDay).map(e => (
                          <div key={e.id} style={{ padding: '3px 6px', borderRadius: 4, fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: `${e.color}22`, color: e.color, border: `1px solid ${e.color}44` }}>{e.title}</div>
                        ))}
                        {day.events.filter(e => !e.allDay).map(e => (
                          <div key={e.id}>
                            <div style={{ height: 3, borderRadius: 9999, marginBottom: 4, background: e.color }} />
                            <p style={{ fontSize: 11, color: 'rgba(221,214,254,1)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</p>
                            <p style={{ fontSize: 9, fontFamily: 'monospace', color: T.dim, marginTop: 2 }}>{e.start}–{e.end}</p>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </Card>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[{color: T.cyan, label: 'Work meetings'}, {color: T.pink, label: 'Personal calendar'}].map(({color, label}) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.muted }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />{label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── AI Scheduling Suggestions view ────────────────────────────────────────────
// Claude populates `suggestions` when you ask it to suggest times.
// Each item: { day, time, activity, icon, color, note }
function SuggestionsView({ suggestions }) {
  const hasData = suggestions && suggestions.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card accent="purple">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #9d4edd, #00e5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✨</div>
          <div>
            <p style={{ fontFamily: T.fo, fontWeight: 'bold', fontSize: 14, color: 'rgba(237,233,254,1)' }}>AI Scheduling Assistant</p>
            <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Claude finds the best gaps in your calendar for writing, exercise, and personal time</p>
          </div>
        </div>

        {!hasData ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📅</p>
            <p style={{ fontFamily: T.fo, fontSize: 12, color: T.dim, marginBottom: 12 }}>No suggestions yet</p>
            <div style={{ background: T.faint, borderRadius: 12, padding: '12px 16px', maxWidth: 380, margin: '0 auto', border: `1px solid rgba(88,28,135,0.3)` }}>
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
                Ask Claude in the chat above:<br />
                <span style={{ color: T.cyan }}>"Look at my calendar this week and suggest the best times for writing my novel, exercise, and personal time"</span>
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {suggestions.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: T.faint, border: `1px solid ${(s.color || T.purple)}22` }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon || '⏰'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <p style={{ fontFamily: T.fo, fontSize: 12, color: s.color || T.purple, fontWeight: 'bold' }}>{s.activity}</p>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: T.muted, flexShrink: 0 }}>{s.day}</span>
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: 11, color: T.dim, marginTop: 2 }}>{s.time}</p>
                  {s.note && <p style={{ fontSize: 11, color: T.dimmer, marginTop: 4, lineHeight: 1.5 }}>{s.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card accent="cyan" style={{ opacity: 0.75 }}>
        <Label>How it works</Label>
        {[
          { icon: '📅', text: 'Claude reads your Google Calendar via MCP tools' },
          { icon: '🔍', text: 'Finds free gaps around existing meetings and commitments' },
          { icon: '🧠', text: 'Considers your energy levels and activity types' },
          { icon: '✨', text: 'Ask any time — Claude updates this view with fresh suggestions' },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
            <p style={{ fontSize: 12, color: T.muted }}>{text}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────
const NAV = [
  { view: 'dashboard',   label: 'Dashboard',    icon: '⊞' },
  { view: 'schedule',    label: 'Schedule',     icon: '📅' },
  { view: 'suggestions', label: 'AI Schedule',  icon: '✨' },
  { view: 'roadmap',     label: 'Roadmap',      icon: '🗺' },
  { view: 'projects',    label: 'Projects',     icon: '📁' },
  { view: 'habits',      label: 'Habits',       icon: '✓'  },
]

function Sidebar({ current, onNavigate }) {
  return (
    <aside style={{ width: 72, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 8, borderRight: `1px solid rgba(88,28,135,0.2)`, background: T.bg, flexShrink: 0 }}>
      <div style={{ marginBottom: 24, width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: T.fo, fontWeight: 900, color: T.bg, background: 'linear-gradient(135deg, #00e5ff, #9d4edd)' }}>OS</div>
      {NAV.map(({ view, icon, label }) => {
        const active = current === view
        return (
          <button key={view} onClick={() => onNavigate(view)} title={label} style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: view === 'dashboard' ? 18 : 16, transition: 'all 0.2s', background: active ? 'rgba(88,28,135,0.4)' : 'transparent', color: active ? T.cyan : T.purple, boxShadow: active ? `0 0 12px rgba(0,229,255,0.2)` : undefined }}>
            {icon}
          </button>
        )
      })}
    </aside>
  )
}

const VIEW_TITLES = { dashboard: 'Dashboard', schedule: 'Schedule', suggestions: 'AI Suggestions', roadmap: 'Roadmap', projects: 'Projects', habits: 'Habits' }

function Topbar({ current, onSettings }) {
  const now = useClock()
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const week = getWeekNumber(now)

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: `1px solid rgba(88,28,135,0.2)` }}>
      <h1 style={{ fontFamily: T.fo, fontWeight: 'bold', fontSize: 18, letterSpacing: '0.15em', color: 'rgba(233,220,255,1)', textTransform: 'uppercase', margin: 0 }}>
        {VIEW_TITLES[current]}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12, fontFamily: 'monospace', color: T.muted }}>
          <span>WK {week}</span>
          <span style={{ color: T.dim }}>{date}</span>
          <span style={{ fontFamily: T.fo, fontSize: 13, letterSpacing: '0.15em', background: `linear-gradient(90deg, ${T.cyan}, ${T.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{time}</span>
        </div>
        <button onClick={onSettings} style={{ width: 32, height: 32, borderRadius: 8, background: T.faint, border: `1px solid rgba(88,28,135,0.3)`, fontSize: 16, color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>⚙</button>
      </div>
    </header>
  )
}

function SettingsPanel({ workerUrl, onSave, onClose }) {
  const [url, setUrl] = useState(workerUrl)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,26,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: T.card, border: `1px solid rgba(88,28,135,0.5)`, borderRadius: 24, padding: 32, width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: T.fo, fontWeight: 'bold', fontSize: 16, color: 'rgba(237,233,254,1)', margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: T.faint, fontSize: 20, color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
        </div>
        <p style={{ fontSize: 10, fontFamily: T.fo, fontWeight: 'bold', letterSpacing: '0.1em', color: T.muted, textTransform: 'uppercase', marginBottom: 6 }}>Cloudflare Worker URL</p>
        <p style={{ fontSize: 12, color: T.dim, marginBottom: 10 }}>Your Toggl + Calendar proxy (no trailing slash)</p>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://life-os-toggl.yourname.workers.dev"
          style={{ width: '100%', background: T.faint, border: `1px solid rgba(88,28,135,0.4)`, borderRadius: 12, padding: '10px 14px', fontSize: 13, color: 'rgba(221,214,254,1)', outline: 'none', fontFamily: 'monospace', marginBottom: 20 }}
        />
        <button
          onClick={() => { onSave(url.trim()); onClose() }}
          style={{ width: '100%', padding: '12px 0', borderRadius: 12, fontSize: 14, fontFamily: T.fo, fontWeight: 'bold', background: 'linear-gradient(135deg, #9d4edd, #00e5ff)', color: T.bg, border: 'none', letterSpacing: '0.1em', cursor: 'pointer' }}
        >
          SAVE
        </button>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('dashboard')
  const [workerUrl, setWorkerUrl] = useState(() => {
    try { return localStorage.getItem('life-os-worker-url') || '' } catch { return '' }
  })
  const [showSettings, setShowSettings] = useState(false)
  const { habits, tasks, toggleHabit, toggleTask, addTask } = useHabits()

  // ── Claude updates this array with scheduling suggestions ──────────────────
  // Format: { day: string, time: string, activity: string, icon: string, color: string, note?: string }
  // Example: { day: 'Monday', time: '07:00–08:00', activity: 'Book Writing', icon: '✍️', color: '#00ff9d', note: 'Before standup — freshest creative energy' }
  const suggestions = []
  // ──────────────────────────────────────────────────────────────────────────

  const saveWorkerUrl = url => {
    setWorkerUrl(url)
    try { localStorage.setItem('life-os-worker-url', url) } catch {}
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':   return <Dashboard workerUrl={workerUrl} habits={habits} tasks={tasks} toggleHabit={toggleHabit} toggleTask={toggleTask} addTask={addTask} />
      case 'schedule':    return <ScheduleView workerUrl={workerUrl} />
      case 'suggestions': return <SuggestionsView suggestions={suggestions} />
      case 'roadmap':     return <RoadmapView />
      case 'projects':    return <ProjectsView />
      case 'habits':      return <HabitsView habits={habits} tasks={tasks} toggleHabit={toggleHabit} toggleTask={toggleTask} addTask={addTask} />
      default:            return null
    }
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.text, fontFamily: T.fr }}>
        <Sidebar current={view} onNavigate={setView} />
        <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
          <Topbar current={view} onSettings={() => setShowSettings(true)} />
          <main style={{ padding: 28 }}>{renderView()}</main>
        </div>
      </div>
      {showSettings && <SettingsPanel workerUrl={workerUrl} onSave={saveWorkerUrl} onClose={() => setShowSettings(false)} />}
    </>
  )
}
