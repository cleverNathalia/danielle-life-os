import { useQuery } from '@tanstack/react-query'
import type { CalendarWeekData } from '@/types/calendar'

const WORKER_URL = import.meta.env.VITE_TOGGL_WORKER_URL as string

async function fetchCalendarWeek(): Promise<CalendarWeekData> {
  const res = await fetch(`${WORKER_URL}/calendar`)
  if (!res.ok) throw new Error(`Calendar fetch failed: ${res.status}`)
  return res.json() as Promise<CalendarWeekData>
}

export function useCalendar() {
  return useQuery<CalendarWeekData, Error>({
    queryKey: ['calendar-week'],
    queryFn: fetchCalendarWeek,
    refetchInterval: 5 * 60_000,
    staleTime: 2 * 60_000,
    retry: 2,
  })
}
