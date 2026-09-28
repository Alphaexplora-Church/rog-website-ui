import { useEffect, useState } from 'react'
import { site } from '../../../shared/config/site'
import { Eyebrow, WaveMark, WaveRule } from '../../../shared/components/ui/River'
import { Button } from '../../../shared/components/ui/Button'
import {
  container,
  heroRevealBase,
  heroRevealDelay1,
  heroRevealDelay2,
  heroRevealHidden,
  heroRevealShown,
} from '../../../shared/styles/tokens'
import { sundayServiceOptions, usePlanAVisitViewModel } from '../viewModels/usePlanAVisitViewModel'

/* Inputs: 2px radius, visible hairline, ember focus ring. Dark surface so
   the panel reads as one utility block. */
const inputCls =
  'h-12 w-full rounded-sm border border-bone/20 bg-abyss/70 px-4 text-[0.95rem] text-bone placeholder:text-bone/35 ' +
  'transition-[border-color,box-shadow] duration-300 ease-current hover:border-bone/40 ' +
  'focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/40 motion-reduce:transition-none'

const labelCls = 'text-[0.72rem] font-semibold tracking-[0.2em] text-bone/75 uppercase'

/**
 * Commune Together (`/plan-a-visit`). REVAMP 2026-09-25.
 *
 * The form is unchanged — same fields, same `required`s, same ViewModel
 * wiring, same local-only confirmation. Field set and copy are Jude's own
 * reference screenshot (2026-09-22). The nav action reads "Commune
 * Together" since 2026-09-23; route, folder and `planAVisit` key are
 * unchanged on purpose (see navigation.ts).
 *
 * Layout: left is the invitation — shout "Commune together." (the page's
 * h1), the reference's "We'll save a seat." as the whisper lead, three
 * short what-to-expect notes, Sunday service times and the address (both
 * read from site.ts). Right is the form in a quiet abyss-2 utility panel —
 * the ONE place on the site a nested-panel look is allowed, because a form
 * needs a clear boundary. The confirmation replaces the form inside that
 * panel: the wave mark draws itself, then a shout thank-you.
 *
 * The what-to-expect notes are new microcopy derived only from what the
 * form itself asks (service/language, party size, first-time vs
 * returning) — no claims about programmes that aren't in our sources.
 */
const notes = [
  {
    title: 'Pick a service',
    body: 'Three Sunday services — choose the time and language that suit you.',
  },
  {
    title: 'Bring everyone',
    body: 'Tell us how many adults and kids are coming so we can make room.',
  },
  {
    title: 'First time or back again',
    body: 'Either way, there’s a seat with your name on it.',
  },
]

