import WorkCard from '@/components/dashboard/WorkCard'
import TaskList from '@/components/dashboard/TaskList'
import HabitTracker from '@/components/dashboard/HabitTracker'
import TodaySchedule from '@/components/dashboard/TodaySchedule'
import DramaCoursesCard from '@/components/dashboard/DramaCoursesCard'
import RoadmapPreview from '@/components/dashboard/RoadmapPreview'
import { useHabits } from '@/hooks/useHabits'

export default function Dashboard() {
  const { habits, tasks, toggleHabit, toggleTask, addTask } = useHabits()

  return (
    <div className="grid grid-cols-3 gap-5">
      <WorkCard />
      <RoadmapPreview />
      <DramaCoursesCard />

      <div className="col-span-2">
        <HabitTracker habits={habits} onToggle={toggleHabit} />
      </div>
      <TodaySchedule />

      <div className="col-span-3">
        <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
      </div>
    </div>
  )
}
