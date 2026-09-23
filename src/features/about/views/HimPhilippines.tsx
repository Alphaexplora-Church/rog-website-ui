import type { ReactNode } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { site } from '../../../shared/config/site'
import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
  revealBase,
  revealDelay1,
  revealHidden,
  revealShown,
  riverGlow,
} from '../../../shared/styles/tokens'
import {
  himApplicationForm,
  himCoreValues,
  himCoreValuesIntroduction,
  himDpoBadge,
  himHeroImage,
  himIntroduction,
  himLeadership,
  himLogo,
  himMembershipStatement,
  himMission,
  himMotto,
  himNetworkFacts,
  himRiverOfGodConnection,
  himSecretary,
  himVision,
  statementOfFaith,
  statementOfFaithIntroduction,
  type HimLeader,
  type HimLeaderGroup,
} from '../data/himPhilippinesData'

/**
 * H.I.M. Philippines — /about/him-ph.
 *
 * REDESIGN 2026-09-24. One continuous dark page (#121212) that belongs with
 * Who We Are, replacing the earlier light/dark alternation that changed the
 * background seven times and made the floating nav flip tone on every
 * section. Sections are separated by space and hairlines; the only
 * elevated surfaces are the featured leaders, the River of God band and the
 * closing membership panel. A wave hands the page to the black footer.
 *
 * Every class string below is a complete literal (see tokens.ts): classes are
 * combined with cx(), never assembled from fragments.
 */

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')
const pad = (n: number) => String(n).padStart(2, '0')

const container = 'mx-auto w-full max-w-[86rem] px-6'
const sectionScroll = 'scroll-mt-10 sm:scroll-mt-4 lg:scroll-mt-0'
const displaySize = { fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }


export default function HimPhilippines() {
  return (
    <div className="bg-[#121212] text-white">
      <Hero />
      <Overview />
      <Leadership />
      <CoreValues />
      <StatementOfFaith />
      <Join />
    </div>
  )
}

/* ------------------------------------------------------------------ HERO */

