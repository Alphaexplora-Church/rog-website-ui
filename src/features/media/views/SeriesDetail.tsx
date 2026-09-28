import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Reveal, WaveMark } from '../../../shared/components/ui/River'
import { container, heroRevealBase, heroRevealDelay1, heroRevealHidden, heroRevealShown } from '../../../shared/styles/tokens'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { MediaPageStatus } from './MediaPageStatus'
import { BackLink, Cover, MediaNotFound, PlayGlyph } from './MediaParts'
import { dateParts } from './mediaViewHelpers'

/**
 * Media — series detail page (`/media/series/:slug`).
 *
 * REVAMP 2026-09-25 (ROG 11 §6): the series cover owns the first screen in
 * FULL colour (min 80svh) under a River scrim + grain, the series title as a
 * giant shout bottom-left with its message count. It carries the same
 * `cover-<slug>` view-transition name the library shelf poster gets on
 * click, so the poster morphs into this hero. Episodes follow as a
 * chapter-style numbered list (01 ─── TITLE ─── date ▶), not cards.
 *
 * The banner is the same image as the library card (`seriesBannerImage`,
 * Jude 2026-09-22: header and card show the same picture, varying by
 * series); `Series.coverImage` overrides it when the CMS has one. A
 * placeholder series with zero episodes has nothing to borrow, so it gets
 * the designed River art (Cover's fallback) rather than a fabricated image.
 */
export default function SeriesDetail() {
  const { slug = '' } = useParams()
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const item = media.findSeries(slug)
  const list = media.sermonsBySeries(slug)
  const banner = item ? media.seriesBannerImage(slug) : undefined
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(t)
  }, [])

  if (isLoading || error) return <MediaPageStatus error={error} onRetry={retry} backTo="/media?category=series" />

  if (!item) return <MediaNotFound message="Series not found." backTo="/media?category=series" />

  const rise = (d = '') => `${heroRevealBase} ${d} ${on ? heroRevealShown : heroRevealHidden}`

  return (
    <>
      <section
        data-plate="dark"
        aria-labelledby="series-heading"
        className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-abyss text-bone"
      >
        <Cover
          src={banner}
          bloom="always"
          scrim="hero"
          priority
          vtName={`cover-${slug}`}
          className="absolute! inset-0 -z-10"
          imgClassName="animate-drift motion-reduce:animate-none"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -inset-[10%] -z-10 animate-boil bg-[url('/assets/rog/grain.png')] bg-[length:180px] opacity-[0.14] mix-blend-overlay motion-reduce:animate-none" />

        <div className={`${container} relative pt-36 pb-14 sm:pb-20`}>
          <div className={rise()}>
            <BackLink to="/media?category=series" className="text-bone/80" />
          </div>
          <div className={`mt-10 ${rise()}`}>
            <Eyebrow className="text-bone/85">Series</Eyebrow>
          </div>
          <h1
            id="series-heading"
            className="mt-6 max-w-[12ch] text-balance font-shout text-[clamp(4rem,13vw,12.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.01em]"
          >
            <span className="block overflow-hidden pb-[0.04em]">
              <span
                className={`block transition-transform duration-[1200ms] ease-tide motion-reduce:transition-none ${on ? 'translate-y-0' : 'translate-y-[106%] motion-reduce:translate-y-0'}`}
                style={{ transitionDelay: '120ms' }}
              >
                {item.title}
              </span>
            </span>
          </h1>
          <p className={`mt-6 flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-sand ${rise(heroRevealDelay1)}`}>
            <span className="font-shout text-3xl font-extrabold tracking-normal text-bone tabular-nums">
              {String(list.length).padStart(2, '0')}
            </span>
            {list.length === 1 ? 'message' : 'messages'}
          </p>
        </div>
      </section>

      <section data-plate="light" aria-labelledby="episodes-heading" className="relative bg-bone py-24 text-abyss sm:py-32">
        <div className={container}>
          <Reveal>
            <Eyebrow className="text-abyss/70">Episodes</Eyebrow>
            <h2 id="episodes-heading" className="sr-only">
              Messages in {item.title}
            </h2>
          </Reveal>

          {list.length === 0 ? (
            <Reveal className="mt-12 border-y border-abyss/15 py-16">
              <WaveMark className="h-6 w-16 text-abyss/40" strokeWidth={6} />
              <p className="mt-6 font-whisper text-[clamp(1.6rem,3vw,2.6rem)] italic leading-tight text-abyss">
                No messages in this series yet.
              </p>
              <p className="mt-3 max-w-[48ch] text-abyss/70">
                Episodes appear here as soon as they’re published. In the meantime, the rest of the library is open.
              </p>
              <div className="mt-8">
                <Button to="/media" variant="outline" tone="light" arrow>
                  Browse all messages
                </Button>
              </div>
            </Reveal>
          ) : (
            <ol className="mt-12 border-t border-abyss/15">
              {list.map((s, i) => {
                const d = dateParts(s)
                return (
                  <Reveal as="li" key={s.slug} delay={Math.min(i, 6) * 60} className="border-b border-abyss/15">
                    <Link
                      to={`/media/watch/${s.slug}`}
                      viewTransition
                      className="group flex flex-wrap items-center gap-x-5 gap-y-2 py-7 sm:flex-nowrap sm:gap-x-6 sm:py-9"
                    >
                      <span className="w-16 flex-none font-shout text-[clamp(2.5rem,4vw,3.75rem)] font-extrabold leading-none tabular-nums text-abyss/30 transition-colors duration-500 group-hover:text-ember-ink">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true" className="hidden h-px w-10 flex-none bg-abyss/30 transition-[width,background-color] duration-[700ms] ease-current group-hover:w-20 group-hover:bg-ember sm:block" />
                      <span className="min-w-0 flex-1 font-shout text-[clamp(1.75rem,3.6vw,3.25rem)] font-extrabold uppercase leading-[0.92] sm:flex-none sm:max-w-[60%]">
                        {s.title}
                      </span>
                      <span aria-hidden="true" className="hidden h-px flex-1 bg-abyss/15 sm:block" />
                      <span className={`basis-full pl-[5.25rem] text-[0.85rem] font-medium text-abyss/65 sm:basis-auto sm:pl-0 ${d.pending ? 'italic' : ''}`}>
                        {s.date}
                        {s.speakerName && <span className="text-abyss/55"> · {s.speakerName}</span>}
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden h-12 w-12 flex-none items-center justify-center rounded-full border border-abyss/30 transition-[background-color,border-color,color] duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-abyss sm:flex"
                      >
                        <PlayGlyph className="h-4 w-4" />
                      </span>
                    </Link>
                  </Reveal>
                )
              })}
            </ol>
          )}
        </div>
      </section>
    </>
  )
}
