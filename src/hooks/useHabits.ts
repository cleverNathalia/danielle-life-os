import { useState } from 'react'
import type { Habit, Task } from '@/types/habits'

const DEFAULT_HABITS: Habit[] = [
  { id: 'exercise',  name: 'Exercise',       color: '#ff2d78', done: [1,0,1,0,1,1,0] },
  { id: 'frontend',  name: 'Frontend Study', color: '#9d4edd', done: [1,1,0,1,1,0,1] },
  { id: 'writing',   name: 'Book Writing',   color: '#00ff9d', done: [1,1,1,0,1,1,1] },
  { id: 'drama',     name: 'Drama Course',   color: '#ff9100', done: [0,1,0,1,0,1,0] },
  { id: 'reading',   name: 'Read',           color: '#00e5ff', done: [1,0,1,1,0,1,1] },
]

const DEFAULT_TASKS: Task[] = [
  { id: 1, text: 'Review React hooks documentation', tag: 'learn',    done: false },
  { id: 2, text: 'Write Chapter 3 opening scene',    tag: 'write',    done: false },
  { id: 3, text: 'Complete daily standup',           tag: 'work',     done: true  },
  { id: 4, text: 'Watch Udemy drama lecture 5',      tag: 'drama',    done: false },
  { id: 5, text: '30 min cardio session',            tag: 'personal', done: true  },
  { id: 6, text: 'Push frontend feature branch',     tag: 'work',     done: false },
]

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS)
  const [tasks, setTasks]   = useState<Task[]>(DEFAULT_TASKS)

  const toggleHabit = (habitId: string, dayIndex: number): void => {
    setHabits(prev => prev.map(h =>
      h.id === habitId
        ? { ...h, done: h.done.map((d, i) => (i === dayIndex ? (d ? 0 : 1) : d)) }
        : h
    ))
  }

  const toggleTask = (taskId: number): void => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, done: !t.done } : t
    ))
  }

  const addTask = (text: string, tag: Task['tag']): void => {
    setTasks(prev => [...prev, { id: Date.now(), text, tag, done: false }])
  }

  return { habits, tasks, toggleHabit, toggleTask, addTask }
}
