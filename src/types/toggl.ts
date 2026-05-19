export interface TogglWeeklyData {
  totalHours: number
  todayHours: number
  isRunning: boolean
  currentDesc: string
  dailyBreakdown: DailyEntry[]
}

export interface DailyHours {
  label: string
  hours: number
  isToday: boolean
  isFuture: boolean
}

export interface DailyEntry {
  date: string
  hours: number
  projects: ProjectSummary[]
}

export interface ProjectSummary {
  name: string
  client: string
  hours: number
}

export interface TogglTimeEntry {
  id: number
  description: string
  start: string
  stop: string | null
  duration: number
  project_id: number | null
}
