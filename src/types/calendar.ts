export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  allDay: boolean
  calendar: 'work' | 'personal'
  color: '#00e5ff' | '#ff2d78'
}

export interface CalendarWeekData {
  days: {
    date: string
    events: CalendarEvent[]
  }[]
}
