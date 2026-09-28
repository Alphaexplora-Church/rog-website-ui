import { PageHero } from '../../../shared/components/ui/PageHero'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Reveal, SectionHead, WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { useRbsiViewModel } from '../viewModels/useRbsiViewModel'

/**
 * `/about/rbsi` — River Biblical Supernatural Institute. NEW 2026-09-28.
 *
 * Content from the old riverofgod.ph RBSI page Jude sent. RBSI's own banner
 * is a navy book-and-library duotone — the site's deep / river blues are
 * already that colour, so the page stays in the site system and reads as
 * RBSI at the same time.
 *
 *   1. PageHero — library photo, "A Bible school within reach.", the crest
 *      and the three promises in the aside
 *   2. Aim + 2 Timothy 2:15 (abyss)
 *   3. Vision & mission (bone plate) with the community photo
 *   4. Partners in Ministry (river) — Luke 8:1-3 and the PARTNER WITH US form
 *   5. Inquire now (abyss) — the contact form
 */

const inputCls =
  'h-12 w-full rounded-sm border border-bone/20 bg-abyss/70 px-4 text-[0.95rem] text-bone placeholder:text-bone/35 ' +
  'transition-[border-color,box-shadow] duration-300 ease-current hover:border-bone/40 ' +
  'focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/40 motion-reduce:transition-none'
const labelCls = 'text-[0.72rem] font-semibold tracking-[0.2em] text-bone/75 uppercase'

function Crest({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label="River Biblical Supernatural Institute crest, established 2024"
      className={`block aspect-[293/422] bg-current ${className}`}
      style={{ WebkitMask: `url('${src}') center/contain no-repeat`, mask: `url('${src}') center/contain no-repeat` }}
    />
  )
}

