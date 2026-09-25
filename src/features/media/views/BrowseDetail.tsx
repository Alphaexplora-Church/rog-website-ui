import { Link, useParams, useSearchParams } from 'react-router-dom'
import { PageHero } from '../../../shared/components/ui/PageHero'
import { Button } from '../../../shared/components/ui/Button'
import { Pill, Reveal, WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { categoryLabel, categoryQuery, parseCategory, type Sermon } from '../data/mediaData'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { MediaPageStatus } from './MediaPageStatus'
import { BackLink, MediaNotFound, MessageIndex } from './MediaParts'

const TYPE_LABEL: Record<string, string> = { topic: 'Topic', speaker: 'Speaker', scripture: 'Scripture' }

/**
 * Media — one shared "browse" page for Topics, Speakers, and Scripture
 * (`/media/browse/:type/:slug`), mirroring the real site's per-term
 * filtered-sermon-list pages without three near-identical components.
 * `:type` is 'topic' | 'speaker' | 'scripture'.
 *
 * REVAMP 2026-09-25 (ROG 11 §6): PageHero with the term as the shout title,
 * then the SAME index rows as the library (MediaParts `MessageIndex`, with
 * its Cursor Preview) on the bone plate.
 *
 * CATEGORY-AWARE, 2026-09-23. The library's Category filter carries into
 * this page as `?category=series|sermon`, and the list is scoped to it —
 * "Topics → Hope" opened from Sermons shows Sermon messages about Hope. The
 * back link returns to the library with the same category still selected,
 * and a one-tap way out of the scope is offered when there is one.
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

  const backTo = `/media${categoryQuery(category)}`

  if (isLoading || error) return <MediaPageStatus error={error} onRetry={retry} backTo={backTo} />

  if (!title) return <MediaNotFound message="Not found." backTo={backTo} />

  return (
    <>
      <PageHero
        size="short"
        eyebrow={`Media Library · ${TYPE_LABEL[type] ?? 'Browse'}`}
        title={title}
        lead={
          <>
            {list.length} {list.length === 1 ? 'message' : 'messages'}
            {scoped ? ` in ${categoryLabel(category)}` : ''}
          </>
        }
        actions={
          <>
            <BackLink to={backTo} />
            {scoped && (
              <>
                <Pill active>In {categoryLabel(category)}</Pill>
                <Link
                  to={`/media/browse/${type}/${slug}`}
                  className="text-[0.85rem] font-semibold text-bone/75 underline decoration-ember decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-bone"
                >
                  See all categories
                </Link>
              </>
            )}
          </>
        }
      />

      <section data-plate="light" aria-label={`Messages — ${title}`} className="relative overflow-hidden bg-bone py-24 text-abyss sm:py-32">
        <div className={container}>
          {list.length === 0 ? (
            <Reveal className="border border-dashed border-abyss/25 px-6 py-16 text-center">
              <WaveMark className="mx-auto h-6 w-16 text-abyss/40" strokeWidth={6} />
              <p className="mx-auto mt-6 max-w-[30ch] font-whisper text-[clamp(1.4rem,2.6vw,2.2rem)] italic leading-tight">
                {scoped
                  ? `No messages under this term in ${categoryLabel(category)} yet.`
                  : 'No messages under this term yet.'}
              </p>
              <div className="mt-8">
                <Button to={scoped ? `/media/browse/${type}/${slug}` : backTo} variant="solid" tone="light">
                  {scoped ? 'See all categories' : 'Back to Media Library'}
                </Button>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <MessageIndex items={list} showCategory={!scoped} topicTitle={(t) => media.findTopic(t)?.title} />
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
