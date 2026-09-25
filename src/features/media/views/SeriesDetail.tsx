import { Link, useParams } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { sermonThumbnail } from '../data/mediaData'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { MediaPageStatus } from './MediaPageStatus'

/**
 * Media — series detail page (`/media/series/:slug`). Banner + grid of the
 * sermons filed under that series, matching the real site's per-series
 * page (the Ecclesiastes/Exodus/etc. screenshots Jude shared).
 *
 * The banner mirrors the same image the Series card shows in the Media
 * Library grid (`seriesBannerImage` — see mediaData.ts for the full
 * back-and-forth: Jude confirmed the header and the card should show the
 * same picture, and it should vary by which series was clicked). A
 * `Series.coverImage` override remains available for a future dedicated
 * banner graphic; until then this always equals the card thumbnail.
 * A placeholder series with zero real episodes (ecclesiastes, exodus) has
 * no thumbnail to borrow, so it falls back to the solid/gradient header
 * below rather than a fabricated image.
 */
export default function SeriesDetail() {
  const { slug = '' } = useParams()
  const { ref, shown } = useInView<HTMLElement>()
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const item = media.findSeries(slug)
  const list = media.sermonsBySeries(slug)
  const banner = item ? media.seriesBannerImage(slug) : undefined

  if (isLoading || error) return <MediaPageStatus error={error} onRetry={retry} backTo="/media?category=series" />

  if (!item) {
    return (
      <section data-plate="dark" className="bg-black text-white">
        <div className="mx-auto max-w-[86rem] px-6 py-32 text-center">
          <p className="text-white/60">Series not found.</p>
          <Link to="/media" className="mt-4 inline-block text-[#8FD4C9] underline">
            Back to Media Library
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section data-plate="dark" className="relative bg-black text-white">
        <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden sm:h-[46vh]">
          {banner ? (
            <>
              <img src={banner} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#161616] via-[#0B0F14] to-black" />
          )}
          <Link
            to="/media"
            className="absolute top-24 left-6 z-10 text-xs font-bold tracking-[0.15em] text-white/80 uppercase transition hover:text-white sm:top-28 sm:left-10"
          >
            ← Media Library
          </Link>
          <h1 className="absolute inset-x-6 bottom-8 font-heading text-3xl font-bold uppercase leading-[1.05] sm:inset-x-10 sm:bottom-10 sm:text-5xl">
            {item.title}
          </h1>
        </div>
      </section>

      <section ref={ref} data-plate="dark" className="bg-black text-white">
        <div
          className={`mx-auto max-w-[86rem] px-6 py-20 sm:py-24 ${revealBase} ${shown ? revealShown : revealHidden}`}
        >
          <p className="text-sm text-white/55">
            {list.length} {list.length === 1 ? 'message' : 'messages'}
          </p>

          {list.length === 0 ? (
            <p className="mt-10 text-white/45 italic">No messages in this series yet.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <Link key={s.slug} to={`/media/watch/${s.slug}`} className="group">
                  <img
                    src={sermonThumbnail(s)}
                    alt={s.title}
                    loading="lazy"
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                  <p className="mt-3 font-heading text-base font-bold group-hover:text-[#8FD4C9]">
                    {s.title}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    {s.date && (
                      <span className={s.dateIsPlaceholder ? 'text-white/30 italic' : undefined}>
                        {s.date}
                      </span>
                    )}
                    {s.date && s.speakerName ? ' · ' : ''}
                    {s.speakerName}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
