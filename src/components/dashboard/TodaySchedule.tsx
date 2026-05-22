import Card from '@/components/ui/Card'
import { useCalendar } from '@/hooks/useCalendar'
import { useClock } from '@/hooks/useClock'

export default function TodaySchedule() {
  const now = useClock()
  const { data, isLoading, isError } = useCalendar()

  const todayKey = (() => {
    const TZ_OFFSET_MS = 2 * 60 * 60 * 1000
    const localMs = now.getTime() + TZ_OFFSET_MS
    return new Date(localMs).toISOString().split('T')[0]
  })()

  const todayEvents = data?.days.find(d => d.date === todayKey)?.events ?? []

  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return (
    <Card accent="orange">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Today's Schedule
      </p>

      {isLoading && <p className="text-xs font-mono text-purple-400">Loading calendar...</p>}
      {isError   && <p className="text-xs text-pink-400">⚠ Calendar unavailable</p>}

      {!isLoading && !isError && todayEvents.length === 0 && (
        <p className="text-xs text-purple-600">No events today</p>
      )}

      {!isLoading && !isError && todayEvents.length > 0 && (
        <div className="space-y-1.5">
          {todayEvents.filter(e => e.allDay).map(event => (
            <div
              key={event.id}
              className="px-2 py-1 rounded-lg text-xs truncate"
              style={{ background: event.color + '22', color: event.color, border: `1px solid ${event.color}44` }}
            >
              <span className="text-[9px] font-mono opacity-60 mr-2">ALL DAY</span>
              {event.title}
            </div>
          ))}
          {todayEvents.filter(e => !e.allDay).map((event) => {
            const startMins = toMinutes(event.start)
            const endMins   = toMinutes(event.end)
            const isActive  = currentMinutes >= startMins && currentMinutes < endMins
            const isPast    = currentMinutes >= endMins

            return (
              <div
                key={event.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${isActive ? 'bg-white/5' : ''}`}
              >
                <span className="text-[10px] font-mono text-purple-600 w-20 flex-shrink-0">
                  {event.start}–{event.end}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: event.color,
                    opacity: isPast ? 0.3 : 1,
                    boxShadow: isActive ? `0 0 6px ${event.color}` : undefined,
                  }}
                />
                <span className={`text-xs flex-1 truncate ${isPast ? 'text-purple-700 line-through' : isActive ? 'text-white' : 'text-purple-300'}`}>
                  {event.title}
                </span>
                {isActive && (
                  <span className="text-[9px] text-green-400 font-mono pulse-dot flex-shrink-0">NOW</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
