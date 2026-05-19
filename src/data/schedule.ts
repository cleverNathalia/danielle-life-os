import type { ScheduleBlock } from '@/types/schedule'

export const SCHEDULE: ScheduleBlock[] = [
  { time: '07:00', label: 'Morning Exercise', type: 'exercise', days: [0, 1, 2, 3, 4] },
  { time: '08:00', label: 'Breakfast & News', type: 'free', days: [0, 1, 2, 3, 4, 5, 6] },
  { time: '09:00', label: 'Deep Work Block', type: 'work', days: [0, 1, 2, 3, 4] },
  { time: '11:00', label: 'Frontend Study', type: 'learning', days: [0, 2, 4] },
  { time: '11:00', label: 'Book Writing', type: 'writing', days: [1, 3] },
  { time: '12:30', label: 'Lunch', type: 'lunch', days: [0, 1, 2, 3, 4] },
  { time: '13:30', label: 'Work Block 2', type: 'work', days: [0, 1, 2, 3, 4] },
  { time: '16:00', label: 'Drama Course', type: 'drama', days: [1, 3, 5] },
  { time: '16:00', label: 'Book Writing', type: 'writing', days: [0, 2, 4] },
  { time: '17:30', label: 'Free Time / Games', type: 'games', days: [0, 1, 2, 3, 4, 5, 6] },
  { time: '10:00', label: 'Weekend Writing', type: 'writing', days: [5, 6] },
  { time: '14:00', label: 'Weekend Learning', type: 'learning', days: [5, 6] },
]

export const BLOCK_COLORS: Record<string, string> = {
  work:     '#00e5ff',
  exercise: '#ff2d78',
  learning: '#9d4edd',
  writing:  '#00ff9d',
  drama:    '#ff9100',
  lunch:    '#ffffff44',
  games:    '#ff9100',
  free:     '#ffffff22',
}

export const WORD_COUNT = {
  current: 47_250,
  target: 120_000,
  title: 'The Shattered Throne',
}
