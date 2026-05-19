import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import GlowNumber from '@/components/ui/GlowNumber'
import { useToggl } from '@/hooks/useToggl'

const DAILY_TARGET = 8

export default function WorkCard() {
  const { data, isLoading, isError } = useToggl()

  const total     = data?.totalHours  ?? 0
  const today     = data?.todayHours  ?? 0
  const isRunning = data?.isRunning   ?? false
  const hoursLeft = Math.max(0, 40 - total)
  const pct       = (total / 40) * 100

  const todayLeft = Math.max(0, DAILY_TARGET - today)
  const finishTime = new Date(Date.now() + todayLeft * 3_600_000)
    .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <Card accent="cyan">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Work This Week
      </p>

      {isLoading && <p className="text-xs font-mono text-purple-400">Fetching Toggl...</p>}
      {isError   && <p className="text-xs text-pink-400">⚠ Toggl unavailable</p>}

      {!isLoading && !isError && (
        <>
          <GlowNumber value={`${total.toFixed(1)}h`} className="text-4xl" />
          <p className="text-xs text-purple-400 tracking-wider mt-1">of 40h weekly target</p>

          <div className="mt-3">
            <ProgressBar pct={pct} colorStart="#00e5ff" colorEnd="#9d4edd" />
          </div>

          {data?.dailyHours && (
            <div className="mt-3 flex gap-1.5">
              {data.dailyHours.map(day => {
                const dayPct = Math.min(100, (day.hours / DAILY_TARGET) * 100)
                return (
                  <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-10 rounded bg-white/5 relative overflow-hidden">
                      {!day.isFuture && (
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded transition-all duration-700"
                          style={{
                            height: `${dayPct}%`,
                            background: day.isToday
                              ? 'linear-gradient(180deg, #9d4edd, #00e5ff)'
                              : dayPct >= 100
                              ? '#00ff9d55'
                              : '#00e5ff33',
                          }}
                        />
                      )}
                    </div>
                    <span className={`text-[9px] font-mono ${day.isToday ? 'text-cyan-400' : 'text-purple-600'}`}>
                      {day.label}
                    </span>
                    {!day.isFuture && (
                      <span className="text-[9px] text-purple-500">{day.hours.toFixed(1)}h</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-3 text-xs text-purple-400">
            Today:{' '}
            <span className="text-cyan-400">{today.toFixed(1)}h</span>
            {isRunning && <span className="text-green-400 ml-1 pulse-dot">● live</span>}
            <span className="ml-2">
              {todayLeft > 0 ? (
                <>
                  <span className="text-orange-400">⏱ {todayLeft.toFixed(1)}h left</span>
                  {' · finish ~'}
                  <span className="text-cyan-400">{finishTime}</span>
                </>
              ) : (
                <span className="text-green-400">✓ done for the day!</span>
              )}
            </span>
          </div>

          <div className="mt-1 flex justify-between text-[9px] text-purple-600 font-mono">
            <span>weekly: {hoursLeft.toFixed(1)}h left</span>
            <span>live via toggl ●</span>
          </div>
        </>
      )}
    </Card>
  )
}
