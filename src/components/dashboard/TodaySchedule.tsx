import Card from '@/components/ui/Card'
import { SCHEDULE, BLOCK_COLORS } from '@/data/schedule'
import { useClock } from '@/hooks/useClock'

export default function TodaySchedule() {
  const now = useClock()
  const dayIdx = (() => {
    const d = now.getDay()
    return d === 0 ? 6 : d - 1
  })()

  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayBlocks = SCHEDULE
    .filter(b => b.days.includes(dayIdx))
    .sort((a, b) => a.time.localeCompare(b.time))

  const parseMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  return (
    <Card accent="orange">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Today's Schedule
      </p>

      {todayBlocks.length === 0 ? (
        <p className="text-xs text-purple-600">No blocks scheduled</p>
      ) : (
        <div className="space-y-1.5">
          {todayBlocks.map((block, i) => {
            const blockMins = parseMinutes(block.time)
            const isActive = currentTime >= blockMins && (
              i === todayBlocks.length - 1 || currentTime < parseMinutes(todayBlocks[i + 1].time)
            )
            const isPast = currentTime > blockMins && !isActive

            return (
              <div
                key={`${block.time}-${block.type}`}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-white/5' : ''
                }`}
              >
                <span className="text-[10px] font-mono text-purple-600 w-10 flex-shrink-0">{block.time}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: BLOCK_COLORS[block.type],
                    opacity: isPast ? 0.3 : 1,
                    boxShadow: isActive ? `0 0 6px ${BLOCK_COLORS[block.type]}` : undefined,
                  }}
                />
                <span className={`text-xs flex-1 ${isPast ? 'text-purple-700 line-through' : isActive ? 'text-white' : 'text-purple-300'}`}>
                  {block.label}
                </span>
                {isActive && (
                  <span className="text-[9px] text-green-400 font-mono pulse-dot">NOW</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
