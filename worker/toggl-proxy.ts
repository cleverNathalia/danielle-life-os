interface Env {
  TOGGL_TOKEN: string
  ALLOWED_ORIGIN: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_REFRESH_TOKEN: string
  WORK_CALENDAR_ID: string
  PERSONAL_CALENDAR_ID: string
}

interface TogglEntry {
  id: number
  description: string
  start: string
  stop: string | null
  duration: number
}

interface GoogleEvent {
  id: string
  summary?: string
  start: { dateTime?: string; date?: string }
  end:   { dateTime?: string; date?: string }
}

const TZ_OFFSET_MS = 2 * 60 * 60 * 1000 // Africa/Johannesburg UTC+2

function toJohannesburgDateKey(isoString: string): string {
  const localMs = new Date(isoString).getTime() + TZ_OFFSET_MS
  return new Date(localMs).toISOString().split('T')[0]
}

function mondayOfWeek(): Date {
  const nowLocal = new Date(Date.now() + TZ_OFFSET_MS)
  const day = nowLocal.getUTCDay()
  const daysToMon = day === 0 ? 6 : day - 1
  const mon = new Date(nowLocal)
  mon.setUTCDate(nowLocal.getUTCDate() - daysToMon)
  mon.setUTCHours(0, 0, 0, 0)
  return mon
}

async function getGoogleAccessToken(env: Env): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  })
  const json = await res.json() as { access_token?: string; error?: string }
  if (!json.access_token) throw new Error(`Token refresh failed: ${json.error ?? 'unknown'}`)
  return json.access_token
}

async function fetchCalendarEvents(
  calendarId: string,
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<GoogleEvent[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
  })
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Calendar API error ${res.status}: ${body}`)
  }
  const json = await res.json() as { items: GoogleEvent[] }
  return json.items ?? []
}

function formatTime(isoString: string): string {
  const localMs = new Date(isoString).getTime() + TZ_OFFSET_MS
  const d = new Date(localMs)
  const h = String(d.getUTCHours()).padStart(2, '0')
  const m = String(d.getUTCMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const reqOrigin = req.headers.get('Origin') ?? ''
    const isAllowedOrigin =
      /^https?:\/\/localhost(:\d+)?$/.test(reqOrigin) ||
      /^https:\/\/(.*\.)?claude\.ai$/.test(reqOrigin) ||
      reqOrigin === env.ALLOWED_ORIGIN
    const allowedOrigin = isAllowedOrigin ? reqOrigin : env.ALLOWED_ORIGIN
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(req.url)

    // ── /weekly — Toggl ───────────────────────────────────────────────────────
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

        dailyHours.push({ label: DAY_LABELS[d], hours: s / 3600, isToday, isFuture })
      }

      return new Response(
        JSON.stringify({ totalHours: totalSecs / 3600, todayHours: todaySecs / 3600, isRunning, currentDesc, dailyHours }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // ── /calendar — Google Calendar ───────────────────────────────────────────
    if (url.pathname === '/calendar') {
      try {
        const accessToken = await getGoogleAccessToken(env)

        const monday = mondayOfWeek()
        // timeMin = Monday 00:00 SAST expressed as UTC
        const timeMin = new Date(monday.getTime() - TZ_OFFSET_MS).toISOString()
        // timeMax = following Monday 00:00 SAST expressed as UTC
        const timeMax = new Date(monday.getTime() - TZ_OFFSET_MS + 7 * 86_400_000).toISOString()

        const [workEvents, personalEvents] = await Promise.all([
          env.WORK_CALENDAR_ID ? fetchCalendarEvents(env.WORK_CALENDAR_ID, accessToken, timeMin, timeMax) : Promise.resolve([]),
          fetchCalendarEvents(env.PERSONAL_CALENDAR_ID, accessToken, timeMin, timeMax),
        ])

        // Build a map of date → sorted events
        const dayMap: Record<string, { id: string; title: string; start: string; end: string; startIso: string; calendar: string; color: string }[]> = {}

        const processEvents = (events: GoogleEvent[], calendar: 'work' | 'personal', color: string) => {
          for (const e of events) {
            const isAllDay = !e.start.dateTime || !e.end.dateTime
            const dateKey = isAllDay
              ? (e.start.date ?? '')
              : toJohannesburgDateKey(e.start.dateTime!)
            if (!dateKey) continue
            if (!dayMap[dateKey]) dayMap[dateKey] = []

            dayMap[dateKey].push({
              id:       e.id,
              title:    e.summary ?? '(No title)',
              start:    isAllDay ? '' : formatTime(e.start.dateTime!),
              end:      isAllDay ? '' : formatTime(e.end.dateTime!),
              allDay:   isAllDay,
              startIso: isAllDay ? dateKey + 'T00:00:00Z' : e.start.dateTime!,
              calendar,
              color,
            })
          }
        }

        processEvents(workEvents, 'work', '#00e5ff')
        processEvents(personalEvents, 'personal', '#ff2d78')

        // Build 7-day array Mon–Sun
        const days = []
        for (let d = 0; d < 7; d++) {
          const dateMs = monday.getTime() + d * 86_400_000
          const dateKey = new Date(dateMs).toISOString().split('T')[0]
          const events = (dayMap[dateKey] ?? [])
            .sort((a, b) => a.startIso.localeCompare(b.startIso))
            .map(({ startIso: _unused, ...rest }) => rest)

          days.push({ date: dateKey, events })
        }

        return new Response(
          JSON.stringify({ days }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      } catch (err) {
        return new Response(
          JSON.stringify({ error: String(err) }),
          { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  },
}
