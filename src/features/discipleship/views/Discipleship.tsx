import { useRef } from 'react'
import { useDiscipleshipViewModel } from '../viewModels/useDiscipleshipViewModel'
import type { DiscipleshipStage } from '../../../shared/data/discipleship'
import { PageHero } from '../../../shared/components/ui/PageHero'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Reveal, SectionHead, WaveRule } from '../../../shared/components/ui/River'
import { useScrollProgress } from '../../../shared/hooks/useScrollProgress'
import { container } from '../../../shared/styles/tokens'
import { navActions } from '../../../shared/config/navigation'

/**
 * `/discipleship` — River of God's discipleship process. NEW 2026-09-25.
 *
 * Content: the two slide decks Jude sent (five stage slides + the
 * "Discipleship Process" diagram), single-sourced in shared/data.
 *
 * Shape (ROG 11 "Current Fill"): the page IS the river. Five chapters sit
 * along one vertical line that fills with ember as you scroll — a journey
 * with five stops, not five tiles. Each chapter: a giant numeral + stage
 * title that pins while its scripture, Goal / Tools / Environment and
 * materials scroll past; the stage's own slide colour tints only its own
 * chapter. Then the diagram, re-set as a "path" (process → book), and the
 * Every Nation acknowledgement.
 */
export default function Discipleship() {
  const { stages, acknowledgement } = useDiscipleshipViewModel()
  const fill = useRef<HTMLDivElement>(null)
  const track = useScrollProgress<HTMLDivElement>((p) => {
    if (fill.current) fill.current.style.transform = `scaleY(${p})`
  })

  return (
    <>
      <PageHero
        eyebrow="Ministries · Discipleship"
        title={['Five', 'crossings.']}
        lead="From a first encounter with God to leading others through the same current — this is how River of God makes disciples."
        aside={
          <ol className="grid gap-1 border-l border-bone/15 pl-6">
            {stages.map((s, i) => (
              <li key={s.key}>
                <a
                  href={`#stage-${s.key}`}
                  className="group flex items-baseline gap-4 py-1 transition-colors duration-300 hover:text-sky"
                >
                  <span className="w-6 font-shout text-sm tabular-nums text-bone/45">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-shout text-3xl font-bold uppercase leading-none">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        }
      />

      {/* The river */}
      <section data-plate="dark" aria-label="The five stages" className="relative bg-abyss text-bone">
        <div ref={track} className="relative">
          {/* Current Fill line */}
          <div aria-hidden="true" className="pointer-events-none absolute top-0 bottom-0 left-4 w-px bg-bone/12 sm:left-8 lg:left-[max(2rem,calc(50%-42rem))]">
            <div ref={fill} className="h-full w-full origin-top scale-y-0 bg-ember" />
          </div>
          {stages.map((stage, i) => (
            <StageChapter key={stage.key} stage={stage} index={i} />
          ))}
        </div>
      </section>

      {/* The path — the diagram, re-set */}
      <section data-plate="light" aria-labelledby="path-heading" className="relative bg-bone py-24 text-abyss sm:py-32">
        <div className={container}>
          <SectionHead
            id="path-heading"
            tone="light"
            eyebrow="The discipleship process"
            title={
              <>
                One path,
                <br />
                one book at a time.
              </>
            }
            lead="Every stage has its own study material — you never walk it alone, and you never walk it without the Word."
          />
          <ol className="mt-16 border-t border-abyss/15">
            {stages.map((stage, i) => (
              <Reveal as="li" key={stage.key} delay={i * 60} className="grid gap-6 border-b border-abyss/15 py-8 lg:grid-cols-[15rem_1fr]">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="h-10 w-1.5 flex-none" style={{ background: stage.color }} />
                  <span className="font-shout text-4xl font-extrabold uppercase leading-none">{stage.title}</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {stage.materials.map((m) => (
                    <div key={m.name}>
                      <p className="font-shout text-2xl font-bold uppercase leading-tight">{m.name}</p>
                      <p className="mt-2 max-w-[56ch] text-[0.95rem] leading-relaxed text-abyss/75">{m.description}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </ol>
          <p className="mt-10 max-w-[72ch] font-whisper text-lg italic leading-relaxed text-abyss/70">{acknowledgement}</p>
        </div>
      </section>

      {/* Next step */}
      <section data-plate="dark" className="relative overflow-hidden bg-river py-24 text-bone sm:py-32">
        <div aria-hidden="true" className="grain absolute inset-0" />
        <div className={`${container} relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between`}>
          <div>
            <Eyebrow className="text-bone/80">Your next step</Eyebrow>
            <p className="mt-5 font-shout text-[clamp(3rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.88]">
              Start with
              <br />a life group.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={navActions.planAVisit.to} variant="ember" size="lg" arrow>
              {navActions.planAVisit.label}
            </Button>
            <Button to="/ministries" variant="outline" size="lg">
              Find your ministry
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function StageChapter({ stage, index }: { stage: DiscipleshipStage; index: number }) {
  return (
    <article
      id={`stage-${stage.key}`}
      aria-labelledby={`stage-${stage.key}-title`}
      className="relative scroll-mt-24 overflow-hidden"
    >
      {/* the stage's own colour, only inside its own chapter */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: `radial-gradient(ellipse 55% 60% at 100% 30%, ${stage.color}55, transparent 70%)` }}
      />
      <div className={`${container} relative grid gap-12 py-24 pl-12 sm:py-32 sm:pl-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
        {/* Pinned title */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="font-shout text-[clamp(5rem,12vw,11rem)] font-black leading-[0.8] tabular-nums text-bone/10">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h2
              id={`stage-${stage.key}-title`}
              className="-mt-[0.35em] font-shout text-[clamp(3.5rem,8vw,7rem)] font-extrabold uppercase leading-[0.86]"
            >
              {stage.title}
            </h2>
            <span aria-hidden="true" className="mt-5 block h-1.5 w-24" style={{ background: stage.color }} />
            <dl className="mt-8">
              <dt className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Goal</dt>
              <dd className="mt-1 font-whisper text-2xl italic leading-snug">{stage.goal}</dd>
            </dl>
            <div className="relative mt-8 aspect-[5/3] max-w-sm overflow-hidden">
              <img src={stage.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div aria-hidden="true" className="grain absolute inset-0" />
            </div>
          </Reveal>
        </div>

        {/* Scrolling content */}
        <div className="grid gap-14">
          {stage.scriptures.map((s, i) => (
            <Reveal key={s.ref} delay={i * 80}>
              <figure>
                <blockquote className="font-whisper text-[clamp(1.5rem,2.6vw,2.35rem)] italic leading-[1.3] text-bone">
                  &ldquo;{s.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.2em] text-sand uppercase">
                  <span aria-hidden="true" className="h-px w-10 bg-sand/60" />
                  {s.ref}
                </figcaption>
              </figure>
            </Reveal>
          ))}

          <Reveal>
            <WaveRule className="text-bone/15" />
            <dl className="mt-8 grid gap-8 sm:grid-cols-2">
              <Fact label="Tools" value={stage.tools} />
              <Fact label="Environment" value={stage.environment} />
            </dl>
          </Reveal>

          <Reveal>
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">
              {stage.materials.length > 1 ? 'Study materials' : 'Study material'}
            </p>
            <ul className="mt-5 grid gap-6">
              {stage.materials.map((m) => (
                <li key={m.name} className="border-l-2 pl-5" style={{ borderColor: stage.color }}>
                  <p className="font-shout text-2xl font-bold uppercase">{m.name}</p>
                  <p className="mt-2 max-w-[60ch] leading-relaxed text-bone/75">{m.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </article>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  const items = value.split(',').map((v) => v.trim())
  return (
    <div>
      <dt className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">{label}</dt>
      <dd className="mt-3 flex flex-wrap gap-2">
        {items.map((v) => (
          <span key={v} className="rounded-full border border-bone/25 px-3 py-1 text-sm italic">
            {v}
          </span>
        ))}
      </dd>
    </div>
  )
}
