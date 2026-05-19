import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { ROADMAP } from '@/data/roadmap'
import { WORD_COUNT } from '@/data/schedule'

export default function RoadmapPreview() {
  const active = ROADMAP.find(p => p.status === 'active')
  const wordPct = (WORD_COUNT.current / WORD_COUNT.target) * 100

  return (
    <Card accent="purple">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Learning & Writing
      </p>

      {active && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-purple-500">{active.phase}</span>
            <span className="text-[10px] text-purple-600">{active.weeks}</span>
          </div>
          <p className="text-sm text-purple-200 font-medium mb-2">{active.title}</p>
          <div className="flex flex-wrap gap-1">
            {active.items.map(item => {
              const isActive = active.activeItems.includes(item)
              return (
                <span
                  key={item}
                  className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                  style={
                    isActive
                      ? { background: '#9d4edd33', color: '#9d4edd', border: '1px solid #9d4edd44' }
                      : { background: '#ffffff08', color: '#6b5e8a' }
                  }
                >
                  {item}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="border-t border-purple-900/20 pt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-purple-500">NOVEL</span>
          <span className="text-[10px] text-green-400">{WORD_COUNT.current.toLocaleString()} words</span>
        </div>
        <p className="text-xs text-purple-300 mb-1.5 truncate">{WORD_COUNT.title}</p>
        <ProgressBar pct={wordPct} colorStart="#00ff9d" colorEnd="#00e5ff" height={4} />
        <p className="text-[9px] text-purple-600 mt-1 font-mono">
          {(WORD_COUNT.target - WORD_COUNT.current).toLocaleString()} words to go
        </p>
      </div>
    </Card>
  )
}
