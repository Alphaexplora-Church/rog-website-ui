import { Link } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow } from '../../../shared/components/ui/River'
import { container, revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { sermonThumbnail } from '../../media/data/mediaData'
import { Cover, MessageIndex, MetaLine, PlayGlyph } from '../../media/views/MediaParts'
import { useWatchOrListenViewModel } from '../viewModels/useWatchOrListenViewModel'

/**
 * Home, section 4 — Watch or Listen. REVAMP 2026-09-25 (ROG 11 §6 Home 7).
 *
 * Editorial split, not three identical cards: the newest message bleeds off
 * the left edge in full colour with its title set large beside it; the rest
 * follow as index rows (the same `MessageIndex` the Media library uses, so
 * desktop gets the floating Cursor Preview and touch gets inline thumbs).
 * Data unchanged: `useWatchOrListenViewModel` → latest sermons.
 */
export function WatchOrListenSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`
  const { teasers, isLoading, error } = useWatchOrListenViewModel()
  const [latest, ...rest] = teasers

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="watch-or-listen-heading"
      className="relative overflow-hidden bg-abyss py-24 text-bone sm:py-32"
    >
      <div className={container}>
        <div className={`flex flex-wrap items-end justify-between gap-6 ${reveal}`}>
          <div>
            <Eyebrow>Messages</Eyebrow>
            <h2 id="watch-or-listen-heading" className="mt-5 font-shout text-[clamp(3rem,7vw,6.5rem)] leading-[0.88] font-extrabold uppercase">
              Watch
              <br />
              or listen.
            </h2>
          </div>
          <Button to="/media" variant="ghost" arrow>
            Browse the library
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-14">
            <LoadingBlock tone="dark" />
          </div>
        ) : error ? (
          <div className="mt-14">
            <ErrorBlock tone="dark" error={error} />
          </div>
        ) : !latest ? (
          <p className="mt-14 font-whisper text-xl italic text-bone/60">New messages will appear here soon.</p>
        ) : (
          <>
            <Link
              to={`/media/watch/${latest.slug}`}
              viewTransition
              className={`group mt-14 grid items-end gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 ${reveal}`}
              style={{ transitionDelay: '120ms' }}
            >
              <div className="relative -mx-4 sm:-mx-8 lg:mr-0 lg:-ml-[max(2rem,calc((100vw_-_88rem)/2_+_2rem))]">
                <Cover src={sermonThumbnail(latest)} title={latest.title} bloom="always" className="aspect-video w-full" />
                <span className="absolute bottom-5 left-5 z-[3] flex h-16 w-16 items-center justify-center rounded-full bg-ember text-abyss transition-transform duration-500 ease-current group-hover:scale-110 sm:left-auto sm:right-6 sm:bottom-6 sm:h-20 sm:w-20">
                  <PlayGlyph className="h-6 w-6 translate-x-[2px]" />
                </span>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-ember uppercase">Latest message</p>
                <p className="mt-4 font-shout text-[clamp(2.5rem,4.6vw,4.25rem)] leading-[0.92] font-extrabold uppercase transition-colors duration-500 group-hover:text-shallows">
                  {latest.title}
                </p>
                <MetaLine s={latest} className="mt-5 text-sand" />
              </div>
            </Link>

            {rest.length > 0 && (
              <div className={`mt-16 ${reveal}`} style={{ transitionDelay: '240ms' }}>
                <MessageIndex items={rest} tone="dark" topicTitle={() => undefined} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
