import { useRef } from 'react'
import { PageHero } from '../../../shared/components/ui/PageHero'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Pill, Reveal, RiverImage, SectionHead, WaveMark, WaveRule } from '../../../shared/components/ui/River'
import { useInView } from '../../../shared/hooks/useInView'
import { container, displayL, maskLineBase, maskLineHidden, maskLineShown } from '../../../shared/styles/tokens'
import type { HimLeaderGroup, HimLeaderProfile } from '../data/himPhilippinesData'
import { useHimPhilippinesViewModel } from '../viewModels/useHimPhilippinesViewModel'

/**
 * H.I.M. Philippines — /about/him-ph. REVAMP 2026-09-25 ("Textured Editorial").
 *
 * All data comes from `useHimPhilippinesViewModel` (Model: himPhilippinesData,
 * copy from riverofgod.ph). Seven sections, each a different shape, on
 * alternating grounds:
 *
 *  1. PageHero — worship photo, "H.I.M. / Philippines", three-fact aside.
 *  2. Mission & vision (abyss) — the motto as a giant three-line shout, the
 *     mission and vision in whisper beside it.
 *  3. Connection band (river) — ROG mark ↔ HIM mark with the one-paragraph
 *     link between them.
 *  4. Leadership (abyss) — a featured pair of tall portraits, then an
 *     editorial directory (numbered rows). Each person appears ONCE with Pill
 *     tags for every group they serve on (the merge happens in the Model).
 *     Portraits use Colour Bloom: the source photos have mismatched
 *     backgrounds, so the River duotone unifies them at rest.
 *  5. Core values (deep) — a horizontal poster rail, 12 posters, scroll-snap
 *     with a peek; arrow buttons on desktop, swipe on touch.
 *  6. Statement of faith (bone light plate) — pinned head, numbered list.
 *  7. Membership (river) — shout CTA, the ONE ember button (PDF download),
 *     contact card and the NPC DPO/DPS badge.
 */
