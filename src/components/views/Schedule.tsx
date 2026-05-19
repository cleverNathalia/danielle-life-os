import Card from '@/components/ui/Card'
import { SCHEDULE, BLOCK_COLORS } from '@/data/schedule'
import { useClock } from '@/hooks/useClock'

const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Schedule() {
  const now = useClock()
  const todayIdx = (() => {
    const d = now.getDay()
    return d === 0 ? 6 : d - 1
  })()

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-7 gap-3">
        {DAYS_FULL.map((day, dayIdx) => {
          const blocks = SCHEDULE
            .filter(b => b.days.includes(dayIdx))
            .sort((a, b) => a.time.localeCompare(b.time))

          return (
            <Card
              key={day}
              accent={dayIdx === todayIdx ? 'cyan' : 'default'}
              className={dayIdx === todayIdx ? 'ring-1 ring-cyan-500/20' : ''}
            >
              <p className={`text-[10px] font-orbitron font-bold tracking-widest uppercase mb-3 ${
                dayIdx === todayIdx ? 'text-cyan-400' : 'text-purple-600'
              }`}>
                {day.slice(0, 3)}
              </p>

              <div className="space-y-1.5">
                {blocks.map(block => (
                  <div key={`${block.time}-${block.type}`} className="flex items-start gap-1.5">
                    <span className="text-[9px] font-mono text-purple-700 mt-0.5 flex-shrink-0 w-8">{block.time}</span>
                    <div className="flex-1">
                      <div
                        className="h-1 rounded-full mb-0.5"
                        style={{ background: BLOCK_COLORS[block.type] }}
                      />
                      <p className="text-[10px] text-purple-400 leading-tight">{block.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(BLOCK_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-purple-400">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {type}
          </div>
        ))}
      </div>
    </div>
  )
}
