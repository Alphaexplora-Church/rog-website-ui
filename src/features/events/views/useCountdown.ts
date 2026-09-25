import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** True once the start time has passed. */
  started: boolean
}

function split(ms: number): Countdown {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    started: ms <= 0,
  }
}

/**
 * Live time remaining until `target` (a UTC ms timestamp), ticking once a
 * second. Returns null when there is no target. The interval stops once
 * the event has started, and is cleared on unmount.
 */
export function useCountdown(target: number | null): Countdown | null {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (target == null || target <= Date.now()) return
    const id = window.setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= target) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [target])

  return target == null ? null : split(target - now)
}
