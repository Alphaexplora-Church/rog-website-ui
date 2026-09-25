import type { MouseEvent } from 'react'
import type { Sermon } from '../data/mediaData'

/**
 * Non-component helpers for the Media views (kept out of MediaParts.tsx so
 * that file only exports components — React Fast Refresh needs that).
 */

/** Poster Morph — see file header. Degrades to nothing where unsupported. */
export function markCover(e: MouseEvent<HTMLElement>, slug: string) {
  const covers = e.currentTarget.querySelectorAll<HTMLElement>('[data-cover]')
  const visible = [...covers].find((c) => c.offsetParent !== null)
  if (visible) visible.style.viewTransitionName = `cover-${slug}`
}

/* ── Dates ────────────────────────────────────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Splits a message date into day / month-year for the shout numerals.
 *  No confirmed date → a dash and the date text ("Date pending"). */
export function dateParts(s: Sermon): { day: string; rest: string; pending: boolean } {
  if (s.isoDate && !s.dateIsPlaceholder) {
    const [y, m, d] = s.isoDate.split('-')
    return { day: d, rest: `${MONTHS[Number(m) - 1] ?? ''} ${y}`, pending: false }
  }
  return { day: '—', rest: s.date ?? 'Date pending', pending: true }
}