export default function HimPhilippines() {
  const vm = useHimPhilippinesViewModel()

  return (
    <>
      <PageHero
        eyebrow="About · Harvest International Ministry"
        title={['H.I.M.', 'Philippines']}
        lead={vm.hero.introduction}
        image={vm.hero.image}
        imagePosition="64% 35%"
        actions={
          <>
            <Button href="#join-him-philippines" variant="solid" arrow>
              Join the network
            </Button>
            <Button href="#leadership" variant="ghost">
              Meet the leaders
            </Button>
          </>
        }
        aside={
          <dl className="grid grid-cols-3 gap-6 border-t border-bone/20 pt-6 lg:w-[19rem] lg:grid-cols-1 lg:gap-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            {vm.hero.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse gap-1">
                <dt className="text-[0.8rem] leading-snug text-bone/70">{fact.label}</dt>
                <dd className="font-shout text-[clamp(2.25rem,5vw,3.75rem)] leading-none font-extrabold tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        }
      />
      <MissionVision mission={vm.mission} />
      <ConnectionBand brand={vm.brand} text={vm.connection} />
      <Leadership leadership={vm.leadership} />
      <CoreValues coreValues={vm.coreValues} />
      <StatementOfFaith sof={vm.statementOfFaith} />
      <Join membership={vm.membership} />
    </>
  )
}

type VM = ReturnType<typeof useHimPhilippinesViewModel>
const pad = (n: number) => String(n).padStart(2, '0')

/* ── 2. Mission & vision ───────────────────────────────────────────────── */

function MissionVision({ mission }: { mission: VM['mission'] }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <section
      id="overview"
      data-plate="dark"
      aria-labelledby="overview-heading"
      className="relative isolate scroll-mt-20 overflow-hidden bg-abyss py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[15%] -z-10 blur-[60px] [background-image:radial-gradient(ellipse_40%_40%_at_10%_30%,color-mix(in_srgb,var(--color-river)_45%,transparent),transparent_70%)]" />
      <div className={`${container} grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20`}>
        <div ref={ref}>
          <Eyebrow>Mission and vision</Eyebrow>
          <h2 id="overview-heading" className={`mt-6 ${displayL}`}>
            {mission.motto.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <span
                  className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden} ${i === 2 ? 'text-bone' : i === 1 ? 'text-bone/70' : 'text-shallows'}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <span aria-hidden="true" className="mt-10 block h-1.5 w-28 bg-ember" />
        </div>

        <Reveal className="grid content-end gap-12 lg:pb-3">
          <article>
            <h3 className="text-[0.72rem] font-semibold tracking-[0.22em] text-sand uppercase">Our Mission</h3>
            <p className="mt-4 font-whisper text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.5] italic text-bone/90">
              {mission.mission}
            </p>
          </article>
          <WaveRule className="text-bone/15" />
          <article>
            <h3 className="text-[0.72rem] font-semibold tracking-[0.22em] text-sand uppercase">Our Vision</h3>
            <p className="mt-4 font-whisper text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.5] italic text-bone/90">
              {mission.vision}
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 3. River of God ↔ HIM band ────────────────────────────────────────── */

function ConnectionBand({ brand, text }: { brand: VM['brand']; text: string }) {
  return (
    <section
      data-plate="dark"
      aria-labelledby="connection-heading"
      className="relative isolate overflow-hidden bg-river py-24 text-bone sm:py-28"
    >
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
      <WaveMark
        className="pointer-events-none absolute -right-[10%] -bottom-[20%] -z-10 h-auto w-[80vw] max-w-[900px] text-bone/[0.06]"
        strokeWidth={3}
      />
      <Reveal className={`${container} grid items-center gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20`}>
        <div className="flex items-center gap-5 sm:gap-8">
          <img src={brand.rogLogo.src} alt={brand.rogLogo.alt} className="h-auto w-28 sm:w-40" />
          <span aria-hidden="true" className="flex flex-col items-center gap-2 text-bone/70">
            <WaveMark className="h-4 w-12" strokeWidth={7} />
          </span>
          <img src={brand.himLogo} alt={brand.himLogoAlt} className="h-auto w-40 sm:w-56" />
        </div>
        <div>
          <h2 id="connection-heading" className="font-shout text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.92] font-extrabold uppercase">
            Where River of God fits
          </h2>
          <p className="mt-5 max-w-[60ch] text-[1.05rem] leading-relaxed text-bone/90">{text}</p>
        </div>
      </Reveal>
    </section>
  )
}

/* ── 4. Leadership ─────────────────────────────────────────────────────── */

function GroupPills({ groups }: { groups: readonly HimLeaderGroup[] }) {
  return (
    <ul aria-label="Serves on" className="flex flex-wrap gap-1.5">
      {groups.map((g) => (
        <li key={g}>
          <Pill active={g === 'Apostolic Council'}>{g}</Pill>
        </li>
      ))}
    </ul>
  )
}

function Leadership({ leadership }: { leadership: VM['leadership'] }) {
  const intro = `${leadership.councilCount} leaders serve on the Apostolic Council and ${leadership.boardCount} on the H.I.M. Philippines Board; ${leadership.bothCount} serve on both.`
  return (
    <section
      id="leadership"
      data-plate="dark"
      aria-labelledby="leadership-heading"
      className="relative scroll-mt-20 bg-abyss py-24 text-bone sm:py-32"
    >
      <div className={container}>
        <SectionHead id="leadership-heading" eyebrow="The people who lead" title="Leadership" lead={intro} />

        {/* Featured pair — portrait + credit spreads, the second stepped down
            so the two never read as twin cards */}
        <ul className="mt-16 grid gap-14 md:grid-cols-2 md:gap-10">
          {leadership.featured.map((leader, i) => (
            <Reveal as="li" key={leader.portrait} delay={i * 120} className={i === 1 ? 'md:mt-20' : ''}>
              <article className="group grid gap-6 border-t border-bone/20 pt-6 sm:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] sm:items-end">
                <div className="relative">
                  <RiverImage
                    src={leader.portrait}
                    alt={`Portrait of ${leader.name}`}
                    position="center 22%"
                    className="aspect-[4/5] w-full"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-3 z-[3] font-shout text-5xl leading-none font-extrabold text-bone/85 tabular-nums"
                  >
                    {pad(i + 1)}
                  </span>
                </div>
                <div>
                  <GroupPills groups={leader.groups} />
                  <h3 className="mt-4 font-shout text-[clamp(2.25rem,3vw,2.9rem)] leading-[0.92] font-extrabold uppercase transition-colors duration-300 group-hover:text-shallows">
                    {leader.name}
                  </h3>
                  <ul className="mt-4 grid gap-1 text-[0.92rem] leading-relaxed text-bone/75">
                    {leader.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* Directory — numbered editorial rows */}
        <div className="mt-24 flex items-end justify-between gap-6">
          <Eyebrow className="text-sand">Council, board and staff</Eyebrow>
          <p className="hidden text-[0.8rem] text-bone/55 sm:block">{leadership.all.length} people</p>
        </div>
        <ol className="mt-6 grid border-t border-bone/15 lg:grid-cols-2 lg:gap-x-12">
          {leadership.directory.map((leader, i) => (
            <DirectoryRow key={leader.portrait} leader={leader} index={i + 3} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function DirectoryRow({ leader, index }: { leader: HimLeaderProfile; index: number }) {
  const isStaff = leader.groups.includes('Secretary and Staff')
  return (
    <Reveal as="li" className="border-b border-bone/15">
      <article className="group grid grid-cols-[4.5rem_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[2.5rem_6rem_minmax(0,1fr)] sm:gap-6">
        <span aria-hidden="true" className="hidden pt-1 font-shout text-xl font-bold text-bone/35 tabular-nums sm:block">
          {pad(index)}
        </span>
        <RiverImage
          src={leader.portrait}
          alt={`Portrait of ${leader.name}`}
          position="center 22%"
          className="aspect-[4/5] w-full"
        />
        <div className="min-w-0">
          <h3 className="font-shout text-[1.75rem] leading-[0.95] font-bold uppercase transition-colors duration-300 group-hover:text-shallows">
            {leader.name}
          </h3>
          <ul className="mt-2 grid gap-0.5 text-[0.9rem] leading-relaxed text-bone/70">
            {leader.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
          <div className="mt-3">
            <GroupPills groups={leader.groups} />
          </div>
          {isStaff && (
            <div className="mt-4">
              <Button href="#join-him-philippines" variant="ghost" className="text-[0.9rem]">
                Membership contact ↓
              </Button>
            </div>
          )}
        </div>
      </article>
    </Reveal>
  )
}

/* ── 5. Core values rail ───────────────────────────────────────────────── */

function CoreValues({ coreValues }: { coreValues: VM['coreValues'] }) {
  const rail = useRef<HTMLOListElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
  }
  const arrowBtn =
    'flex h-12 w-12 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky'

  return (
    <section
      id="core-values"
      data-plate="dark"
      aria-labelledby="core-values-heading"
      className="relative isolate scroll-mt-20 overflow-hidden bg-deep py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
      <div className={`${container} flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between`}>
        <SectionHead
          id="core-values-heading"
          eyebrow="What shapes us"
          title={
            <>
              Our 12 core
              <br />
              values
            </>
          }
          lead={coreValues.introduction}
        />
        <div className="hidden gap-3 lg:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous core values" className={arrowBtn}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next core values" className={arrowBtn}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <p className="mt-10 px-4 text-[0.8rem] text-bone/60 sm:px-8 lg:hidden">Swipe to see all 12 values.</p>
      <Reveal className="mt-4 lg:mt-14">
        <ol
          ref={rail}
          aria-label="The 12 core values"
          tabIndex={0}
          className="no-scrollbar flex items-start snap-x snap-mandatory scroll-px-4 gap-0 overflow-x-auto px-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(2rem,calc((100vw-88rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-88rem)/2+2rem))]"
        >
          {coreValues.values.map((value, i) => (
            <li
              key={value.label}
              className="group relative flex w-[80vw] max-w-[24rem] shrink-0 snap-start flex-col border-l border-bone/15 px-6 pt-2 pb-4 last:border-r sm:w-[22rem] sm:px-8"
            >
              <span
                aria-hidden="true"
                className="font-shout text-[clamp(5rem,9vw,7.5rem)] leading-[0.8] font-black text-bone/10 tabular-nums transition-colors duration-500 group-hover:text-sky"
              >
                {pad(i + 1)}
              </span>
              <h3 className="mt-6 font-shout text-[2.25rem] leading-[0.92] font-extrabold uppercase">{value.label}</h3>
              <span aria-hidden="true" className="mt-5 block h-px w-12 origin-left bg-ember transition-transform duration-500 ease-current group-hover:scale-x-[2]" />
              <div className="mt-5 grid gap-4">
                {value.paragraphs.map((p) => (
                  <p key={p} className="text-[0.95rem] leading-relaxed text-bone/75">
                    {p}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}

/* ── 6. Statement of faith (light plate) ───────────────────────────────── */

function StatementOfFaith({ sof }: { sof: VM['statementOfFaith'] }) {
  return (
    <section
      id="statement-of-faith"
      data-plate="light"
      aria-labelledby="statement-of-faith-heading"
      className="relative scroll-mt-20 bg-bone py-24 text-abyss sm:py-32"
    >
      <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            id="statement-of-faith-heading"
            tone="light"
            eyebrow={<span className="text-ember-ink">What we believe</span>}
            title={
              <>
                Statement
                <br />
                of faith
              </>
            }
            lead={sof.introduction}
          />
        </div>
        <ol className="border-t border-abyss/15">
          {sof.statements.map((s, i) => (
            <Reveal
              as="li"
              key={s.summary}
              delay={(i % 3) * 60}
              className="group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-b border-abyss/15 py-8 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-x-6"
            >
              <span
                aria-hidden="true"
                className="font-shout text-[2.5rem] leading-[0.85] font-extrabold text-abyss/25 tabular-nums transition-colors duration-300 group-hover:text-ember-ink sm:text-[4rem]"
              >
                {pad(i + 1)}
              </span>
              <div>
                <h3 className="font-shout text-[1.6rem] leading-[1] font-bold uppercase sm:text-[2rem]">{s.summary}</h3>
                <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-abyss/75">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── 7. Membership ─────────────────────────────────────────────────────── */

function Join({ membership }: { membership: VM['membership'] }) {
  const { contact } = membership
  return (
    <section
      id="join-him-philippines"
      data-plate="dark"
      aria-labelledby="join-him-heading"
      className="relative isolate scroll-mt-20 overflow-hidden bg-river py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[20%] -z-10 blur-[70px] [background-image:radial-gradient(ellipse_35%_35%_at_85%_20%,color-mix(in_srgb,var(--color-ember)_22%,transparent),transparent_70%),radial-gradient(ellipse_45%_45%_at_10%_90%,color-mix(in_srgb,var(--color-abyss)_60%,transparent),transparent_70%)]" />
      <div className={`${container} grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20`}>
        <Reveal>
          <Eyebrow className="text-bone/85">Membership</Eyebrow>
          <h2 id="join-him-heading" className="mt-6 font-shout text-[clamp(3rem,7.5vw,7rem)] leading-[0.86] font-extrabold uppercase">
            Sign up to join
            <br />
            H.I.M. Philippines
          </h2>
          <p className="mt-8 max-w-[56ch] font-whisper text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.5] italic text-bone/90">
            {membership.statement}
          </p>
          <div className="mt-10">
            <Button href={membership.applicationForm} download variant="ember" size="lg" arrow>
              Download application form (PDF)
            </Button>
          </div>
        </Reveal>

        <Reveal delay={150} className="grid gap-8">
          <div className="group grid grid-cols-[6rem_minmax(0,1fr)] gap-5 border-t border-bone/25 pt-6">
            <RiverImage
              src={contact.portrait}
              alt={`Portrait of ${contact.name}`}
              position="center 22%"
              className="aspect-[4/5] w-full"
            />
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-bone/80 uppercase">For questions, please contact</p>
              <p className="mt-2 font-shout text-[1.75rem] leading-[0.95] font-bold uppercase">{contact.name}</p>
              <p className="mt-1 text-[0.9rem] text-bone/80">{contact.roles[0]}</p>
              <a
                href={`mailto:${membership.contactEmail}`}
                className="mt-3 inline-block text-[0.95rem] font-semibold break-all text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:decoration-sky focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky"
              >
                {membership.contactEmail}
              </a>
            </div>
          </div>
          <figure className="flex items-center gap-5 border-t border-bone/25 pt-6">
            <img
              src={membership.dpoBadge}
              alt={membership.dpoBadgeAlt}
              loading="lazy"
              decoding="async"
              className="h-20 w-auto shrink-0"
            />
            <figcaption className="text-[0.82rem] leading-relaxed text-bone/80">{membership.dpoCaption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
