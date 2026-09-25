import { useEffect, useState } from 'react'
import { site } from '../../../shared/config/site'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, WaveMark, WaveRule } from '../../../shared/components/ui/River'
import {
  container,
  heroRevealBase,
  heroRevealDelay1,
  heroRevealDelay2,
  heroRevealHidden,
  heroRevealShown,
} from '../../../shared/styles/tokens'
import { useWatchLiveViewModel } from '../viewModels/useWatchLiveViewModel'

const countdownUnits = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
] as const

/**
 * Watch Live, section 1 — the live stage. REVAMP 2026-09-25 ("Textured
 * Editorial").
 *
 * The page's whole subject is "when can I watch?", so the countdown IS the
 * hero: giant shout numerals (tabular-nums, so ticking never nudges layout)
 * on an abyss stage with river light pooling up from below and boiling
 * grain. Above it, the state: NEXT SERVICE with the service name, or — once
 * the view model's countdown reaches zero, i.e. the service it was counting
 * to has started — an ember LIVE badge with its glow and pulsing dot. That
 * is read straight off the existing countdown; no new live-detection logic
 * (the Strapi `watch-live` manual toggle is still Phase 3).
 *
 * Kept exactly from before: the view model (Sunday services from
 * `site.services`, rolling to next Sunday), `site.liveStreamUrl` as the one
 * action, and the single-action ending (notify-me was removed 2026-09-23 on
 * Jude's call). The countdown digits deliberately don't animate — the
 * seconds column changes sixty times a minute. Entrance is mount-triggered
 * (first screen), staggered, and off under reduced motion.
 */
export function WatchLiveHero() {
  const { next, countdown } = useWatchLiveViewModel()
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const sundayServices = site.services.filter((s) => s.day === 'Sunday')
  const isLive = countdown.days + countdown.hours + countdown.minutes + countdown.seconds === 0
  const rise = (delay = '') => `${heroRevealBase} ${delay} ${on ? heroRevealShown : heroRevealHidden}`

  return (
    <section
      data-plate="dark"
      aria-labelledby="watch-live-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-abyss text-bone"
    >
      {/* Stage light: river pooling up from the floor, a faint ember rim. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -inset-[20%] blur-[80px] [background-image:radial-gradient(ellipse_55%_40%_at_50%_100%,rgb(14_95_104/0.85),transparent_70%),radial-gradient(ellipse_30%_35%_at_12%_20%,rgb(14_95_104/0.45),transparent_70%),radial-gradient(ellipse_25%_25%_at_90%_15%,rgb(242_118_28/0.16),transparent_70%)]" />
        <WaveMark className="absolute -left-[10%] bottom-[6%] h-auto w-[120vw] max-w-none text-bone/[0.035]" strokeWidth={2.5} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[10%] -z-10 animate-boil bg-[url('/assets/rog/grain.png')] bg-[length:180px] opacity-[0.18] mix-blend-overlay motion-reduce:animate-none" />

      <div className={`${container} relative pt-32 pb-14 sm:pb-20`}>
        {/* Title + state */}
        <div className={`flex flex-wrap items-end justify-between gap-6 ${rise()}`}>
          <div>
            <Eyebrow>Live Stream</Eyebrow>
            <h1
              id="watch-live-title"
              className="mt-5 font-shout text-[clamp(3.25rem,8vw,7rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]"
            >
              Watch Live
            </h1>
          </div>

          {isLive ? (
            <p className="relative isolate inline-flex items-center gap-3 rounded-full bg-ember px-5 py-2.5 font-shout text-2xl font-extrabold uppercase tracking-[0.06em] text-abyss">
              <span aria-hidden="true" className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-ember/35 blur-2xl" />
              <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-live rounded-full bg-abyss motion-reduce:hidden" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-abyss" />
              </span>
              Live now
            </p>
          ) : (
            <p className="inline-flex items-center gap-3 rounded-full border border-bone/25 px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-bone/85">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-shallows" />
              Next service
            </p>
          )}
        </div>

        {/* The countdown — the centrepiece */}
        <div className={`mt-12 sm:mt-16 ${rise(heroRevealDelay1)}`}>
          <p className="font-whisper text-[clamp(1.3rem,2.2vw,2rem)] italic text-sand">
            {isLive ? 'Streaming now — ' : 'Sunday, '}
            {next.label}
          </p>
          <p className="sr-only">
            {isLive
              ? 'The service is starting now.'
              : `Starts in ${countdown.days} days, ${countdown.hours} hours and ${countdown.minutes} minutes.`}
          </p>
          <div aria-hidden="true" className="mt-4 grid grid-cols-4 gap-2 border-y border-bone/15 py-6 sm:gap-6 sm:py-8">
            {countdownUnits.map(({ key, label }, i) => (
              <div key={key} className={`relative ${i > 0 ? 'border-l border-bone/10 pl-3 sm:pl-6' : ''}`}>
                {/* No transition by design — see the file header. */}
                <span
                  className={`block font-shout text-[clamp(3.5rem,16vw,13.5rem)] font-extrabold leading-[0.8] tabular-nums tracking-[-0.02em] ${
                    isLive ? 'text-bone/30' : 'text-bone'
                  }`}
                >
                  {String(countdown[key]).padStart(2, '0')}
                </span>
                <span className="mt-3 block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-shallows sm:text-[0.75rem]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead + action | schedule */}
        <div className={`mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end ${rise(heroRevealDelay2)}`}>
          <div>
            <p className="max-w-[40ch] font-whisper text-[clamp(1.2rem,1.8vw,1.55rem)] italic leading-[1.4] text-bone/85">
              Can&apos;t make it in person? Join us live every Sunday — wherever you are, no seat needed.
            </p>
            <div className="mt-8">
              <Button href={site.liveStreamUrl} variant="ember" size="lg" live>
                Watch Live
              </Button>
            </div>
          </div>

          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-shallows">Sundays</p>
            <ul className="mt-3 border-t border-bone/15">
              {sundayServices.map((svc) => {
                const isNext = next.label === `${svc.time} — ${svc.language}`
                return (
                  <li
                    key={`${svc.time}-${svc.language}`}
                    className="flex items-center justify-between gap-4 border-b border-bone/15 py-3"
                  >
                    <span className={`flex items-center gap-3 font-shout text-2xl font-bold uppercase tabular-nums ${isNext ? 'text-bone' : 'text-bone/60'}`}>
                      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${isNext ? 'bg-ember' : 'bg-bone/25'}`} />
                      {svc.time}
                    </span>
                    <span className={`text-[0.9rem] italic ${isNext ? 'text-bone' : 'text-bone/60'}`}>
                      {svc.language.toLowerCase()}
                      {isNext ? <span className="ml-2 not-italic text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ember">next</span> : null}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <WaveRule className="absolute bottom-0 left-0 text-bone/10" />
    </section>
  )
}
