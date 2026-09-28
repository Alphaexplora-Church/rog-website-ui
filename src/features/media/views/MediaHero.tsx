import { useEffect, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Pill, WaveMark } from '../../../shared/components/ui/River'
import { container, heroRevealBase, heroRevealDelay1, heroRevealDelay2, heroRevealHidden, heroRevealShown } from '../../../shared/styles/tokens'
import { sermonThumbnail, type Sermon } from '../data/mediaData'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { Cover, PlayGlyph } from './MediaParts'

/**
 * Media, section 1 — the FEATURED latest message owns the first screen.
 *
 * PHONES: hidden (max-sm) — the Netflix-app layout puts the category chips
 * first and the billboard as a card under them (MediaLibrarySection's
 * MobileBillboard). 2026-09-27.
 *
 * NETFLIX BILLBOARD, 2026-09-27: the bottom padding is deliberately deep —
 * the library's first row rides up over this hero's fade (MediaLibrary-
 * Section's negative margin), the way Netflix's rows overlap its billboard.
 *
 * REVAMP 2026-09-25 (ROG 11 §6): full-bleed, full colour, a slow drift on
 * the thumbnail under a River scrim + boiling grain, the title as a giant
 * shout, and a big round play affordance. Built like PageHero but around the
 * message itself — the hero is the thing you can watch, not a caption for it.
 *
 * History that still holds:
 *  - The featured message is the NEWEST by date (`media.latestSermon()`,
 *    Jude 2026-09-24), so the eyebrow can honestly say "Latest Message".
 *  - The "Spirit of Elijah" videoId belonged to a different church and was
 *    dropped from featuring (2026-09-22).
 *  - ⚠ The sample thumbnail for the featured message is another church's
 *    artwork ("DESTINYC3 SERMONS") — sample data, must not ship; replacing it
 *    is a `mediaData`/CMS job, not a layout one.
 *  - Loading / CMS-unreachable / nothing-published each get an honest hero
 *    of the same height so the page never jumps (HeroWithoutMessage).
 *
 * When a thumbnail can't load (offline, YouTube blocked), `Cover` falls back
 * to designed River art with the title set big and faint, so the hero still
 * reads as a poster rather than an empty box.
 */
