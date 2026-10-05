import { useEffect, useState } from 'react'
import { site } from '../../../shared/config/site'

/**
 * Watch Live (`/watch-live`) — view model: which service is live right now,
 * or, if none, which one is next and how long until it starts.
 *
 * REWORKED 2026-10-05 (Jude: "kapag 10AM na, 1PM, 4PM ng Sunday, 6PM ng
 * Wednesday, automatic lalabas yung link nung live"). The earlier version
 * only counted down to Sunday services and called it "live" the instant the
 * countdown hit zero — it never ended, skipped Wednesday, and a visitor who
 * arrived mid-service saw a countdown to the NEXT one. Now:
 *
 *  - Every service in `site.services` (Sunday x3 + Wednesday) is considered.
 *  - A service is LIVE from `LIVE_OPENS_BEFORE_MIN` before its start until
 *    its own window closes (Sunday 2h30m, midweek 2h after start).
 *  - State is recomputed every second from the clock, so it flips to live
 *    and back to "next service" by itself with no refresh.
 *  - All times are Philippine time (Asia/Manila, UTC+8, no DST) no matter
 *    where the visitor's device is.
 *
 * Still no Strapi `watch-live` toggle — this is purely schedule-based, so if
 * a service runs long or is cancelled, the window won't know.
 */

/** Live opens this many minutes before the listed start time. */
const LIVE_OPENS_BEFORE_MIN = 10
/** Minutes after the start time that the live window stays open. */
const WINDOW_AFTER_MIN: Record<string, number> = { Sunday: 150, Wednesday: 120 }
const DEFAULT_WINDOW_AFTER_MIN = 120

const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
}
const MANILA_OFFSET_H = 8
const MIN = 60_000

export interface ServiceSlot {
  day: string
  /** "10:00 AM — Taglish", or "6:00 PM — Prayer & Fasting". */
  label: string
  /** Listed start time. */
  start: Date
  /** When the live window opens / closes. */
  opens: Date
  closes: Date
}

function parseTime12h(time: string): { hours: number; minutes: number } {
  const [, h, m, meridiem] = time.match(/(\d+):(\d+)\s*(AM|PM)/i) ?? []
  let hours = Number(h ?? 0) % 12
  if ((meridiem ?? '').toUpperCase() === 'PM') hours += 12
  return { hours, minutes: Number(m ?? 0) }
}

function serviceLabel(svc: (typeof site.services)[number]): string {
  return `${svc.time} — ${svc.label ?? svc.language}`
}

/** Every occurrence of every service from yesterday (Manila) to 8 days out,
 *  sorted by start time. Wide enough that "now" always has a service that is
 *  live or upcoming. */
function buildSlots(nowMs: number): ServiceSlot[] {
  // Manila wall-clock date, read through UTC getters on a shifted instant.
  const manila = new Date(nowMs + MANILA_OFFSET_H * 60 * MIN)
  const y = manila.getUTCFullYear()
  const mo = manila.getUTCMonth()
  const d = manila.getUTCDate()

  const slots: ServiceSlot[] = []
  for (let offset = -1; offset <= 8; offset++) {
    const day = new Date(Date.UTC(y, mo, d + offset))
    const dow = day.getUTCDay()
    for (const svc of site.services) {
      if (DAY_INDEX[svc.day] !== dow) continue
      const { hours, minutes } = parseTime12h(svc.time)
      const startMs =
        Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hours - MANILA_OFFSET_H, minutes)
      const after = WINDOW_AFTER_MIN[svc.day] ?? DEFAULT_WINDOW_AFTER_MIN
      slots.push({
        day: svc.day,
        label: serviceLabel(svc),
        start: new Date(startMs),
        opens: new Date(startMs - LIVE_OPENS_BEFORE_MIN * MIN),
        closes: new Date(startMs + after * MIN),
      })
    }
  }
  return slots.sort((a, b) => a.start.getTime() - b.start.getTime())
}

export interface WatchLiveState {
  isLive: boolean
  /** The service that is live now, or the next one to start. */
  current: ServiceSlot
  /** Time until `current` starts (all zero once live). */
  countdown: { days: number; hours: number; minutes: number; seconds: number }
}

export function getWatchLiveState(nowMs: number): WatchLiveState {
  const slots = buildSlots(nowMs)
  const live = slots.find((s) => nowMs >= s.opens.getTime() && nowMs < s.closes.getTime())
  const current = live ?? slots.find((s) => s.start.getTime() > nowMs) ?? slots[slots.length - 1]!
  const total = live ? 0 : Math.max(0, current.start.getTime() - nowMs)
  return {
    isLive: Boolean(live),
    current,
    countdown: {
      days: Math.floor(total / 86_400_000),
      hours: Math.floor((total % 86_400_000) / 3_600_000),
      minutes: Math.floor((total % 3_600_000) / 60_000),
      seconds: Math.floor((total % 60_000) / 1_000),
    },
  }
}

export function useWatchLiveViewModel() {
  const [state, setState] = useState(() => getWatchLiveState(Date.now()))

  useEffect(() => {
    const id = window.setInterval(() => setState(getWatchLiveState(Date.now())), 1000)
    return () => window.clearInterval(id)
  }, [])

  return state
}
