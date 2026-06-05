# Google Calendar Integration Plan

## Context
The app currently shows a hardcoded static schedule. The user wants to replace it with live data from two Google Calendars (personal + work), displayed in both the Dashboard's TodaySchedule card and the full Schedule view. Events are color-coded by calendar: cyan for work, pink for personal. All-day events are skipped. Start and end times are shown. Timezone is Africa/Johannesburg (UTC+2).

Auth uses a one-time OAuth2 refresh token stored as a Cloudflare Worker secret — no in-app login needed.

---

## New Types — `src/types/calendar.ts` (new file)

```ts
export interface CalendarEvent {
  id: string
  title: string
  start: string   // ISO timestamp e.g. "2026-05-19T09:00:00+02:00"
  end: string     // ISO timestamp
  calendar: 'work' | 'personal'
  color: '#00e5ff' | '#ff2d78'
}

export interface CalendarWeekData {
  days: {
    date: string          // YYYY-MM-DD
    events: CalendarEvent[]
  }[]
}
```

---

## Step 1 — One-time OAuth Setup Script

Create `scripts/get-google-token.mjs` — a standalone Node.js script the user runs once locally to get a refresh token:

1. Opens Google OAuth consent URL in the browser
2. User authorizes, pastes the code back into terminal
3. Script exchanges code for tokens and prints the refresh token

The user then runs:
```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GOOGLE_REFRESH_TOKEN
wrangler secret put WORK_CALENDAR_ID       # e.g. user@company.com
wrangler secret put PERSONAL_CALENDAR_ID   # e.g. user@gmail.com
```

---

## Step 2 — Worker: Add `/calendar` endpoint to `worker/toggl-proxy.ts`

Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `WORK_CALENDAR_ID`, `PERSONAL_CALENDAR_ID` to the `Env` interface.

New `/calendar` endpoint logic:
1. Parse `?start=YYYY-MM-DD` query param (defaults to current Monday in UTC+2)
2. Exchange refresh token for access token via `POST https://oauth2.googleapis.com/token`
3. Fetch events from both calendars in parallel using `Promise.all`:
   - `GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`
   - Params: `timeMin`, `timeMax` (full week, ISO format), `singleEvents=true`, `orderBy=startTime`
4. Filter out all-day events (those with `date` instead of `dateTime` on start)
5. Tag each event with `calendar: 'work' | 'personal'` and the appropriate color
6. Group events by date (YYYY-MM-DD in UTC+2), sort by start time within each day
7. Return `CalendarWeekData`

---

## Step 3 — Hook: `src/hooks/useCalendar.ts` (new file)

Mirror the `useToggl` pattern exactly:

```ts
export function useCalendar() {
  return useQuery<CalendarWeekData, Error>({
    queryKey: ['calendar-week'],
    queryFn: fetchCalendarWeek,
    refetchInterval: 5 * 60_000,   // every 5 minutes
    staleTime: 2 * 60_000,
    retry: 2,
  })
}
```

---

## Step 4 — Update `src/components/dashboard/TodaySchedule.tsx`

- Replace static `SCHEDULE` + `BLOCK_COLORS` imports with `useCalendar()`
- Extract today's events from `data.days.find(d => d.date === todayKey)`
- Keep the same active/past/upcoming detection logic — compare `new Date(event.start)` to `now`
- Show start–end time range instead of just start time
- Color the indicator dot using `event.color`
- Add loading/error states matching WorkCard's pattern

---

## Step 5 — Update `src/components/views/Schedule.tsx`

- Replace static `SCHEDULE` import with `useCalendar()`
- Keep the 7-column day grid structure
- Each day column renders its events from `data.days[i].events`
- Show event title + time range (`09:00–10:00`)
- Color the bar using `event.color`
- Add loading skeleton state (e.g. dimmed placeholder cards)
- Highlight today's column as before

---

## Step 6 — Clean up `src/data/schedule.ts`

- Remove the `SCHEDULE` array and `BLOCK_COLORS` object (replaced by live data)
- Keep `WORD_COUNT` (still used by RoadmapPreview and Roadmap view)

---

## Files Modified

| File | Change |
|---|---|
| `worker/toggl-proxy.ts` | Add Env fields + `/calendar` endpoint |
| `src/types/calendar.ts` | New — CalendarEvent, CalendarWeekData |
| `src/hooks/useCalendar.ts` | New — React Query hook |
| `src/components/dashboard/TodaySchedule.tsx` | Use live calendar data |
| `src/components/views/Schedule.tsx` | Use live calendar data |
| `src/data/schedule.ts` | Remove SCHEDULE + BLOCK_COLORS, keep WORD_COUNT |
| `scripts/get-google-token.mjs` | New — one-time OAuth setup script |

---

## Verification

1. Run `node scripts/get-google-token.mjs` → confirms OAuth flow works and prints refresh token
2. `wrangler secret put` all 5 secrets
3. `wrangler deploy` → test `https://life-os-toggl.danielle-dev.workers.dev/calendar` in browser → confirms JSON with today's events
4. `npm run dev` → Schedule view shows live Google Calendar events
5. Dashboard TodaySchedule card shows today's meetings with active event highlighting
6. Work events appear in cyan, personal in pink
7. `npm run build` → confirms no TypeScript errors
