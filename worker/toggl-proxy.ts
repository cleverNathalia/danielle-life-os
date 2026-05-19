interface Env {
  TOGGL_TOKEN: string
  ALLOWED_ORIGIN: string
}

interface TogglEntry {
  id: number
  description: string
  start: string
  stop: string | null
  duration: number
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(req.url)

    if (url.pathname === '/weekly') {
      const auth = 'Basic ' + btoa(`${env.TOGGL_TOKEN}:api_token`)
      const now = new Date()
      const day = now.getDay()
      const todayIdx = day === 0 ? 6 : day - 1

      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - todayIdx)
      weekStart.setHours(0, 0, 0, 0)

      const startDate = weekStart.toISOString().split('T')[0]
      const endDate = new Date(weekStart.getTime() + 6 * 86_400_000)
        .toISOString().split('T')[0]

      const togglRes = await fetch(
        `https://api.track.toggl.com/api/v9/me/time_entries?start_date=${startDate}&end_date=${endDate}`,
        { headers: { Authorization: auth } }
      )

      if (!togglRes.ok) {
        const body = await togglRes.text()
        return new Response(JSON.stringify({ error: 'Toggl API error', status: togglRes.status, detail: body }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }

      const entries = await togglRes.json() as TogglEntry[]
      const byDate: Record<string, number> = {}
      let isRunning = false
      let currentDesc = ''

      entries.forEach(e => {
        const secs = e.duration < 0
          ? Math.floor((Date.now() - new Date(e.start).getTime()) / 1000)
          : e.duration
        const key = new Date(e.start).toISOString().split('T')[0]
        byDate[key] = (byDate[key] ?? 0) + secs
        if (e.duration < 0) { isRunning = true; currentDesc = e.description ?? '' }
      })

      let totalSecs = 0
      let todaySecs = 0
      const todayKey = now.toISOString().split('T')[0]
      const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      const dailyHours = []

      for (let d = 0; d <= 4; d++) {
        const dayDate = new Date(weekStart)
        dayDate.setDate(weekStart.getDate() + d)
        const key = dayDate.toISOString().split('T')[0]
        const s = byDate[key] ?? 0
        const isToday = key === todayKey
        const isFuture = d > todayIdx

        if (!isFuture) totalSecs += s
        if (isToday) todaySecs = s

        dailyHours.push({
          label: DAY_LABELS[d],
          hours: s / 3600,
          isToday,
          isFuture,
        })
      }

      return new Response(
        JSON.stringify({
          totalHours: totalSecs / 3600,
          todayHours: todaySecs / 3600,
          isRunning,
          currentDesc,
          dailyHours,
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  },
}
