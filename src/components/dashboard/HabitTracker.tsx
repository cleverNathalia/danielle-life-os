import Card from '@/components/ui/Card'
import type { Habit } from '@/types/habits'

interface HabitTrackerProps {
  habits: Habit[]
  onToggle: (habitId: string, dayIndex: number) => void
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function HabitTracker({ habits, onToggle }: HabitTrackerProps) {
  const todayIdx = (() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1
  })()

  return (
    <Card accent="green">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Weekly Habits
      </p>

      <div className="flex justify-end gap-1.5 mb-2 pr-1">
        {DAYS.map((d, i) => (
          <span
            key={i}
            className={`w-6 text-center text-[10px] font-mono ${i === todayIdx ? 'text-cyan-400' : 'text-purple-600'}`}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="space-y-2">
        {habits.map(habit => {
          const count = habit.done.filter(Boolean).length
          return (
            <div key={habit.id} className="flex items-center gap-2">
              <span
                className="text-[9px] font-mono w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: habit.color, boxShadow: `0 0 4px ${habit.color}` }}
              />
              <span className="text-xs text-purple-300 flex-1 truncate">{habit.name}</span>
              <span className="text-[10px] text-purple-600 mr-1">{count}/7</span>
              <div className="flex gap-1.5">
                {habit.done.map((done, i) => (
                  <button
                    key={i}
                    onClick={() => onToggle(habit.id, i)}
                    className={`w-6 h-6 rounded transition-all duration-200 ${
                      i === todayIdx ? 'ring-1 ring-offset-1 ring-offset-[#0f0f2a]' : ''
                    }`}
                    style={{
                      background: done ? habit.color : '#ffffff08',
                      boxShadow: done ? `0 0 6px ${habit.color}66` : i === todayIdx ? `0 0 0 1px ${habit.color}88` : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
