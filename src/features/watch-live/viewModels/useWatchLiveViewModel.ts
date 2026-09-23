import { useEffect, useState } from 'react'
import { site } from '../../../shared/config/site'

/**
 * Watch Live (`/watch-live`) — view model for the countdown to the next
 * service.
 *
 * LOGIC PORTED FROM JUDE'S REFERENCE, 2026-09-22 ("tapos yung watch live,
 * gayahin mo nalang tong logic na to ... pero same concept design nung
 * website natin"). He pasted a full component from a different church-site
 * build (its own "midnight-teal"/"harvest-orange" palette, framer-motion,
 * a fake two-language sermon archive) and asked for the LOGIC — the
 * next-service countdown — re-skinned to this site's
 * own dark/teal design system and real data. Framer-motion is NOT used here:
 * it's an unused dependency elsewhere in this codebase, which already has
 * its own CSS-transition reveal system (`useInView` + `revealBase/Shown` in
 * tokens.ts) — that's the "same concept design" this keeps.
 *
 * SUNDAYS ONLY, from `site.services` (the one already-confirmed source of
 * truth for service times — see ServiceTimesSection.tsx), not the
 * reference's hardcoded 10AM/2PM pair. ROG actually runs three Sunday
 * services (10AM/1PM Taglish, 4PM English), so the countdown advances
 * through all three in order before rolling to next Sunday's first service.
 *
 * NOTIFY-ME REMOVED 2026-09-23 on Jude's call — the hero now ends on the
 * single Watch Live action, so the email state, its `FormEvent` import and
 * `submitNotify` came out with it rather than sitting here unused. If an
 * email capture returns it belongs on the `signup` Strapi type (Doc 2
 * §4.8), not in local component state. Still no `isLive` toggle wired from
 * Strapi's `watch-live` single type — Doc 2 confirms that's a manual
 * toggle, a Phase 3 nicety for auto-detection.
 */

interface NextService {
  label: string
  target: Date
}

function parseTime12h(time: string): { hours: number; minutes: number } {
  const [, h, m, meridiem] = time.match(/(\d+):(\d+)\s*(AM|PM)/i) ?? []
  let hours = Number(h ?? 0) % 12
  if ((meridiem ?? '').toUpperCase() === 'PM') hours += 12
  return { hours, minutes: Number(m ?? 0) }
}

const sundayServices = site.services.filter((s) => s.day === 'Sunday')

/** Walks forward from "now" through this Sunday's services in order, then
 *  next Sunday's first service, returning whichever hasn't started yet. */
function getNextService(): NextService {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const thisSunday = new Date(now)
  thisSunday.setDate(now.getDate() + daysUntilSunday)
  thisSunday.setHours(0, 0, 0, 0)

  for (const svc of sundayServices) {
    const { hours, minutes } = parseTime12h(svc.time)
    const target = new Date(thisSunday)
    target.setHours(hours, minutes, 0, 0)
    if (now < target) {
      return { label: `${svc.time} — ${svc.language}`, target }
    }
  }

  // Every service today (or this coming Sunday) has already started — roll
  // to next Sunday's first service.
  const nextSunday = new Date(thisSunday)
  nextSunday.setDate(thisSunday.getDate() + 7)
  const first = sundayServices[0]
  const { hours, minutes } = parseTime12h(first?.time ?? '10:00 AM')
  nextSunday.setHours(hours, minutes, 0, 0)
  return { label: `${first?.time ?? '10:00 AM'} — ${first?.language ?? 'Taglish'}`, target: nextSunday }
}

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now())

  useEffect(() => {
    setDiff(target.getTime() - Date.now())
    const id = window.setInterval(() => setDiff(target.getTime() - Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const total = Math.max(0, diff)
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
  }
}

export function useWatchLiveViewModel() {
  const [next] = useState(getNextService)
  const countdown = useCountdown(next.target)

  return { next, countdown }
}
