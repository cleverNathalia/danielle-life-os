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

  const views: Record<View, React.ReactElement> = {
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