function Hero() {
  const { ref, shown } = useInView<HTMLElement>({ threshold: 0 })

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="him-philippines-heading"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <img
        src={himHeroImage}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_35%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,18,18,0.94)_0%,rgba(18,18,18,0.72)_42%,rgba(18,18,18,0.18)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[linear-gradient(to_top,#121212_6%,rgba(18,18,18,0.72)_45%,transparent_100%)]"
      />

      <div className={cx(container, 'flex flex-1 flex-col justify-end pt-28 pb-8 sm:pt-40 sm:pb-12')}>
        <p className={cx('mb-5 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase', revealBase, shown ? revealShown : revealHidden)}>
          Harvest International Ministry
        </p>
        <h1
          id="him-philippines-heading"
          className="font-extrabold leading-[0.95] tracking-[-0.045em]"
          style={{ fontSize: 'clamp(2.75rem, 8.5vw, 7rem)' }}
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span className={cx(maskLineBase, shown ? maskLineShown : maskLineHidden)}>H.I.M. Philippines</span>
          </span>
        </h1>
        <p
          className={cx(
            'mt-6 max-w-[58ch] text-pretty text-base leading-7 text-white/80 sm:text-lg sm:leading-8',
            revealBase,
            revealDelay1,
            shown ? revealShown : revealHidden,
          )}
        >
          {himIntroduction}
        </p>

        <div
          className={cx(
            'mt-10 flex flex-col gap-6 border-t border-white/15 pt-6 sm:mt-14 sm:gap-8 md:flex-row md:items-end md:justify-between',
            revealBase,
            revealDelay1,
            shown ? revealShown : revealHidden,
          )}
        >
          <dl className="grid max-w-[50rem] flex-1 grid-cols-3 gap-4 sm:gap-10">
            {himNetworkFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse gap-2">
                <dt className="text-xs leading-5 text-white/60 sm:text-sm">{fact.label}</dt>
                <dd className="text-3xl font-bold tracking-[-0.03em] tabular-nums sm:text-5xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#overview"
            className="group/cue inline-flex items-center gap-3 self-start text-sm font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 md:self-end"
          >
            Explore
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-full border border-white/25 transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/cue:translate-y-0.5 group-hover/cue:border-white/60"
            >
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- SHARED */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-white/55 uppercase">
      <span aria-hidden="true" className="h-px w-8 bg-cyan-300/70" />
      {children}
    </p>
  )
}

interface SectionHeaderProps {
  id: string
  eyebrow: string
  title: string
  intro?: string
  shown: boolean
  stacked?: boolean
}

function SectionHeader({ id, eyebrow, title, intro, shown, stacked = false }: SectionHeaderProps) {
  return (
    <div
      className={cx(
        !stacked && 'grid gap-6 md:grid-cols-12 md:items-end',
        revealBase,
        shown ? revealShown : revealHidden,
      )}
    >
      <div className={cx(!stacked && 'md:col-span-6')}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="text-balance font-bold leading-[1.04] tracking-[-0.04em]" style={displaySize}>
          {title}
        </h2>
      </div>
      {intro ? (
        <p
          className={cx(
            'max-w-[60ch] text-pretty text-base leading-7 text-white/65',
            stacked ? 'mt-5' : 'md:col-span-6 md:col-start-7',
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  )
}

/** One portrait treatment for every leader: the source photos have white,
 *  gray, navy, blue and brown backgrounds, so each sits in the same frame in
 *  black and white and turns to colour on hover. */
function Portrait({ leader, className }: { leader: HimLeader; className: string }) {
  return (
    <div className={cx('relative shrink-0 overflow-hidden bg-[#1f1f1f]', className)}>
      <img
        src={leader.portrait}
        alt={'Portrait of ' + leader.name}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-[center_22%] brightness-[0.92] contrast-[1.05] grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] group-hover:brightness-100 group-hover:grayscale-0 motion-reduce:transition-none"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10 ring-inset" />
    </div>
  )
}

function GroupTags({ groups }: { groups: readonly HimLeaderGroup[] }) {
  return (
    <ul aria-label="Serves on" className="flex flex-wrap gap-1.5">
      {groups.map((group) => (
        <li
          key={group}
          className={cx(
            'rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold tracking-[0.06em] uppercase',
            group === 'Apostolic Council' ? 'border-cyan-400/30 text-cyan-200' : 'border-white/15 text-white/65',
          )}
        >
          {group}
        </li>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------------- OVERVIEW */

function Overview() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section ref={ref} id="overview" data-plate="dark" aria-labelledby="overview-heading" className={sectionScroll}>
      <div className={cx(container, 'py-16 sm:py-24 lg:py-32')}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>Mission and vision</Eyebrow>
            <h2
              id="overview-heading"
              className="font-bold leading-[1.02] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 5.6vw, 4.75rem)' }}
            >
              {himMotto.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span
                    className={cx(
                      maskLineBase,
                      shown ? maskLineShown : maskLineHidden,
                      index === 0 && 'text-white/45',
                      index === 1 && 'text-white/70 delay-[120ms]',
                      index === 2 && 'delay-[240ms]',
                    )}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div className={cx('grid gap-10 lg:col-span-5 lg:pt-14', revealBase, revealDelay1, shown ? revealShown : revealHidden)}>
            <article>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">Our Mission</h3>
              <p className="mt-3 text-base leading-7 text-white/70">{himMission}</p>
            </article>
            <article className="border-t border-white/10 pt-10">
              <h3 className="text-lg font-semibold tracking-[-0.02em]">Our Vision</h3>
              <p className="mt-3 text-base leading-7 text-white/70">{himVision}</p>
            </article>
          </div>
        </div>

        <div className="mt-14 grid gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:mt-20 sm:p-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
          <div className="flex items-center gap-6">
            <img src={site.logo.src} alt={site.logo.alt} className="aspect-[1.9/1] w-28 object-cover sm:w-32" />
            <span aria-hidden="true" className="h-12 w-px bg-white/20" />
            <img src={himLogo} alt="Harvest International Ministry Philippines" className="h-auto w-36 sm:w-44" />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">Where River of God fits</h3>
            <p className="mt-3 max-w-[62ch] text-base leading-7 text-white/70">{himRiverOfGodConnection}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ LEADERSHIP */

function Leadership() {
  const { ref, shown } = useInView<HTMLElement>({ threshold: 0.04 })
  const featured = himLeadership.slice(0, 2)
  const directory = himLeadership.slice(2)
  const councilCount = himLeadership.filter((l) => l.groups.includes('Apostolic Council')).length
  const boardCount = himLeadership.filter((l) => l.groups.includes('Board')).length
  const bothCount = himLeadership.filter((l) => l.groups.includes('Apostolic Council') && l.groups.includes('Board')).length
  const intro =
    councilCount +
    ' leaders serve on the Apostolic Council and ' +
    boardCount +
    ' on the H.I.M. Philippines Board; ' +
    bothCount +
    ' serve on both.'

  return (
    <section
      ref={ref}
      id="leadership"
      data-plate="dark"
      aria-labelledby="leadership-heading"
      className={cx(sectionScroll, 'border-t border-white/10')}
    >
      <div className={cx(container, 'py-16 sm:py-24 lg:py-32')}>
        <SectionHeader id="leadership-heading" eyebrow="The people who lead" title="Leadership" intro={intro} shown={shown} />

        <ul className={cx('mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2', revealBase, revealDelay1, shown ? revealShown : revealHidden)}>
          {featured.map((leader) => (
            <li key={leader.portrait} className="group">
              <article className="flex h-full items-start gap-5 overflow-hidden rounded-2xl border border-white/10 bg-[#181818] p-4 sm:grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-stretch sm:gap-0 sm:p-0">
                <Portrait leader={leader} className="size-24 rounded-xl sm:size-auto sm:h-full sm:min-h-[20rem] sm:rounded-none" />
                <div className="flex min-w-0 flex-col justify-end gap-3 sm:gap-4 sm:p-8">
                  <GroupTags groups={leader.groups} />
                  <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em] sm:text-[1.75rem]">{leader.name}</h3>
                  <ul className="flex flex-col gap-1 text-sm leading-6 text-white/65 sm:gap-1.5 sm:text-[0.9375rem]">
                    {leader.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <ul className={cx('mt-10 grid gap-x-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3', revealBase, revealDelay1, shown ? revealShown : revealHidden)}>
          {directory.map((leader) => (
            <li key={leader.portrait} className="group border-t border-white/10 py-5 sm:py-6">
              <article className="flex items-start gap-4 sm:gap-5">
                <Portrait leader={leader} className="size-16 rounded-xl sm:size-24" />
                <div className="min-w-0 pt-1">
                  <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em]">{leader.name}</h3>
                  <ul className="mt-1.5 flex flex-col gap-1 text-sm leading-6 text-white/65">
                    {leader.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                  <div className="mt-2.5 sm:mt-3">
                    <GroupTags groups={leader.groups} />
                  </div>
                  {leader.groups.includes('Secretary and Staff') ? (
                    <a
                      href="#join-him-philippines"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                    >
                      Membership contact <span aria-hidden="true">↓</span>
                    </a>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- CORE VALUES */

function CoreValues() {
  const { ref, shown } = useInView<HTMLElement>({ threshold: 0.05 })

  return (
    <section
      ref={ref}
      id="core-values"
      data-plate="dark"
      aria-labelledby="core-values-heading"
      className={cx(sectionScroll, 'border-t border-white/10')}
    >
      <div className={cx(container, 'py-16 sm:py-24 lg:py-32')}>
        <SectionHeader
          id="core-values-heading"
          eyebrow="What shapes us"
          title="Our Core Values"
          intro={himCoreValuesIntroduction}
          shown={shown}
        />
        <p className="mt-10 text-sm text-white/50 md:hidden">Swipe to see all 12 values.</p>
        <ol
          aria-label="The 12 core values"
          tabIndex={0}
          className={cx(
            '-mx-6 mt-4 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 md:mx-0 md:mt-14 md:grid md:snap-none md:grid-cols-2 md:gap-x-12 md:gap-y-0 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden',
            revealBase,
            revealDelay1,
            shown ? revealShown : revealHidden,
          )}
        >
          {himCoreValues.map((value, index) => (
            <li
              key={value.label}
              className="w-[82%] shrink-0 snap-start rounded-2xl border border-white/10 bg-[#181818] p-5 md:w-auto md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent md:px-0 md:pt-6 md:pb-10"
            >
              <span aria-hidden="true" className="text-sm font-semibold tabular-nums text-cyan-300/80">
                {pad(index + 1)}
              </span>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{value.label}</h3>
              {value.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-[0.9375rem] leading-7 text-white/65">
                  {paragraph}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------ STATEMENT OF FAITH */

function StatementOfFaith() {
  const { ref, shown } = useInView<HTMLElement>({ threshold: 0.05 })

  return (
    <section
      ref={ref}
      id="statement-of-faith"
      data-plate="dark"
      aria-labelledby="statement-of-faith-heading"
      className={cx(sectionScroll, 'border-t border-white/10')}
    >
      <div className={cx(container, 'grid gap-10 py-16 sm:gap-12 sm:py-24 lg:grid-cols-12 lg:gap-10 lg:py-32')}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeader
              id="statement-of-faith-heading"
              eyebrow="What we believe"
              title="Statement of Faith"
              intro={statementOfFaithIntroduction}
              shown={shown}
              stacked
            />
          </div>
        </div>
        <ol className={cx('lg:col-span-7 lg:col-start-6', revealBase, revealDelay1, shown ? revealShown : revealHidden)}>
          {statementOfFaith.map((statement, index) => (
            <li
              key={statement.summary}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t border-white/10 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-4 sm:py-7"
            >
              <span aria-hidden="true" className="text-lg font-semibold tabular-nums leading-tight text-white/30 sm:text-3xl">
                {pad(index + 1)}
              </span>
              <div>
                <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl">{statement.summary}</h3>
                <p className="mt-2 max-w-[62ch] text-base leading-7 text-white/65">{statement.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ JOIN */

function Join() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="join-him-philippines"
      data-plate="dark"
      aria-labelledby="join-him-heading"
      className="relative scroll-mt-[4.5rem] pt-8 pb-32 sm:pb-40"
    >
      <div className={container}>
        <div
          className={cx(
            'relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#181818] px-6 py-14 sm:px-12 sm:py-16 lg:px-16',
            revealBase,
            shown ? revealShown : revealHidden,
          )}
        >
          <div aria-hidden="true" className={riverGlow} />
          <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Membership</Eyebrow>
              <h2 id="join-him-heading" className="text-balance font-bold leading-[1.04] tracking-[-0.04em]" style={displaySize}>
                Sign up to join H.I.M. Philippines
              </h2>
              <p className="mt-5 max-w-[60ch] text-base leading-7 text-white/70">{himMembershipStatement}</p>
              <div className="mt-9">
                <Button href={himApplicationForm} download tone="dark" size="md">
                  Download application form (PDF)
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-black/30 p-5">
                <Portrait leader={himSecretary} className="size-20 rounded-xl" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.12em] text-white/50 uppercase">For questions, please contact</p>
                  <p className="mt-1.5 font-semibold">{himSecretary.name}</p>
                  <p className="text-sm text-white/60">{himSecretary.roles[0]}</p>
                  <a
                    href="mailto:pastorgreeko@gmail.com"
                    className="mt-2 inline-block text-sm font-semibold break-all text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 transition-colors hover:decoration-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                  >
                    pastorgreeko@gmail.com
                  </a>
                </div>
              </div>
              <figure className="mt-5 flex items-center gap-4 px-1">
                <img
                  src={himDpoBadge}
                  alt="National Privacy Commission DPO/DPS registration badge"
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-auto shrink-0 opacity-80"
                />
                <figcaption className="text-xs leading-5 text-white/50">
                  National Privacy Commission DPO/DPS registration. The badge shown is valid through 15 December 2025.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[60px] w-full sm:h-[90px]"
      >
        <path d="M0,50 C360,100 720,0 1080,45 C1260,68 1350,58 1440,45 L1440,130 L0,130 Z" fill="#000000" />
      </svg>
    </section>
  )
}
