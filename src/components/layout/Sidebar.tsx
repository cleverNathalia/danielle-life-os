import { LayoutDashboard, Calendar, Map, FolderKanban, CheckSquare } from 'lucide-react'
import type { View } from '@/App'

interface SidebarProps {
  currentView: View
  onNavigate: (view: View) => void
}

const NAV_ITEMS: { view: View; icon: React.ReactNode; label: string }[] = [
  { view: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { view: 'schedule',  icon: <Calendar size={20} />,        label: 'Schedule' },
  { view: 'roadmap',   icon: <Map size={20} />,             label: 'Roadmap' },
  { view: 'projects',  icon: <FolderKanban size={20} />,    label: 'Projects' },
  { view: 'habits',    icon: <CheckSquare size={20} />,     label: 'Habits' },
]

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-[72px] min-h-screen flex flex-col items-center py-6 gap-2 border-r border-purple-900/20 bg-[#0a0a1a]">
      <div className="mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-orbitron font-black"
          style={{ background: 'linear-gradient(135deg, #00e5ff, #9d4edd)', color: '#0a0a1a' }}
        >
          OS
        </div>
      </div>

      {NAV_ITEMS.map(({ view, icon, label }) => {
        const active = currentView === view
        return (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            title={label}
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
              ${active
                ? 'bg-purple-900/40 text-[#00e5ff]'
                : 'text-purple-500 hover:text-purple-200 hover:bg-purple-900/20'
              }
            `}
            style={active ? { boxShadow: '0 0 12px #00e5ff33' } : undefined}
          >
            {icon}
          </button>
        )
      })}
    </aside>
  )
}
