import { useQuery } from '@tanstack/react-query'
import type { TogglWeeklyData } from '@/types/toggl'

const WORKER_URL = import.meta.env.VITE_TOGGL_WORKER_URL as string

async function fetchWeeklyHours(): Promise<TogglWeeklyData> {
  const res = await fetch(`${WORKER_URL}/weekly`)
  if (!res.ok) throw new Error(`Toggl fetch failed: ${res.status}`)
  return res.json() as Promise<TogglWeeklyData>
}

export function useToggl() {
  return useQuery<TogglWeeklyData, Error>({
    queryKey: ['toggl-weekly'],
    queryFn: fetchWeeklyHours,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 2,
  })
}
