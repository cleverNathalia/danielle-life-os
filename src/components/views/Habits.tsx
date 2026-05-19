import Card from '@/components/ui/Card'
import HabitTracker from '@/components/dashboard/HabitTracker'
import TaskList from '@/components/dashboard/TaskList'
import { useHabits } from '@/hooks/useHabits'
import GlowNumber from '@/components/ui/GlowNumber'

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Habits() {
  const { habits, tasks, toggleHabit, toggleTask, addTask } = useHabits()

  const totalPossible = habits.length * 7
  const totalDone     = habits.reduce((sum, h) => sum + h.done.filter(Boolean).length, 0)
  const streakPct     = Math.round((totalDone / totalPossible) * 100)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-5">
        <Card accent="pink">
          <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-2">
            Weekly Score
          </p>
          <GlowNumber value={`${streakPct}%`} colorStart="#ff2d78" colorEnd="#9d4edd" className="text-4xl" />
          <p className="text-xs text-purple-500 mt-1">{totalDone}/{totalPossible} habit days</p>
        </Card>

        {habits.slice(0, 2).map(habit => {
          const count = habit.done.filter(Boolean).length
          return (
            <Card key={habit.id} accent="default">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: habit.color, boxShadow: `0 0 6px ${habit.color}` }}
                />
                <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase">
                  {habit.name}
                </p>
              </div>
              <div className="flex gap-1.5">
                {habit.done.map((done, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-lg"
                      style={{
                        background: done ? habit.color : '#ffffff08',
                        boxShadow: done ? `0 0 8px ${habit.color}66` : undefined,
                      }}
                    />
                    <span className="text-[9px] text-purple-700">{DAYS_SHORT[i].slice(0, 1)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-purple-500 mt-2">{count}/7 days</p>
            </Card>
          )
        })}
      </div>

      <HabitTracker habits={habits} onToggle={toggleHabit} />

      <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
    </div>
  )
}
