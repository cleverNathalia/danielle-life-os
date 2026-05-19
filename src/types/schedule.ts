export type BlockType = 'work' | 'exercise' | 'learning' | 'writing' | 'drama' | 'lunch' | 'games' | 'free'

export interface ScheduleBlock {
  time: string
  label: string
  type: BlockType
  days: number[]
}

export interface RoadmapPhase {
  phase: string
  status: 'active' | 'upcoming' | 'done'
  title: string
  weeks: string
  items: string[]
  activeItems: string[]
}

export interface Course {
  name: string
  instructor: string
  progress: number
  hours: string
  emoji: string
}
