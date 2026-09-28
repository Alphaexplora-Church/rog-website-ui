import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { useCenterBloom } from '../../../shared/hooks/useCenterBloom'
import { container } from '../../../shared/styles/tokens'
import type { Sermon } from '../../../shared/models/types/media'
import { sermonThumbnail } from '../../media/data/mediaData'
import { usePreviousMessagesViewModel } from '../viewModels/usePreviousMessagesViewModel'

/** Stagger between row entrances, capped so a long list doesn't cascade. */
const STAGGER_MS = 60
const STAGGER_CAP = 5

/**
 * Watch Live, section 2 — "Previous Messages".
 *
 * Content history worth keeping: Jude's reference used a fabricated
 * two-language archive; this lists the REAL Sermons-category messages from
 * the CMS (via `usePreviousMessagesViewModel`, shared cache with Media) in
 * array order, so nothing is marked "Latest" — the data doesn't guarantee
 * newest-first. No language tabs (sermons carry no language field); the
 * reference's Notes / Subscribe / Podcast buttons are dropped because none
 * of those features exist. Each row links to the real `/media/watch/:slug`.
 *
 * REVAMP 2026-09-25 ("Textured Editorial"): the live stage above is loud,
 * so this is the quiet index on the bone plate — a numbered list of rows
 * (date · title · speaker · arrow) like a printed sermon archive, not a card
 * grid. Thumbnails rest in River duotone and Colour Bloom to true colour on
 * hover/focus (or at screen-centre on touch); the title gets the ember
 * underline and the arrow slides. The `<li>` owns arrival (Reveal), the
 * `<Link>` owns interaction, so the two transitions never clobber each other.
 */
export function PreviousMessagesSection() {
  const { sermons, isLoading, error } = usePreviousMessagesViewModel()

  return (
    <section
      data-plate="light"
      aria-labelledby="previous-messages-heading"
      className="relative bg-bone py-24 text-abyss sm:py-32"
    >
      <div className={container}>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHead
            id="previous-messages-heading"
            tone="light"
            eyebrow="Sermon Library"
            title="Previous Messages"
          />
          <Reveal>
            <Button to="/media?category=sermon" variant="ghost" tone="light" arrow>
              Browse full library
            </Button>
          </Reveal>
        </div>

        {isLoading ? (
          <div className="mt-14">
            <LoadingBlock tone="light" rows={2} />
          </div>
        ) : error ? (
          <div className="mt-14">
            <ErrorBlock tone="light" error={error} />
          </div>
        ) : sermons.length === 0 ? (
          <Reveal className="mt-14 border-y border-abyss/15 py-12 text-center">
            <p className="font-whisper text-xl italic text-abyss/70">No messages yet — check back soon.</p>
          </Reveal>
        ) : (
          <ol className="mt-14 border-t border-abyss/20">
            {sermons.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={Math.min(i, STAGGER_CAP) * STAGGER_MS} className="border-b border-abyss/20">
                <MessageRow sermon={s} index={i} />
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

function MessageRow({ sermon: s, index }: { sermon: Sermon; index: number }) {
  const [failed, setFailed] = useState(false)
  const bloom = useCenterBloom<HTMLDivElement>(!failed)

  return (
    <Link
      to={`/media/watch/${s.slug}`}
      className="group grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 transition-colors duration-500 ease-current hover:bg-bone-2 sm:grid-cols-[3rem_11rem_minmax(0,1fr)_auto] sm:gap-8 sm:py-6 lg:grid-cols-[3rem_13rem_9rem_minmax(0,1fr)_14rem_auto]"
    >
      <span aria-hidden="true" className="hidden font-shout text-lg font-bold tabular-nums text-abyss/45 sm:block">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div ref={bloom} className={`grain relative aspect-video overflow-hidden bg-deep ${failed ? '' : 'duotone'}`}>
        {!failed && (
          <img
            src={sermonThumbnail(s)}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-current group-hover:scale-[1.06] motion-reduce:transition-none"
          />
        )}
        <span aria-hidden="true" className="absolute inset-0 z-[2] flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-abyss/60 text-bone opacity-80 transition-opacity duration-300 group-hover:opacity-100">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>

      {/* Date column (lg); folds under the title on smaller screens. */}
      <span className={`hidden text-[0.8rem] font-medium tabular-nums lg:block ${s.dateIsPlaceholder ? 'italic text-abyss/45' : 'text-abyss/70'}`}>
        {s.date}
      </span>

      <div className="min-w-0">
        <p className="font-shout text-[clamp(1.4rem,2.4vw,2.1rem)] font-extrabold uppercase leading-[0.95] text-balance">
          <span className="bg-[linear-gradient(var(--color-ember),var(--color-ember))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-[600ms] ease-current group-hover:bg-[length:100%_2px] group-focus-visible:bg-[length:100%_2px]">
            {s.title}
          </span>
        </p>
        <p className="mt-2 text-[0.8rem] text-abyss/70 lg:hidden">
          {s.date && <span className={s.dateIsPlaceholder ? 'italic text-abyss/45' : undefined}>{s.date}</span>}
          {s.date && s.speakerName ? ' · ' : ''}
          {s.speakerName}
        </p>
      </div>

      <span className="hidden font-whisper text-lg italic text-abyss/75 lg:block">{s.speakerName}</span>

      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-abyss/25 text-abyss transition-[transform,background-color,border-color,color] duration-500 ease-current group-hover:translate-x-1 group-hover:border-abyss group-hover:bg-abyss group-hover:text-bone motion-reduce:transition-none"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  )
}
