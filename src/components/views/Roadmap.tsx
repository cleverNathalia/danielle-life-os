import Card from '@/components/ui/Card'
import { ROADMAP } from '@/data/roadmap'
import { WORD_COUNT } from '@/data/schedule'
import ProgressBar from '@/components/ui/ProgressBar'
import GlowNumber from '@/components/ui/GlowNumber'

const STATUS_STYLES = {
  active:   { accent: 'purple' as const, badge: { bg: '#9d4edd22', color: '#9d4edd', border: '#9d4edd44', text: 'ACTIVE' } },
  upcoming: { accent: 'default' as const, badge: { bg: '#ffffff08', color: '#6b5e8a', border: '#ffffff10', text: 'UPCOMING' } },
  done:     { accent: 'green' as const,  badge: { bg: '#00ff9d18', color: '#00ff9d', border: '#00ff9d33', text: 'DONE' } },
}

export default function Roadmap() {
  const wordPct = (WORD_COUNT.current / WORD_COUNT.target) * 100

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        {ROADMAP.map(phase => {
          const style = STATUS_STYLES[phase.status]
          return (
            <Card key={phase.phase} accent={style.accent}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-mono text-purple-600">{phase.phase}</span>
                  <h3 className="text-base font-orbitron font-bold text-purple-100 mt-0.5">{phase.title}</h3>
                  <p className="text-xs text-purple-500">{phase.weeks}</p>
                </div>
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded border"
                  style={{ background: style.badge.bg, color: style.badge.color, borderColor: style.badge.border }}
                >
                  {style.badge.text}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {phase.items.map(item => {
                  const isActive = phase.activeItems.includes(item)
                  return (
                    <span
                      key={item}
                      className="text-xs px-2 py-0.5 rounded font-mono"
                      style={
                        isActive
                          ? { background: '#9d4edd33', color: '#c77dff', border: '1px solid #9d4edd44' }
                          : phase.status === 'done'
                          ? { background: '#00ff9d18', color: '#00ff9d88' }
                          : { background: '#ffffff08', color: '#4a3d6a' }
                      }
                    >
                      {phase.status === 'done' ? '✓ ' : ''}{item}
                    </span>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>

      <Card accent="green">
        <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
          Novel Progress — {WORD_COUNT.title}
        </p>
        <div className="flex items-end gap-4 mb-3">
          <GlowNumber
            value={WORD_COUNT.current.toLocaleString()}
            colorStart="#00ff9d"
            colorEnd="#00e5ff"
            className="text-3xl"
          />
          <span className="text-purple-500 text-sm mb-1">/ {WORD_COUNT.target.toLocaleString()} words</span>
        </div>
        <ProgressBar pct={wordPct} colorStart="#00ff9d" colorEnd="#00e5ff" height={8} />
        <div className="flex justify-between mt-2 text-xs text-purple-500">
          <span>{wordPct.toFixed(1)}% complete</span>
          <span>{(WORD_COUNT.target - WORD_COUNT.current).toLocaleString()} words remaining</span>
        </div>
      </Card>
    </div>
  )
}
