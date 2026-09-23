import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { sundayServiceOptions, usePlanAVisitViewModel } from '../viewModels/usePlanAVisitViewModel'

/* Same visual recipe as Button.tsx's tone="dark" variant="solid" size="md" —
   copied literally rather than imported because Button.tsx has no `type`
   prop (it always renders `type="button"`), and this one needs
   `type="submit"` so Enter-to-submit works inside the form. */
const submitButtonCls =
  'group relative mt-4 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden ' +
  'rounded-full bg-white px-6 text-sm font-heading font-semibold tracking-[0.04em] text-black ' +
  'transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ' +
  'hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] active:scale-[0.97] motion-reduce:transition-none'

const inputCls =
  'w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/15 placeholder:text-white/35 ' +
  'transition focus:ring-2 focus:ring-[#1b7a70] focus:outline-none'

const labelCls = 'text-xs font-bold tracking-[0.15em] text-white/60 uppercase'

/**
 * Plan a Visit (`/plan-a-visit`) — single-step "save a seat" form. Field set
 * and copy are Jude's own reference screenshot, 2026-09-22 ("eto yung laman
 * nung forms"); styled to this site's existing dark/teal system rather than
 * the reference's light/orange one (Jude's call, via AskUserQuestion).
 *
 * No page-level hero image/banner — the form itself is the whole page, same
 * "the content is the page" treatment the reference used, just re-skinned.
 */
export default function PlanAVisit() {
  const { ref, shown } = useInView<HTMLElement>()
  const { form, setField, submitted, submit, reset } = usePlanAVisitViewModel()

  return (
    <section data-plate="dark" className="bg-black text-white">
      <div
        ref={ref}
        className={`mx-auto max-w-xl px-6 pt-40 pb-24 sm:pt-48 sm:pb-32 ${revealBase} ${shown ? revealShown : revealHidden}`}
      >
        {submitted ? (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-10 text-center">
            <p className="text-xs font-bold tracking-[0.22em] text-[#8FD4C9] uppercase">
              Seat saved
            </p>
            <h1 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">
              See you {form.sundayDate || 'this Sunday'}, {form.firstName || 'friend'}.
            </h1>
            <p className="mt-3 text-sm text-white/55">
              We just saved a spot for {form.adults + form.kids}{' '}
              {form.adults + form.kids === 1 ? 'guest' : 'guests'} at{' '}
              {form.serviceTime ? form.serviceTime.split('|')[0] : 'the service you picked'}. A
              welcome guide is on its way to {form.email || 'your email'}.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 text-xs font-bold tracking-[0.15em] text-white/60 uppercase underline underline-offset-4 transition hover:text-white"
            >
              Plan another visit
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold tracking-[0.22em] text-[#8FD4C9] uppercase">Step 01</p>
            <h1 className="mt-4 text-balance font-heading text-4xl font-bold leading-[1.05] sm:text-5xl">
              We&apos;ll save a seat.
            </h1>

            <form onSubmit={submit} className="mt-10 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className={labelCls}>
                    First name *
                  </label>
                  <input
                    id="firstName"
                    required
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
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="your@email.com"
                  className={inputCls}
                />
              </div>

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
                  <option value="" disabled className="bg-[#0B0F14]">
                    Select a service
                  </option>
                  {sundayServiceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0B0F14]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <legend className={labelCls}>I am a...</legend>
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
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        form.guestType === opt.value
                          ? 'bg-[#1b7a70] text-white'
                          : 'bg-white/5 text-white/70 ring-1 ring-white/15 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button type="submit" className={submitButtonCls}>
                Continue to Guide
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
