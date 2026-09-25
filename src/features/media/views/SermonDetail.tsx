import { Link, useParams } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { sermonThumbnail } from '../data/mediaData'
import { youtubeEmbedUrl } from '../../../shared/lib/youtube'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { MediaPageStatus } from './MediaPageStatus'

/**
 * Media — single message page (`/media/watch/:slug`). Real embedded
 * YouTube player (the sermon's own real video id — see mediaData.ts) plus
 * a "More from [speaker]" strip, matching the real site's sermon-detail
 * pattern (its own "More From Sunday Service" carousel in the screenshots
 * Jude shared, here scoped to speaker since that's the grouping our
 * seven-sermon sample set actually supports).
 *
 * CMS-CONNECTED 2026-09-23: the message comes from Strapi via the Media
 * ViewModel. Plays either kind the CMS allows — a YouTube embed, or the
 * uploaded MP4 in a native <video> with its uploaded thumbnail as poster.
 */
export default function SermonDetail() {
  const { slug = '' } = useParams()
  const { ref, shown } = useInView<HTMLElement>()
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const sermon = media.findSermon(slug)

  if (isLoading || error) return <MediaPageStatus error={error} onRetry={retry} />

  if (!sermon) {
    return (
      <section data-plate="dark" className="bg-black text-white">
        <div className="mx-auto max-w-[86rem] px-6 py-32 text-center">
          <p className="text-white/60">Message not found.</p>
          <Link to="/media" className="mt-4 inline-block text-[#8FD4C9] underline">
            Back to Media Library
          </Link>
        </div>
      </section>
    )
  }

  // No speaker, no "More from…" strip — there is nobody to group by.
  const more = sermon.speakerSlug
    ? media.sermonsBySpeaker(sermon.speakerSlug).filter((s) => s.slug !== sermon.slug)
    : []

  return (
    <>
      <section ref={ref} data-plate="dark" className="bg-black text-white">
        <div
          className={`mx-auto max-w-[86rem] px-6 py-20 sm:py-24 ${revealBase} ${shown ? revealShown : revealHidden}`}
        >
          <Link to="/media" className="text-xs font-bold tracking-[0.15em] text-[#8FD4C9] uppercase">
            ← Media Library
          </Link>

          <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-[#0B0F14] ring-1 ring-white/10">
            {sermon.mediaType === 'upload' ? (
              sermon.videoUrl ? (
                <video
                  src={sermon.videoUrl}
                  poster={sermonThumbnail(sermon)}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={sermon.title}
                  className="h-full w-full"
                />
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-white/50">
                  This video isn’t available yet.
                </p>
              )
            ) : (
              <iframe
                src={youtubeEmbedUrl(sermon.videoId)}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>

          <h1 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">{sermon.title}</h1>
          <p className="mt-2 text-sm text-white/55">
            {sermon.date && (
              <span className={sermon.dateIsPlaceholder ? 'text-white/35 italic' : undefined}>
                {sermon.date}
              </span>
            )}
            {sermon.date && sermon.speakerName ? ' · ' : ''}
            {sermon.speakerName}
          </p>
        </div>
      </section>

      {more.length > 0 && (
        <section data-plate="dark" className="bg-[#161616] text-white">
          <div className="mx-auto max-w-[86rem] px-6 py-16">
            <p className="font-heading text-lg font-bold">More from {sermon.speakerName}</p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((s) => (
                <Link key={s.slug} to={`/media/watch/${s.slug}`} className="group">
                  <img
                    src={sermonThumbnail(s)}
                    alt={s.title}
                    loading="lazy"
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                  <p className="mt-3 text-sm font-bold group-hover:text-[#8FD4C9]">{s.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
