import { Link, useParams } from 'react-router-dom'
import { Eyebrow, Pill, Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { categoryLabel, sermonThumbnail } from '../data/mediaData'
import { youtubeEmbedUrl } from '../../../shared/lib/youtube'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { MediaPageStatus } from './MediaPageStatus'
import { BackLink, Cover, MediaNotFound, MetaLine, PlayGlyph } from './MediaParts'
import { markCover } from './mediaViewHelpers'

/**
 * Media — single message page (`/media/watch/:slug`).
 *
 * REVAMP 2026-09-25 (ROG 11 §6): the player sits on abyss (2px radius — the
 * one frame that isn't square, because it's a device, not a poster),
 * carrying the `cover-<slug>` view-transition name so the clicked thumbnail
 * morphs into it. Then the title as a big shout, speaker/date meta, topic
 * pills that link on to their browse pages, the scripture as a whisper
 * pull-quote when the message has one, and a horizontal poster rail
 * (scroll-snap) of what to watch next.
 *
 * "MORE FROM…" — the plan asks for "More from this series". A message that
 * belongs to a series shows its siblings; a standalone Sunday/Midweek
 * message has no series, so it falls back to the speaker grouping this page
 * always had (the real site's "More From Sunday Service" carousel). No
 * speaker either → no rail.
 *
 * CMS-CONNECTED 2026-09-23: plays either kind the CMS allows — a YouTube
 * embed, or the uploaded MP4 in a native <video> with its thumbnail as
 * poster.
 */
export default function SermonDetail() {
  const { slug = '' } = useParams()
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const sermon = media.findSermon(slug)

  if (isLoading || error) return <MediaPageStatus error={error} onRetry={retry} />

  if (!sermon) return <MediaNotFound message="Message not found." />

  const series = sermon.seriesSlug ? media.findSeries(sermon.seriesSlug) : undefined
  const siblings = series ? media.sermonsBySeries(series.slug).filter((s) => s.slug !== sermon.slug) : []
  const bySpeaker = sermon.speakerSlug
    ? media.sermonsBySpeaker(sermon.speakerSlug).filter((s) => s.slug !== sermon.slug)
    : []
  const more = siblings.length > 0 ? siblings : bySpeaker
  const moreTitle = siblings.length > 0 ? `More from ${series?.title}` : `More from ${sermon.speakerName}`
  const moreEyebrow = siblings.length > 0 ? 'From this series' : 'From this speaker'

  const topics = sermon.topicSlugs
    .map((t) => ({ slug: t, title: media.findTopic(t)?.title }))
    .filter((t): t is { slug: string; title: string } => Boolean(t.title))
  const scripture = sermon.scriptureSlug ? media.findScripture(sermon.scriptureSlug) : undefined

  return (
    <>
      <section data-plate="dark" aria-labelledby="sermon-heading" className="relative overflow-hidden bg-abyss pt-32 pb-24 text-bone sm:pt-36 sm:pb-32">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-x-[20%] -top-[10%] h-[70%] blur-[70px] [background-image:radial-gradient(ellipse_45%_50%_at_50%_30%,rgb(14_95_104/0.55),transparent_70%)]" />
        <div className={`${container} relative`}>
          <BackLink to={series ? `/media/series/${series.slug}` : '/media'}>
            {series ? series.title : 'Media Library'}
          </BackLink>

          <div
            className="relative mt-8 aspect-video w-full overflow-hidden rounded-[2px] bg-abyss-2 ring-1 ring-bone/10"
            style={{ viewTransitionName: `cover-${sermon.slug}` }}
          >
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
                <div className="absolute inset-0">
                  <Cover src={sermonThumbnail(sermon)} title={sermon.title} bloom="always" scrim="bottom" className="h-full w-full" />
                  <p className="absolute inset-x-0 bottom-6 z-[3] text-center font-whisper text-lg italic text-bone/85">
                    This video isn’t available yet.
                  </p>
                </div>
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

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
            <Reveal>
              <Eyebrow>{series ? `Series · ${series.title}` : categoryLabel(sermon.category)}</Eyebrow>
              <h1
                id="sermon-heading"
                className="mt-6 text-balance font-shout text-[clamp(3rem,7.5vw,7.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]"
              >
                {sermon.title}
              </h1>
              <p className="mt-6 text-[0.95rem] font-medium tabular-nums text-sand">
                {sermon.speakerSlug && sermon.speakerName && (
                  <Link
                    to={`/media/browse/speaker/${sermon.speakerSlug}`}
                    viewTransition
                    className="font-semibold text-bone underline decoration-ember decoration-1 underline-offset-[6px] transition-colors hover:text-shallows"
                  >
                    {sermon.speakerName}
                  </Link>
                )}
                {sermon.date && sermon.speakerName && <span aria-hidden="true" className="px-2 text-bone/40">·</span>}
                {sermon.date && <span className={sermon.dateIsPlaceholder ? 'italic opacity-75' : undefined}>{sermon.date}</span>}
              </p>
              {topics.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
                  {topics.map((t) => (
                    <li key={t.slug}>
                      <Link to={`/media/browse/topic/${t.slug}`} viewTransition className="group">
                        <Pill className="transition-colors duration-300 group-hover:border-ember group-hover:text-bone">{t.title}</Pill>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>

            {scripture && (
              <Reveal delay={120} className="lg:pt-16">
                <figure className="border-l-2 border-ember pl-6">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-shallows">Scripture</p>
                  <blockquote className="mt-4 font-whisper text-[clamp(2.25rem,4vw,3.5rem)] font-medium italic leading-[1.05] text-bone">
                    {scripture.title}
                  </blockquote>
                  <figcaption className="mt-5">
                    <Link
                      to={`/media/browse/scripture/${scripture.slug}`}
                      viewTransition
                      className="group inline-flex items-center gap-2 text-[0.85rem] font-semibold text-sand transition-colors hover:text-bone"
                    >
                      More messages from {scripture.title}
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section data-plate="dark" aria-labelledby="more-heading" className="relative overflow-hidden bg-river py-24 text-bone sm:py-32">
          <div aria-hidden="true" className="grain absolute inset-0" />
          <div className={`${container} relative`}>
            <SectionHead
              id="more-heading"
              eyebrow={moreEyebrow}
              title={moreTitle}
              titleClassName="font-shout font-extrabold uppercase leading-[0.9] text-[clamp(2.5rem,5.5vw,5rem)]"
            />
            <ul className="-mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 no-scrollbar sm:-mx-8 sm:scroll-px-8 sm:gap-6 sm:px-8">
              {more.map((s) => (
                <li key={s.slug} className="w-[78vw] flex-none snap-start sm:w-[24rem]">
                  <Link
                    to={`/media/watch/${s.slug}`}
                    viewTransition
                    onClick={(e) => markCover(e, s.slug)}
                    className="group block"
                  >
                    <div className="relative">
                      <Cover src={sermonThumbnail(s)} title={s.title} className="aspect-video w-full" />
                      <span
                        aria-hidden="true"
                        className="absolute right-4 bottom-4 z-[3] flex h-11 w-11 items-center justify-center rounded-full bg-bone text-abyss transition-[background-color,transform] duration-500 ease-current group-hover:scale-110 group-hover:bg-ember"
                      >
                        <PlayGlyph className="h-4 w-4" />
                      </span>
                    </div>
                    <MetaLine s={s} className="mt-4 text-bone/80" />
                    <p className="mt-1 font-shout text-[1.9rem] font-extrabold uppercase leading-[0.95]">{s.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
