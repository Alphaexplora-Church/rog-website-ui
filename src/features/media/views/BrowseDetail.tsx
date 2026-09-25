import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import {
  categoryLabel,
  categoryQuery,
  parseCategory,
  sermonThumbnail,
  type Sermon,
} from '../data/mediaData'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { MediaPageStatus } from './MediaPageStatus'

/**
 * Media — one shared "browse" page for Topics, Speakers, and Scripture
 * (`/media/browse/:type/:slug`), mirroring the real site's per-term
 * filtered-sermon-list pages without three near-identical components.
 * `:type` is 'topic' | 'speaker' | 'scripture'.
 *
 * CATEGORY-AWARE, 2026-09-23. The Media Library's Category filter carries
 * into this page as `?category=series|sermon`, and the list is scoped to it —
 * so "Topics → Hope" opened from the Sermons category shows Sermon messages
 * about Hope, not every message about Hope. The back link returns to the
 * library with the same category still selected, and a one-tap way out of
 * the scope is offered when there is one.
 */
export default function BrowseDetail() {
  const { type = '', slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const category = parseCategory(searchParams.get('category'))
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const pool = media.sermonsInCategory(category)
  const scoped = category !== 'all'

  let title = ''
  let list: Sermon[] = []

  if (type === 'topic') {
    title = media.findTopic(slug)?.title ?? ''
    list = media.sermonsByTopic(slug, pool)
  } else if (type === 'speaker') {
    // Name comes from the full index, so a speaker page still resolves even
    // when the chosen category has none of their messages.
    title = media.speakerSummaries().find((s) => s.slug === slug)?.name ?? ''
    list = media.sermonsBySpeaker(slug, pool)
  } else if (type === 'scripture') {
    title = media.findScripture(slug)?.title ?? ''
    list = media.sermonsByScripture(slug, pool)
  }

  const { ref, shown } = useInView<HTMLElement>()
  const backTo = `/media${categoryQuery(category)}`

  if (isLoading || error) return <MediaPageStatus error={error} onRetry={retry} backTo={backTo} />

  if (!title) {
    return (
      <section data-plate="dark" className="bg-black text-white">
        <div className="mx-auto max-w-[86rem] px-6 py-32 text-center">
          <p className="text-white/60">Not found.</p>
          <Link to={backTo} className="mt-4 inline-block text-[#8FD4C9] underline">
            Back to Media Library
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} data-plate="dark" className="bg-black text-white">
      <div
        className={`mx-auto max-w-[86rem] px-6 py-20 sm:py-24 ${revealBase} ${shown ? revealShown : revealHidden}`}
      >
        <Link to={backTo} className="text-xs font-bold tracking-[0.15em] text-[#8FD4C9] uppercase">
          ← Media Library
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">{title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/55">
          <span>
            {list.length} {list.length === 1 ? 'message' : 'messages'}
          </span>
          {scoped && (
            <>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase"
                style={{
                  color: '#8FD4C9',
                  backgroundColor: 'rgb(27 122 112 / 0.18)',
                  boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
                }}
              >
                In {categoryLabel(category)}
              </span>
              <Link
                to={`/media/browse/${type}/${slug}`}
                className="text-xs font-semibold text-white/60 underline decoration-white/25 underline-offset-4 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
              >
                See all categories
              </Link>
            </>
          )}
        </div>

        {list.length === 0 ? (
          <p className="mt-10 text-white/45 italic">
            {scoped
              ? `No messages under this term in ${categoryLabel(category)} yet.`
              : 'No messages under this term yet.'}
          </p>
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
  )
}
