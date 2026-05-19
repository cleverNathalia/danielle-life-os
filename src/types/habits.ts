export interface Habit {
  id: string
  name: string
  color: string
  done: number[]
}

export interface Task {
  id: number
  text: string
  tag: TaskTag
  done: boolean
}

export type TaskTag = 'work' | 'learn' | 'write' | 'drama' | 'personal'
