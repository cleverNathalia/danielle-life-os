import { useClock, getWeekNumber } from '@/hooks/useClock'
import type { View } from '@/App'

interface TopbarProps {
  currentView: View
}

const VIEW_TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  schedule:  'Schedule',
  roadmap:   'Roadmap',
  projects:  'Projects',
  habits:    'Habits',
}

export default function Topbar({ currentView }: TopbarProps) {
  const now = useClock()

  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const week = getWeekNumber(now)

  return (
    <header className="flex items-center justify-between px-7 py-4 border-b border-purple-900/20">
      <h1 className="font-orbitron font-bold text-lg tracking-widest text-purple-200 uppercase">
        {VIEW_TITLES[currentView]}
      </h1>

      <div className="flex items-center gap-6 text-xs font-mono text-purple-400">
        <span>WK {week}</span>
        <span className="text-purple-600">{date}</span>
        <span
          className="font-orbitron text-sm tracking-widest"
          style={{ background: 'linear-gradient(90deg, #00e5ff, #9d4edd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {time}
        </span>
      </div>
    </header>
  )
}