export function MediaHero() {
  const { media, isLoading, error } = useMediaLibraryViewModel()
  const sermon: Sermon | undefined = media.latestSermon()
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(t)
  }, [])

  if (!sermon) {
    return <HeroWithoutMessage state={isLoading ? 'loading' : error ? 'error' : 'empty'} />
  }

  const topics = sermon.topicSlugs.map((t) => media.findTopic(t)?.title).filter(Boolean) as string[]
  const rise = (d = '') => `${heroRevealBase} ${d} ${on ? heroRevealShown : heroRevealHidden}`
  const slug = sermon.slug
  const to = `/media/watch/${slug}`

  /* Poster Morph: either watch link names the hero image just before the
     view transition, so the photo grows into the player. */
  function namePosterMorph(e: MouseEvent<HTMLElement>) {
    if (!(e.target as HTMLElement).closest(`a[href="${to}"]`)) return
    const hero = e.currentTarget.querySelector<HTMLElement>('[data-cover]')
    if (hero) hero.style.viewTransitionName = `cover-${slug}`
  }

  return (
    <section
      data-plate="dark"
      aria-labelledby="media-hero-heading"
      onClickCapture={namePosterMorph}
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-abyss text-bone max-sm:hidden"
    >
      <Cover
        src={sermonThumbnail(sermon)}
        bloom="always"
        scrim="hero"
        priority
        className="absolute! inset-0 -z-10"
        imgClassName="animate-drift motion-reduce:animate-none"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[10%] -z-10 animate-boil bg-[url('/assets/rog/grain.png')] bg-[length:180px] opacity-[0.14] mix-blend-overlay motion-reduce:animate-none" />

      <div className={`${container} relative pt-36 pb-48 sm:pb-60`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div className={rise()}>
              <Eyebrow className="text-bone/85">Latest Message</Eyebrow>
            </div>
            <h1
              id="media-hero-heading"
              className="mt-6 max-w-[14ch] text-balance font-shout text-[clamp(3.25rem,9.5vw,9.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]"
            >
              <span className="block overflow-hidden pb-[0.04em]">
                <span
                  className={`block transition-transform duration-[1200ms] ease-tide motion-reduce:transition-none ${on ? 'translate-y-0' : 'translate-y-[106%] motion-reduce:translate-y-0'}`}
                  style={{ transitionDelay: '120ms' }}
                >
                  {sermon.title}
                </span>
              </span>
            </h1>

            <div className={`mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 ${rise(heroRevealDelay1)}`}>
              <p className="text-[0.95rem] font-medium tabular-nums text-sand">
                {sermon.date && (
                  <span className={sermon.dateIsPlaceholder ? 'italic opacity-75' : undefined}>{sermon.date}</span>
                )}
                {sermon.date && sermon.speakerName && <span aria-hidden="true" className="px-2 text-bone/40">·</span>}
                {sermon.speakerName && <span className="text-bone">{sermon.speakerName}</span>}
              </p>
              {topics.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>

            <div className={`mt-10 flex flex-wrap items-center gap-6 ${rise(heroRevealDelay2)}`}>
              <Button to={to} variant="ember" size="lg">
                <span className="flex items-center gap-2.5">
                  <PlayGlyph className="h-4 w-4" />
                  Watch Now
                </span>
              </Button>
              <Button href="#media-library" variant="ghost">
                Browse the library
              </Button>
            </div>
          </div>

          {/* The big play affordance — the whole poster is a video. */}
          <Link
            to={to}
            viewTransition
            aria-label={`Watch ${sermon.title}`}
            className={`group relative hidden h-40 w-40 items-center justify-center self-end rounded-full border border-bone/40 lg:flex ${rise(heroRevealDelay2)}`}
          >
            <span className="absolute inset-3 rounded-full bg-bone/10 backdrop-blur-sm transition-[transform,background-color] duration-[700ms] ease-current group-hover:scale-[1.12] group-hover:bg-ember motion-reduce:transition-none" />
            <PlayGlyph className="relative h-9 w-9 text-bone transition-colors duration-500 group-hover:text-abyss" />
            <svg aria-hidden="true" viewBox="0 0 160 160" className="absolute inset-0 h-full w-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none">
              <defs>
                <path id="media-hero-ring" d="M80 80 m-66 0 a66 66 0 1 1 132 0 a66 66 0 1 1 -132 0" />
              </defs>
              <text className="fill-bone/75 font-sans text-[9.5px] font-semibold uppercase">
                <textPath href="#media-hero-ring" textLength="408" lengthAdjust="spacing">
                  Play the latest message · Watch now ·
                </textPath>
              </text>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * Hero when there is no message to feature. Same ground and height, and the
 * same "Browse the library" way down, so the page doesn't jump when data
 * arrives and never reads as broken.
 */
function HeroWithoutMessage({ state }: { state: 'loading' | 'error' | 'empty' }) {
  const line =
    state === 'loading'
      ? ' '
      : state === 'error'
        ? 'Messages couldn’t be loaded right now. Please try again in a moment.'
        : 'New messages appear here as soon as they’re published.'

  return (
    <section
      data-plate="dark"
      aria-labelledby="media-hero-heading"
      aria-busy={state === 'loading'}
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-abyss text-bone max-sm:hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -inset-[20%] blur-[70px] [background-image:radial-gradient(ellipse_40%_45%_at_20%_30%,color-mix(in_srgb,var(--color-river)_70%,transparent),transparent_70%),radial-gradient(ellipse_30%_30%_at_85%_80%,color-mix(in_srgb,var(--color-ember)_20%,transparent),transparent_70%)]" />
        <WaveMark
          draw={state === 'loading'}
          className="absolute -right-[8%] top-[14%] h-auto w-[70vw] max-w-[1100px] text-bone/[0.05]"
          strokeWidth={3}
        />
      </div>
      <div className={`${container} pt-36 pb-48 sm:pb-60`}>
        <Eyebrow>Media</Eyebrow>
        <h1
          id="media-hero-heading"
          className="mt-6 font-shout text-[clamp(3.5rem,11vw,10.5rem)] font-extrabold uppercase leading-[0.86]"
        >
          Messages
        </h1>
        <p className="mt-8 max-w-[46ch] font-whisper text-[clamp(1.2rem,1.8vw,1.6rem)] italic leading-[1.4] text-bone/80">
          {line}
        </p>
        <div className="mt-10">
          <Button href="#media-library" variant="ghost">
            Browse the library
          </Button>
        </div>
      </div>
    </section>
  )
}
