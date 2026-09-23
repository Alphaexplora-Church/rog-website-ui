import { Link, useParams } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import {
  findScripture,
  findTopic,
  sermonsByScripture,
  sermonsBySpeaker,
  sermonsByTopic,
  sermonThumbnail,
  speakerSummaries,
  type Sermon,
} from '../data/mediaData'

/**
 * Media — one shared "browse" page for Topics, Speakers, and Scripture
 * (`/media/browse/:type/:slug`), mirroring the real site's per-term
 * filtered-sermon-list pages without three near-identical components.
 * `:type` is 'topic' | 'speaker' | 'scripture'.
 */
export default function BrowseDetail() {
  const { type = '', slug = '' } = useParams()

  let title = ''
  let list: Sermon[] = []

  if (type === 'topic') {
    title = findTopic(slug)?.title ?? ''
    list = sermonsByTopic(slug)
  } else if (type === 'speaker') {
    title = speakerSummaries().find((s) => s.slug === slug)?.name ?? ''
    list = sermonsBySpeaker(slug)
  } else if (type === 'scripture') {
    title = findScripture(slug)?.title ?? ''
    list = sermonsByScripture(slug)
  }

  const { ref, shown } = useInView<HTMLElement>()

  if (!title) {
    return (
      <section data-plate="dark" className="bg-black text-white">
        <div className="mx-auto max-w-[86rem] px-6 py-32 text-center">
          <p className="text-white/60">Not found.</p>
          <Link to="/media" className="mt-4 inline-block text-[#8FD4C9] underline">
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
        <Link to="/media" className="text-xs font-bold tracking-[0.15em] text-[#8FD4C9] uppercase">
          ← Media Library
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-white/55">
          {list.length} {list.length === 1 ? 'message' : 'messages'}
        </p>

        {list.length === 0 ? (
          <p className="mt-10 text-white/45 italic">No messages under this term yet.</p>
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
                  {s.date ? ' · ' : ''}
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