export default function PlanAVisit() {
  const { form, setField, submitted, submit, reset } = usePlanAVisitViewModel()
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  const sundays = site.services.filter((s) => s.day === 'Sunday')
  const midweek = site.services.filter((s) => s.day !== 'Sunday')
  const guests = form.adults + form.kids

  return (
    <section
      data-plate="dark"
      aria-labelledby="visit-heading"
      className="relative isolate overflow-hidden bg-abyss text-bone"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -inset-[20%] blur-[70px] [background-image:radial-gradient(ellipse_40%_40%_at_15%_20%,color-mix(in_srgb,var(--color-river)_60%,transparent),transparent_70%),radial-gradient(ellipse_30%_30%_at_85%_85%,color-mix(in_srgb,var(--color-ember)_14%,transparent),transparent_70%)]" />
        <WaveMark className="absolute -left-[12%] bottom-[6%] h-auto w-[70vw] max-w-[1000px] text-bone/[0.035]" strokeWidth={3} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[10%] -z-10 animate-boil bg-[url('/assets/rog/grain.png')] bg-[length:180px] opacity-[0.14] mix-blend-overlay motion-reduce:animate-none" />

      <div className={`${container} grid gap-12 pt-32 pb-24 lg:gap-y-12 sm:pt-40 sm:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-20 xl:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]`}>
        {/* ── Invitation (headline) — first on every screen ── */}
        <div className="lg:col-start-1 lg:row-start-1 lg:pt-6">
          <div className={`${heroRevealBase} ${on ? heroRevealShown : heroRevealHidden}`}>
            <Eyebrow>Plan a visit · Step 01</Eyebrow>
          </div>
          <h1
            id="visit-heading"
            className="mt-6 font-shout text-[clamp(3.75rem,10vw,9rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]"
          >
            {['Commune', 'together.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <span
                  className={`block transition-transform duration-[1200ms] ease-tide motion-reduce:transition-none ${on ? 'translate-y-0' : 'translate-y-[106%] motion-reduce:translate-y-0'}`}
                  style={{ transitionDelay: `${120 + i * 110}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className={`mt-6 font-whisper text-[clamp(1.6rem,3vw,2.5rem)] italic leading-[1.15] text-shallows ${heroRevealBase} ${heroRevealDelay1} ${on ? heroRevealShown : heroRevealHidden}`}>
            We&apos;ll save a seat.
          </p>
        </div>

        {/* ── Invitation (details) — after the form on mobile, under the headline on desktop ── */}
        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
          <div className={`${heroRevealBase} ${heroRevealDelay2} ${on ? heroRevealShown : heroRevealHidden}`}>
            <ol className="lg:-mt-4 grid gap-6 sm:grid-cols-3 sm:gap-8">
              {notes.map((n, i) => (
                <li key={n.title} className="border-t border-bone/15 pt-5">
                  <p className="font-shout text-sm font-bold tabular-nums text-sand">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-2 font-shout text-2xl font-bold uppercase leading-none">{n.title}</p>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-bone/70">{n.body}</p>
                </li>
              ))}
            </ol>

            <WaveRule className="mt-14 text-bone/15" />

            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Sundays</p>
                <ul className="mt-4 grid gap-2">
                  {sundays.map((s) => (
                    <li key={s.time} className="flex items-baseline justify-between gap-4 border-b border-bone/10 pb-2">
                      <span className="font-shout text-3xl font-bold uppercase leading-none tabular-nums">{s.time}</span>
                      <span className="font-whisper text-base italic text-sand lowercase">{s.language}</span>
                    </li>
                  ))}
                </ul>
                {midweek.map((s) => (
                  <p key={s.time} className="mt-4 text-[0.9rem] text-bone/65">
                    {s.day} {s.time} · {s.label ?? s.language}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Where</p>
                <p className="mt-4 font-shout text-2xl font-bold uppercase leading-[1.05]">{site.location.venue}</p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-bone/70">{site.location.area}</p>
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
                  className="mt-3 inline-flex min-h-11 items-center text-[0.92rem] text-bone/80 underline decoration-bone/30 underline-offset-4 transition-colors duration-300 hover:text-sky hover:decoration-sky"
                >
                  {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Utility panel ── */}
        <div className={`order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-28 lg:self-start ${heroRevealBase} ${heroRevealDelay1} ${on ? heroRevealShown : heroRevealHidden}`}>
          <div className="relative border border-bone/10 bg-abyss-2">
            <span aria-hidden="true" className="absolute top-0 left-0 h-[3px] w-full bg-ember" />
            {submitted ? (
              <div className="px-6 py-14 text-center sm:px-10 sm:py-16" role="status" aria-live="polite">
                <WaveMark draw className="mx-auto h-auto w-32 text-ember" strokeWidth={5} />
                <p className="mt-8 text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">
                  Seat saved
                </p>
                <h2 className="mt-4 break-words font-shout text-[clamp(2.75rem,7vw,4rem)] font-extrabold uppercase leading-[0.9]">
                  See you {form.sundayDate || 'this Sunday'}, {form.firstName || 'friend'}.
                </h2>
                <p className="mx-auto mt-5 max-w-[36ch] font-whisper text-lg italic leading-snug text-bone/80">
                  We just saved a spot for {guests} {guests === 1 ? 'guest' : 'guests'} at{' '}
                  {form.serviceTime ? form.serviceTime.split('|')[0] : 'the service you picked'}. A
                  welcome guide is on its way to {form.email || 'your email'}.
                </p>
                <div className="mt-10 flex justify-center">
                  <Button onClick={reset} variant="outline">
                    Save another seat
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
                <div>
                  <h2 className="font-shout text-3xl font-bold uppercase leading-none">Save your seat</h2>
                  <p className="mt-2 text-[0.85rem] text-bone/60">
                    Fields marked <span aria-hidden="true">*</span>
                    <span className="sr-only">with an asterisk</span> are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className={labelCls}>
                      First name *
                    </label>
                    <input
                      id="firstName"
                      required
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(e) => setField('firstName', e.target.value)}
                      placeholder="First name"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className={labelCls}>
                      Last name *
                    </label>
                    <input
                      id="lastName"
                      required
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      placeholder="Last name"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={labelCls}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="your@email.com"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sundayDate" className={labelCls}>
                      Which Sunday? *
                    </label>
                    <input
                      id="sundayDate"
                      type="date"
                      required
                      value={form.sundayDate}
                      onChange={(e) => setField('sundayDate', e.target.value)}
                      className={`${inputCls} [color-scheme:dark]`}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="serviceTime" className={labelCls}>
                      Preferred service *
                    </label>
                    <select
                      id="serviceTime"
                      required
                      value={form.serviceTime}
                      onChange={(e) => setField('serviceTime', e.target.value)}
                      className={`${inputCls} [color-scheme:dark]`}
                    >
                      <option value="" disabled className="bg-abyss-2">
                        Select a service
                      </option>
                      {sundayServiceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-abyss-2">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="adults" className={labelCls}>
                      Adults
                    </label>
                    <input
                      id="adults"
                      type="number"
                      min={0}
                      value={form.adults}
                      onChange={(e) => setField('adults', Math.max(0, Number(e.target.value)))}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="kids" className={labelCls}>
                      Kids
                    </label>
                    <input
                      id="kids"
                      type="number"
                      min={0}
                      value={form.kids}
                      onChange={(e) => setField('kids', Math.max(0, Number(e.target.value)))}
                      className={inputCls}
                    />
                  </div>
                </div>

                <fieldset className="flex flex-col gap-3">
                  <legend className={`${labelCls} mb-3`}>I am a...</legend>
                  <div className="flex flex-wrap gap-3">
                    {(
                      [
                        { value: 'first-time', label: 'First-time Guest' },
                        { value: 'returning', label: 'Returning Guest' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField('guestType', opt.value)}
                        aria-pressed={form.guestType === opt.value}
                        className={`min-h-11 rounded-full border px-5 text-[0.9rem] font-semibold transition-colors duration-300 ease-current ${
                          form.guestType === opt.value
                            ? 'border-bone bg-bone text-abyss'
                            : 'border-bone/25 text-bone/80 hover:border-bone/60 hover:text-bone'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <Button type="submit" variant="ember" size="lg" arrow className="mt-2 w-full">
                  Continue to Guide
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
