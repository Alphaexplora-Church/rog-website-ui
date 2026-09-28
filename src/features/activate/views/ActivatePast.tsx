import { Link } from 'react-router-dom'
import { PageHero } from '../../../shared/components/ui/PageHero'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { useActivatePastViewModel } from '../viewModels/useActivateViewModel'
import { ContactSection, LogoMark, PastCard, SpeakerCard, VideoFacade } from './ActivateParts'

/**
 * `/activate12/activate-11` and `/activate12/activate-10` — the landing
 * pages for past conferences. NEW 2026-09-28, one template for both.
 *
 * Content from the old riverofgod.ph pages Jude sent: video, "What is
 * ACTIVATE N about?", the four goals, the speakers with their bios, and
 * contacts. Activate 11 links on to Activate 10 (as it did on the old site);
 * both link back to the current conference.
 *
 *   1. PageHero — the conference logo (as an ink mask) beside the title
 *   2. Video (click-to-load)
 *   3. About + Goals (bone plate)
 *   4. Speakers
 *   5. Previous conference / back to Activate 12
 *   6. Where to reach us
 */
export function ActivatePast({ slug }: { slug: 'activate-11' | 'activate-10' }) {
  const { conference, previous, current, contact } = useActivatePastViewModel(slug)
  const titleLines = conference.heroTitle ?? [conference.name]

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Link to={current.to} className="transition-colors duration-300 hover:text-bone">
              Activate
            </Link>{' '}
            · Past conference · {conference.name}
          </>
        }
        title={titleLines}
        lead={`The ${ordinal(conference.edition)} Activate conference of PCEC Transformation & Revival and River of God.`}
        aside={
          conference.logo ? (
            <div className="w-[min(20rem,70vw)] text-bone/90">
              <LogoMark
                src={conference.logo}
                aspect={conference.logoAspect}
                label={`${conference.name}${conference.theme ? ` — ${conference.theme}` : ''} logo`}
                className="h-auto w-full"
              />
            </div>
          ) : undefined
        }
        actions={
          <Button href="#activate-video" variant="ember" arrow>
            Watch {conference.name}
          </Button>
        }
      />

      {/* Video */}
      <section id="activate-video" data-plate="dark" aria-label={conference.videoTitle} className="relative scroll-mt-24 bg-abyss pb-24 text-bone sm:pb-32">
        <div className={container}>
          <Reveal>
            <VideoFacade videoId={conference.videoId} title={conference.videoTitle} />
          </Reveal>
        </div>
      </section>

      {/* About + goals */}
      <section data-plate="light" aria-labelledby="activate-about-heading" className="relative bg-bone py-24 text-abyss sm:py-32">
        <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              id="activate-about-heading"
              tone="light"
              eyebrow={`What is ${conference.name} about?`}
              title={<>Walk in the<br />supernatural.</>}
            />
            {conference.about ? (
              <Reveal>
                <p className="mt-8 max-w-[48ch] text-[1.05rem] leading-relaxed text-abyss/80">{conference.about}</p>
              </Reveal>
            ) : null}
          </div>
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-ember-ink uppercase">Goals</p>
            <ol className="mt-6 border-t border-abyss/15">
              {conference.goals.map((g, i) => (
                <Reveal as="li" key={g} delay={i * 60} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-abyss/15 py-7 sm:grid-cols-[5rem_1fr]">
                  <span className="font-shout text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold leading-none tabular-nums text-ember-ink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-whisper text-[clamp(1.2rem,1.7vw,1.5rem)] italic leading-[1.4]">{g}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section data-plate="dark" aria-labelledby="activate-speakers-heading" className="relative bg-abyss py-24 text-bone sm:py-32">
        <div className={container}>
          <SectionHead id="activate-speakers-heading" eyebrow={`${conference.name} speakers`} title="Speakers." />
          <ul className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {conference.speakers.map((s, i) => (
              <SpeakerCard key={s.name} speaker={s} index={i} />
            ))}
          </ul>
        </div>
      </section>

      {/* More Activate */}
      <section data-plate="dark" aria-labelledby="activate-more-heading" className="relative border-t border-bone/10 bg-abyss-2 py-24 text-bone sm:py-28">
        <div className={container}>
          <Eyebrow>More Activate</Eyebrow>
          <h2 id="activate-more-heading" className="sr-only">
            More Activate conferences
          </h2>
          <div className={`mt-10 grid gap-5 ${previous ? 'md:grid-cols-2' : ''}`}>
            {previous ? <PastCard conference={previous} tone="dark" /> : null}
            <Link
              to={current.to}
              viewTransition
              className="group relative flex min-h-[18rem] flex-col justify-between overflow-hidden bg-ember p-7 text-abyss sm:p-9"
            >
              <span className="text-[0.72rem] font-semibold tracking-[0.22em] uppercase opacity-70">This year</span>
              <span className="my-8 font-shout text-[clamp(3rem,6vw,5rem)] font-extrabold uppercase leading-[0.86]">
                {current.name}
                <br />
                <span className="text-abyss/70">{current.theme}</span>
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold">
                See Activate 12
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-500 ease-current group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <ContactSection contact={contact} />
    </>
  )
}

function ordinal(n: number) {
  const words: Record<number, string> = { 10: 'tenth', 11: 'eleventh', 12: 'twelfth' }
  return words[n] ?? `${n}th`
}

export function Activate11() {
  return <ActivatePast slug="activate-11" />
}

export function Activate10() {
  return <ActivatePast slug="activate-10" />
}
