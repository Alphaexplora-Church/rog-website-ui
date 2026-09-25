import { site } from '../../../shared/config/site'
import { useInView } from '../../../shared/hooks/useInView'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Pill } from '../../../shared/components/ui/River'
import { container, revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Home, section 3 — "The Current": the weekly rhythm + the Main Center.
 * REVAMP 2026-09-25 (ROG 11 §6 Home 2).
 *
 * ROG's schedule graphics set time — line — label; this is that pattern
 * as a section: one wave line flows across the full width on the river
 * ground and every gathering in `site.services` sits on it (each stop
 * draws its own segment in turn, so the line flows left → right). Sunday stops
 * are ember. On phones the line becomes a scroll-snap rail.
 *
 * Only the gatherings already in site.ts are shown. The weekday
 * programmes on ROG's schedule graphics (Riverbites, Rivertalks,
 * Riverflow) are credited to another campus — ROG 11 §10 Q5 — so they stay
 * off until ROG confirms which campus runs them.
 *
 * `id="service-times"` kept: other pages link to it.
 */
const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.location.venue}, ${site.location.area}`,
)}`

export function ServicesMainCenterSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section
      ref={ref}
      id="service-times"
      data-plate="dark"
      aria-labelledby="the-current-heading"
      className="grain relative overflow-hidden bg-river py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[20%] blur-[80px] [background-image:radial-gradient(ellipse_40%_45%_at_90%_10%,rgb(6_19_27/0.55),transparent_70%),radial-gradient(ellipse_35%_35%_at_5%_95%,rgb(242_118_28/0.18),transparent_70%)]" />

      <div className={`${container} relative`}>
        <div className={`flex flex-wrap items-end justify-between gap-8 ${reveal}`}>
          <div>
            <Eyebrow className="text-bone/85">The Current</Eyebrow>
            <h2 id="the-current-heading" className="mt-5 font-shout text-[clamp(3rem,7vw,6.5rem)] leading-[0.88] font-extrabold uppercase">
              Every week,
              <br />
              we gather.
            </h2>
          </div>
          <p className="max-w-[34ch] font-whisper text-xl italic leading-snug text-bone/85">
            Come as you are — there&apos;s a seat for you at every service.
          </p>
        </div>

        {/* The line */}
        <div className="relative mt-20">
          <ol className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-10 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
            {site.services.map((s, i) => {
              const sunday = s.day === 'Sunday'
              return (
                <li
                  key={`${s.day}-${s.time}`}
                  className={`w-[62vw] max-w-[16rem] flex-none snap-start md:w-auto md:max-w-none ${revealBase} ${shown ? revealShown : revealHidden}`}
                  style={{ transitionDelay: `${300 + i * 90}ms` }}
                >
                  <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-bone/75 uppercase">{s.day}</p>
                  <p className="mt-2 font-shout text-[clamp(3rem,5.5vw,5rem)] leading-none font-extrabold tabular-nums">
                    {s.time}
                  </p>
                  <span aria-hidden="true" className="relative mt-4 block h-6">
                    {/* the line: each stop draws its own segment so the
                        joined segments read as one current across the row */}
                    <span
                      className={`absolute top-1/2 left-0 h-px origin-left bg-bone/45 transition-transform duration-[1400ms] ease-tide motion-reduce:transition-none ${i === site.services.length - 1 ? 'right-0' : '-right-10 md:-right-6'} ${shown ? 'scale-x-100' : 'scale-x-0'}`}
                      style={{ transitionDelay: `${250 + i * 180}ms` }}
                    />
                    <span className={`absolute top-1/2 left-1 h-3.5 w-3.5 -translate-y-1/2 rounded-full ring-4 ring-river ${sunday ? 'bg-ember' : 'bg-bone'}`} />
                  </span>
                  <div className="mt-3">
                    <Pill tone={sunday ? 'ember' : 'dark'} className={sunday ? 'border-ember/80 !text-bone' : ''}>
                      {s.label ? s.label.toLowerCase() : `${s.language.toLowerCase()} service`}
                    </Pill>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Main Center */}
        <div className={`mt-24 grid gap-10 border-t border-bone/20 pt-12 lg:grid-cols-[1fr_auto] lg:items-end ${reveal}`} style={{ transitionDelay: '500ms' }}>
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-bone/75 uppercase">Main Center</p>
            <p className="mt-4 max-w-[26ch] font-shout text-[clamp(2rem,3.6vw,3.25rem)] leading-[0.95] font-bold uppercase">
              {site.location.venue}
            </p>
            <p className="mt-4 max-w-[52ch] text-bone/80">{site.location.area}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={DIRECTIONS_URL} variant="solid" arrow>
              Get directions
            </Button>
            <Button href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} variant="outline">
              {site.phone}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
