import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'

interface Project {
  name: string
  description: string
  status: 'active' | 'paused' | 'planned'
  progress: number
  tags: string[]
  accent: 'cyan' | 'pink' | 'green' | 'orange' | 'purple'
}

const PROJECTS: Project[] = [
  {
    name: 'Life OS Dashboard',
    description: 'Personal life tracking dashboard with Toggl integration, habits, and learning roadmap.',
    status: 'active',
    progress: 65,
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind'],
    accent: 'cyan',
  },
  {
    name: 'The Shattered Throne',
    description: 'Epic fantasy novel. First draft in progress — targeting 120k words.',
    status: 'active',
    progress: 39,
    tags: ['Writing', 'Fantasy', 'Novel'],
    accent: 'green',
  },
  {
    name: 'Frontend Learning Path',
    description: 'Structured 32-week curriculum from HTML/CSS basics to Next.js and portfolio.',
    status: 'active',
    progress: 12,
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    accent: 'purple',
  },
  {
    name: 'Acting Portfolio',
    description: 'Building skills and a reel through Masterclass courses and local improv.',
    status: 'active',
    progress: 20,
    tags: ['Drama', 'Voice', 'Improv'],
    accent: 'orange',
  },
]

const STATUS_BADGE = {
  active:  { bg: '#00ff9d18', color: '#00ff9d', text: 'ACTIVE' },
  paused:  { bg: '#ff910018', color: '#ff9100', text: 'PAUSED' },
  planned: { bg: '#9d4edd18', color: '#9d4edd', text: 'PLANNED' },
}

export default function Projects() {
  return (
    <div className="grid grid-cols-2 gap-5">
      {PROJECTS.map(project => {
        const badge = STATUS_BADGE[project.status]
        return (
          <Card key={project.name} accent={project.accent}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-orbitron font-bold text-sm text-purple-100">{project.name}</h3>
              <span
                className="text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0 ml-2"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.text}
              </span>
            </div>

            <p className="text-xs text-purple-400 mb-3 leading-relaxed">{project.description}</p>

            <ProgressBar pct={project.progress} colorStart="#9d4edd" colorEnd="#00e5ff" height={5} />

            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-wrap gap-1">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-purple-500">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs font-orbitron text-purple-400">{project.progress}%</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
