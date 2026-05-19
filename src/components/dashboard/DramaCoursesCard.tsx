import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { COURSES } from '@/data/courses'

export default function DramaCoursesCard() {
  return (
    <Card accent="orange">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Drama Courses
      </p>

      <div className="space-y-3">
        {COURSES.map(course => (
          <div key={course.name}>
            <div className="flex items-start gap-2 mb-1">
              <span className="text-base leading-none">{course.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-purple-200 truncate">{course.name}</p>
                  <span className="text-[10px] font-orbitron text-orange-400 flex-shrink-0">{course.progress}%</span>
                </div>
                <p className="text-[10px] text-purple-600">{course.instructor} · {course.hours}</p>
              </div>
            </div>
            <ProgressBar pct={course.progress} colorStart="#ff9100" colorEnd="#ff2d78" height={4} />
          </div>
        ))}
      </div>
    </Card>
  )
}