export default function Rbsi() {
  const { rbsi, form, setField, submitted, submit, reset } = useRbsiViewModel()

  return (
    <>
      <PageHero
        eyebrow={`About · ${rbsi.short} · Est. ${rbsi.established}`}
        title={['A Bible school', 'within reach.']}
        lead={rbsi.name}
        image={rbsi.heroImage}
        imagePosition="center"
        aside={
          <div className="flex items-end gap-8">
            <Crest src={rbsi.crest} className="w-28 text-bone sm:w-36" />
            <ul className="grid gap-3 border-l border-bone/20 pl-6">
              {rbsi.promises.map((p) => (
                <li key={p} className="font-shout text-2xl font-bold uppercase leading-none sm:text-3xl">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        }
        actions={
          <>
            <Button href="#rbsi-inquire" variant="ember" arrow>
              Inquire now
            </Button>
            <Button href={rbsi.partners.formUrl} variant="outline">
              Partner with us
            </Button>
          </>
        }
      />

      {/* 2 · Aim */}
      <section data-plate="dark" aria-labelledby="rbsi-aim-heading" className="relative bg-abyss py-24 text-bone sm:py-32">
        <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20`}>
          <div>
            <Eyebrow>Our aim</Eyebrow>
            <h2 id="rbsi-aim-heading" className="sr-only">
              Our aim
            </h2>
            <Reveal>
              <p className="mt-6 font-whisper text-[clamp(1.6rem,3vw,2.75rem)] italic leading-[1.25] text-balance">
                {rbsi.aim}
              </p>
            </Reveal>
          </div>
          <Reveal>
            <figure className="border-l-2 border-ember pl-6">
              <blockquote className="font-whisper text-[clamp(1.2rem,1.7vw,1.5rem)] italic leading-[1.45] text-bone/85">
                &ldquo;{rbsi.scripture.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.2em] text-sand uppercase">
                <span aria-hidden="true" className="h-px w-10 bg-sand/60" />
                {rbsi.scripture.ref}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* 3 · Vision & mission — text on the left, the RBSI photo pinned top-right */}
      <section data-plate="light" aria-labelledby="rbsi-vm-heading" className="relative bg-bone py-24 text-abyss sm:py-32">
        <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16`}>
          <div>
            <SectionHead
              id="rbsi-vm-heading"
              tone="light"
              eyebrow="Vision & mission"
              title={<>Rightly dividing<br />the word.</>}
            />
            <dl className="mt-14 grid gap-10">
              {[
                ['Vision', rbsi.vision],
                ['Mission', rbsi.mission],
              ].map(([label, text], i) => (
                <Reveal key={label} delay={i * 80}>
                  <dt className="flex items-center gap-4 font-shout text-4xl font-extrabold uppercase leading-none">
                    <span className="tabular-nums text-ember-ink">{String(i + 1).padStart(2, '0')}</span>
                    {label}
                  </dt>
                  <dd className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-abyss/80">{text}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="grain relative aspect-[4/3] overflow-hidden bg-deep">
              <img
                src={rbsi.photo}
                alt="The RBSI community gathered together at River of God"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Partners in Ministry */}
      <section data-plate="dark" aria-labelledby="rbsi-pim-heading" className="relative overflow-hidden bg-river py-24 text-bone sm:py-32">
        <div aria-hidden="true" className="grain absolute inset-0" />
        <WaveMark className="pointer-events-none absolute -right-[10%] top-10 h-auto w-[60vw] max-w-[900px] text-bone/[0.05]" />
        <div className={`${container} relative grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
          <div>
            <Eyebrow className="text-bone/80">Give to missions</Eyebrow>
            <h2
              id="rbsi-pim-heading"
              className="mt-5 font-shout text-[clamp(3rem,7vw,6.25rem)] font-extrabold uppercase leading-[0.88]"
            >
              Partners
              <br />
              in ministry.
            </h2>
            <p className="mt-8 max-w-[48ch] leading-relaxed text-bone/85">{rbsi.partners.body}</p>
            <div className="mt-10">
              <Button href={rbsi.partners.formUrl} variant="ember" size="lg" arrow>
                Partner with us
              </Button>
            </div>
          </div>
          <Reveal className="lg:self-center">
            <figure>
              <blockquote className="font-whisper text-[clamp(1.35rem,2.2vw,2rem)] italic leading-[1.4] text-bone">
                &ldquo;{rbsi.partners.scripture.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.2em] text-sand uppercase">
                <span aria-hidden="true" className="h-px w-10 bg-sand/60" />
                {rbsi.partners.scripture.ref}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* 5 · Inquire now */}
      <section
        id="rbsi-inquire"
        data-plate="dark"
        aria-labelledby="rbsi-inquire-heading"
        className="relative scroll-mt-24 bg-abyss py-24 text-bone sm:py-32"
      >
        <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
          <div>
            <SectionHead
              id="rbsi-inquire-heading"
              eyebrow="Questions about RBSI"
              title={<>Inquire<br />now.</>}
              lead="Send us a message and the RBSI team will get back to you."
            />
            <Crest src={rbsi.crest} className="mt-12 hidden w-24 text-bone/20 lg:block" />
          </div>

          <div className="relative border border-bone/10 bg-abyss-2">
            <span aria-hidden="true" className="absolute top-0 left-0 h-[3px] w-full bg-ember" />
            {submitted ? (
              <div className="px-6 py-14 text-center sm:px-10 sm:py-16" role="status" aria-live="polite">
                <WaveMark draw className="mx-auto h-auto w-32 text-ember" strokeWidth={5} />
                <p className="mt-8 text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Message received</p>
                <p className="mt-4 break-words font-shout text-[clamp(2.5rem,6vw,3.75rem)] font-extrabold uppercase leading-[0.9]">
                  Thank you, {form.firstName || 'friend'}.
                </p>
                <p className="mx-auto mt-5 max-w-[36ch] font-whisper text-lg italic leading-snug text-bone/80">
                  The RBSI team will reply to {form.email || 'your email'}.
                </p>
                <div className="mt-10 flex justify-center">
                  <Button onClick={reset} variant="outline">
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
                <p className="text-[0.85rem] text-bone/60">
                  Fields marked <span aria-hidden="true">*</span>
                  <span className="sr-only">with an asterisk</span> are required.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="rbsi-first" className={labelCls}>First name *</label>
                    <input id="rbsi-first" required autoComplete="given-name" value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} placeholder="First name" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="rbsi-last" className={labelCls}>Last name *</label>
                    <input id="rbsi-last" required autoComplete="family-name" value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} placeholder="Last name" className={inputCls} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="rbsi-email" className={labelCls}>Email *</label>
                  <input id="rbsi-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="your@email.com" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="rbsi-subject" className={labelCls}>Subject *</label>
                  <input id="rbsi-subject" required value={form.subject} onChange={(e) => setField('subject', e.target.value)} placeholder="e.g. Enrolment for next term" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="rbsi-message" className={labelCls}>Message *</label>
                  <textarea
                    id="rbsi-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    placeholder="How can we help?"
                    className={`${inputCls} h-auto min-h-36 resize-y py-3 leading-relaxed`}
                  />
                </div>
                <Button type="submit" variant="ember" size="lg" arrow className="mt-2 w-full">
                  Submit
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
