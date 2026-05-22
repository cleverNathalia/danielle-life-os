import Card from '@/components/ui/Card'
import { useCalendar } from '@/hooks/useCalendar'
import { useClock } from '@/hooks/useClock'

const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Schedule() {
  const now = useClock()
  const { data, isLoading, isError } = useCalendar()

  const todayKey = (() => {
    const TZ_OFFSET_MS = 2 * 60 * 60 * 1000
    const localMs = now.getTime() + TZ_OFFSET_MS
    return new Date(localMs).toISOString().split('T')[0]
  })()

  return (
    <div className="space-y-5">
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {DAYS_FULL.map(day => (
            <Card key={day} accent="default">
              <p className="text-xs font-orbitron font-bold tracking-widest text-purple-700 uppercase mb-4">
                <span className="lg:hidden">{day.slice(0, 3)}</span>
                <span className="hidden lg:inline">{day}</span>
              </p>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 rounded bg-white/5 animate-pulse" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card accent="pink">
          <p className="text-xs text-pink-400">⚠ Could not load calendar. Check your worker secrets.</p>
        </Card>
      )}

      {!isLoading && !isError && data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {data.days.map((day, i) => {
              const isToday = day.date === todayKey

              return (
                <Card
                  key={day.date}
                  accent={isToday ? 'cyan' : 'default'}
                  className={isToday ? 'ring-1 ring-cyan-500/20' : ''}
                >
                  <p className={`text-xs font-orbitron font-bold tracking-widest uppercase mb-4 ${
                    isToday ? 'text-cyan-400' : 'text-purple-600'
                  }`}>
                    <span className="lg:hidden">{DAYS_FULL[i].slice(0, 3)}</span>
                    <span className="hidden lg:inline">{DAYS_FULL[i]}</span>
                  </p>

                  {day.events.length === 0 ? (
                    <p className="text-xs text-purple-800">—</p>
                  ) : (
                    <div className="space-y-3">
                      {day.events.filter(e => e.allDay).map(event => (
                        <div
                          key={event.id}
                          className="px-2 py-1 rounded text-[10px] truncate"
                          style={{ background: event.color + '22', color: event.color, border: `1px solid ${event.color}44` }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {day.events.filter(e => !e.allDay).map(event => (
                        <div key={event.id}>
                          <div className="h-1 rounded-full mb-1.5" style={{ background: event.color }} />
                          <p className="text-xs text-purple-200 leading-tight truncate">{event.title}</p>
                          <p className="text-[10px] font-mono text-purple-500 mt-0.5">{event.start}–{event.end}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-xs text-purple-400">
              <span className="w-2 h-2 rounded-full" style={{ background: '#00e5ff' }} />
              Work meetings
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-400">
              <span className="w-2 h-2 rounded-full" style={{ background: '#ff2d78' }} />
              Personal calendar
            </div>
          </div>
        </>
      )}
    </div>
  )
}
