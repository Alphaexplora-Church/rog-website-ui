import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { container } from '../../../shared/styles/tokens'
import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import { Button } from '../../../shared/components/ui/Button'
import { Pill, Reveal, SectionHead, WaveMark } from '../../../shared/components/ui/River'
import {
  CATEGORY_FILTERS,
  categoryLabel,
  categoryQuery,
  parseCategory,
  type CategoryFilter,
} from '../data/mediaData'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'
import { ArrowGlyph, Cover, MessageIndex, PosterGrid } from './MediaParts'
import { markCover } from './mediaViewHelpers'

type TabKey = 'messages' | 'series' | 'topics' | 'speakers' | 'scripture'
type ViewMode = 'list' | 'posters'

const ALL_TABS: { key: TabKey; label: string }[] = [
  { key: 'messages', label: 'Messages' },
  { key: 'series', label: 'Series' },
  { key: 'topics', label: 'Topics' },
  { key: 'speakers', label: 'Speakers' },
  { key: 'scripture', label: 'Scripture' },
]

/**
 * Which lenses each category offers (Jude, 2026-09-23):
 *   Series  → Series, Topics, Speakers, Scripture. No Messages tab — the
 *             series cards ARE the way in; episodes live inside each series.
 *   Sermons → Messages, Topics, Speakers, Scripture. Sermons never belong to
 *             a series, so that tab would only ever be empty.
 *   All     → every lens.
 * The first tab listed is the one a category opens on.
 */
function tabsFor(category: CategoryFilter) {
  if (category === 'series') return ALL_TABS.filter((t) => t.key !== 'messages')
  if (category === 'sermon') return ALL_TABS.filter((t) => t.key !== 'series')
  return ALL_TABS
}

const VIEW_KEY = 'rog-media-view'
function readView(): ViewMode {
  try {
    return window.localStorage.getItem(VIEW_KEY) === 'posters' ? 'posters' : 'list'
  } catch {
    return 'list'
  }
}

/**
 * Media, section 2 — "Media Library", on the bone (light) plate.
 *
 * ── REVAMP 2026-09-25 (ROG 11 §6) ────────────────────────────────────────
 * Same controls, same behaviour, new faces:
 *   - Category is a radio row of pills (abyss when chosen); the lens tabs are
 *     pills with ember for the active tab.
 *   - Messages default to an INDEX LIST (MediaParts `MessageIndex`): date
 *     numerals, shout title, speaker, pills, arrow — scannable at a glance,
 *     with a Cursor Preview thumbnail on desktop and an inline one on touch.
 *     A list/posters toggle (remembered per browser) swaps to a staggered
 *     wall of duotone posters.
 *   - Series is a horizontal shelf of 4:5 duotone posters that bloom to
 *     colour on hover (or at screen centre on touch).
 *   - Topics / Speakers / Scripture are an editorial word index — each term
 *     set big in shout with its count as a superscript.
 *
 * ── CATEGORY + CASCADING FILTERS, 2026-09-23 ─────────────────────────────
 * Jude: the category filter "reflects to everything". Two layers, order
 * matters:
 *   1. CATEGORY (All / Series / Sermons) picks the POOL of messages — a
 *      filter, so a radio group, not tabs.
 *   2. The TABS are lenses on that pool; every list and count is computed
 *      from it. A term with nothing in the chosen category is hidden rather
 *      than shown as a dead end. Under "All" placeholder terms stay visible.
 * The category also carries THROUGH the drill-down (`?category=…`).
 *
 * WHY THE URL IS UPDATED WITH history.replaceState, NOT setSearchParams:
 * ScrollToTop re-runs when the navigation type changes, and a router
 * `replace` flips it from PUSH to REPLACE — every category click would throw
 * the page back to the top. `history.state` is passed through untouched
 * because React Router keeps its own bookkeeping there.
 *
 * DATA FROM THE CMS (2026-09-23): while the library loads the results area
 * shows a shimmer (controls stay usable); if the CMS can't be reached it
 * shows a retry instead of an empty library that would look like "no
 * messages". Empty states, the live result count, and real tablist/
 * radiogroup semantics with arrow-key movement all still hold.
 */
export function MediaLibrarySection() {
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const [searchParams] = useSearchParams()
  const [category, setCategoryState] = useState<CategoryFilter>(() =>
    parseCategory(searchParams.get('category')),
  )
  const [tab, setTab] = useState<TabKey>(() => tabsFor(category)[0].key)
  const [query, setQuery] = useState('')
  const [view, setViewState] = useState<ViewMode>(readView)
  const tablistRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  const tabs = tabsFor(category)
  const label = categoryLabel(category)
  const scoped = category !== 'all'

  function setView(next: ViewMode) {
    setViewState(next)
    try {
      window.localStorage.setItem(VIEW_KEY, next)
    } catch {
      /* storage blocked — the toggle still works for this visit */
    }
  }

  function setCategory(next: CategoryFilter) {
    setCategoryState(next)
    const nextTabs = tabsFor(next)
    if (!nextTabs.some((t) => t.key === tab)) setTab(nextTabs[0].key)
    const url = new URL(window.location.href)
    if (next === 'all') url.searchParams.delete('category')
    else url.searchParams.set('category', next)
    window.history.replaceState(window.history.state, '', url)
  }

  /* ── The pool, and every lens computed from it ───────────────────────── */
  const pool = media.sermonsInCategory(category)
  const q = query.trim().toLowerCase()

  const poolSeries = media.seriesInCategory(category)
  const poolTopics = media.topics
    .map((t) => ({ ...t, count: media.topicCount(t.slug, pool) }))
    .filter((t) => !scoped || t.count > 0)
  const poolScripture = media.scripture
    .map((s) => ({ ...s, count: media.scriptureCount(s.slug, pool) }))
    .filter((s) => !scoped || s.count > 0)
  const poolSpeakers = media.speakerSummaries(pool)

  const filteredMessages = pool.filter(
    (s) => s.title.toLowerCase().includes(q) || (s.speakerName ?? '').toLowerCase().includes(q),
  )
  const filteredSeries = poolSeries.filter((s) => s.title.toLowerCase().includes(q))
  const filteredTopics = poolTopics.filter((t) => t.title.toLowerCase().includes(q))
  const filteredSpeakers = poolSpeakers.filter((s) => s.name.toLowerCase().includes(q))
  const filteredScripture = poolScripture.filter((s) => s.title.toLowerCase().includes(q))
  /* ────────────────────────────────────────────────────────────────────── */

  const totals: Record<TabKey, number> = {
    messages: pool.length,
    series: poolSeries.length,
    topics: poolTopics.length,
    speakers: poolSpeakers.length,
    scripture: poolScripture.length,
  }
  const shownCounts: Record<TabKey, number> = {
    messages: filteredMessages.length,
    series: filteredSeries.length,
    topics: filteredTopics.length,
    speakers: filteredSpeakers.length,
    scripture: filteredScripture.length,
  }
  const noun: Record<TabKey, [string, string]> = {
    messages: ['message', 'messages'],
    series: ['series', 'series'],
    topics: ['topic', 'topics'],
    speakers: ['speaker', 'speakers'],
    scripture: ['passage', 'passages'],
  }

  const count = shownCounts[tab]
  const total = totals[tab]
  const [one, many] = noun[tab]
  const isEmpty = count === 0
  const suffix = scoped ? ` in ${label}` : ''
  const qs = categoryQuery(category)
  const topicTitle = (slug: string) => media.findTopic(slug)?.title

  /* Left/right arrows move between tabs, which is what the tablist role
     promises. Without it the role is a lie to anyone on a keyboard. */
  function onTabKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const i = tabs.findIndex((t) => t.key === tab)
    const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length
    setTab(tabs[next].key)
    tablistRef.current?.querySelectorAll('button')?.[next]?.focus()
  }

  /* Same arrow-key contract for the category radio group. */
  function onCategoryKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const i = CATEGORY_FILTERS.findIndex((c) => c.key === category)
    const n = CATEGORY_FILTERS.length
    const next = e.key === 'ArrowRight' ? (i + 1) % n : (i - 1 + n) % n
    setCategory(CATEGORY_FILTERS[next].key)
    categoryRef.current?.querySelectorAll('button')?.[next]?.focus()
  }

  return (
    <section
      id="media-library"
      data-plate="light"
      aria-labelledby="media-library-heading"
      className="relative scroll-mt-20 overflow-hidden bg-bone py-24 text-abyss sm:py-32"
    >
      <WaveMark
        className="pointer-events-none absolute -right-[6%] -top-[2%] h-auto w-[55vw] max-w-[760px] text-abyss/[0.05]"
        strokeWidth={3}
      />
      <div className={`${container} relative`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHead
            id="media-library-heading"
            tone="light"
            eyebrow="Browse everything"
            title="Media Library"
            lead="Pick a category, then a lens. Everything below follows the category you choose."
          />

          {/* Category — the filter every lens below is scoped to. */}
          <Reveal className="flex flex-col gap-3 lg:items-end">
            <p id="media-category-label" className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-abyss/60">
              Category
            </p>
            <div
              ref={categoryRef}
              role="radiogroup"
              aria-labelledby="media-category-label"
              onKeyDown={onCategoryKeyDown}
              className="flex flex-wrap gap-2"
            >
              {CATEGORY_FILTERS.map((c) => {
                const active = category === c.key
                return (
                  <button
                    key={c.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setCategory(c.key)}
                    className={`h-11 min-w-24 rounded-full border px-5 text-[0.9rem] font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-current active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                      active
                        ? 'border-abyss bg-abyss text-bone'
                        : 'border-abyss/25 text-abyss/80 hover:border-abyss hover:text-abyss'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        {/* Lenses + search + view */}
        <Reveal
          delay={80}
          className="mt-14 flex flex-col gap-4 border-y border-abyss/15 py-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Browse the media library by"
            onKeyDown={onTabKeyDown}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {tabs.map((t) => {
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(t.key)}
                  className={`h-11 flex-none rounded-full border px-5 font-shout text-[1.15rem] font-bold uppercase tracking-[0.04em] transition-[background-color,border-color,color] duration-300 ease-current motion-reduce:transition-none ${
                    active
                      ? 'border-ember bg-ember text-abyss'
                      : 'border-transparent text-abyss/70 hover:border-abyss/25 hover:text-abyss'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full lg:w-80">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-abyss/50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="9" r="5.5" />
                <path d="M13.5 13.5L17 17" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={scoped ? `Search ${label}` : 'Search the library'}
                aria-label="Search the media library"
                className="h-12 w-full rounded-[2px] border border-abyss/25 bg-bone-2/60 pr-11 pl-11 text-[0.95rem] text-abyss transition-[border-color,background-color] duration-300 ease-current placeholder:text-abyss/50 hover:border-abyss/45 focus:border-abyss focus:bg-bone-2 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-1.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-abyss/55 transition-colors duration-300 hover:bg-abyss/5 hover:text-abyss"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              )}
            </div>

            {tab === 'messages' && (
              <div role="group" aria-label="Message layout" className="flex flex-none rounded-full border border-abyss/25 p-1">
                {(['list', 'posters'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    aria-label={v === 'list' ? 'Show as list' : 'Show as posters'}
                    onClick={() => setView(v)}
                    className={`flex h-9 w-10 items-center justify-center rounded-full transition-colors duration-300 ease-current ${view === v ? 'bg-abyss text-bone' : 'text-abyss/65 hover:text-abyss'}`}
                  >
                    {v === 'list' ? (
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                        <path d="M3 5h14M3 10h14M3 15h14" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                        <rect x="2.5" y="3.5" width="6.5" height="5" />
                        <rect x="11" y="3.5" width="6.5" height="5" />
                        <rect x="2.5" y="11.5" width="6.5" height="5" />
                        <rect x="11" y="11.5" width="6.5" height="5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Result count — says what the category did, not just the search. */}
        <p aria-live="polite" className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-abyss/60">
          {/* In the "X of Y" form the noun agrees with Y, not X. */}
          {isLoading || error
            ? ' '
            : q
              ? `${count} of ${total} ${total === 1 ? one : many}${suffix}`
              : `${total} ${total === 1 ? one : many}${suffix}`}
        </p>

        <div className="mt-8">
          {isLoading ? (
            <LoadingBlock tone="light" />
          ) : error ? (
            <ErrorBlock tone="light" error={error} onRetry={retry} />
          ) : isEmpty ? (
            q ? (
              <EmptyState
                title={`No ${many} match “${query}”${suffix}`}
                body="Try a shorter word, or clear the search to see everything in this tab."
                action="Clear search"
                onAction={() => setQuery('')}
              />
            ) : (
              <EmptyState
                title={scoped ? `No ${many} in ${label} yet` : `No ${many} yet`}
                body={
                  scoped
                    ? 'Nothing in this category uses this lens yet. It fills in on its own as messages are added.'
                    : 'This fills in on its own as messages are added.'
                }
                action={scoped ? 'Show all categories' : undefined}
                onAction={scoped ? () => setCategory('all') : undefined}
              />
            )
          ) : (
            <>
              {tab === 'messages' &&
                (view === 'list' ? (
                  <MessageIndex items={filteredMessages} showCategory={!scoped} topicTitle={topicTitle} />
                ) : (
                  <PosterGrid items={filteredMessages} showCategory={!scoped} />
                ))}

              {tab === 'series' && (
                <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 no-scrollbar sm:-mx-8 sm:scroll-px-8 sm:gap-6 sm:px-8">
                  {filteredSeries.map((s) => (
                    <SeriesPoster
                      key={s.slug}
                      slug={s.slug}
                      title={s.title}
                      isPlaceholder={s.isPlaceholder}
                      count={media.seriesCount(s.slug)}
                      cover={media.seriesCardThumbnail(s.slug)}
                    />
                  ))}
                </ul>
              )}

              {tab === 'topics' && (
                <TermIndex
                  items={filteredTopics.map((t) => ({
                    slug: t.slug,
                    title: t.title,
                    isPlaceholder: t.isPlaceholder,
                    count: t.count,
                  }))}
                  basePath="/media/browse/topic"
                  query={qs}
                />
              )}

              {tab === 'speakers' && (
                <TermIndex
                  items={filteredSpeakers.map((s) => ({
                    slug: s.slug,
                    title: s.name,
                    count: s.count,
                  }))}
                  basePath="/media/browse/speaker"
                  query={qs}
                />
              )}

              {tab === 'scripture' && (
                <TermIndex
                  items={filteredScripture.map((s) => ({
                    slug: s.slug,
                    title: s.title,
                    isPlaceholder: s.isPlaceholder,
                    count: s.count,
                  }))}
                  basePath="/media/browse/scripture"
                  query={qs}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function EmptyState({
  title,
  body,
  action,
  onAction,
}: {
  title: string
  body: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="relative overflow-hidden border border-dashed border-abyss/25 px-6 py-16 text-center sm:py-20">
      <WaveMark className="mx-auto h-6 w-16 text-abyss/40" strokeWidth={6} />
      <p className="mx-auto mt-6 max-w-[22ch] text-balance font-shout text-[clamp(1.9rem,4vw,3rem)] font-extrabold uppercase leading-[0.92]">
        {title}
      </p>
      <p className="mx-auto mt-4 max-w-[40ch] font-whisper text-lg italic text-abyss/70">{body}</p>
      {action && onAction && (
        <div className="mt-8">
          <Button onClick={onAction} variant="solid" tone="light">
            {action}
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Series poster on the shelf: 4:5, duotone at rest, Colour Bloom on hover /
 * at screen centre, title over a scrim. A series with no published episodes
 * is a "coming soon" poster (not a link to an empty page).
 */
function SeriesPoster({
  slug,
  title,
  count,
  cover,
  isPlaceholder,
}: {
  slug: string
  title: string
  count: number
  cover?: string
  isPlaceholder?: boolean
}) {
  const body = (
    <>
      <Cover src={cover} className="aspect-[4/5] w-full" scrim="bottom" />
      <div className="absolute inset-x-0 bottom-0 z-[3] p-5 text-bone sm:p-6">
        {isPlaceholder ? (
          <Pill>Coming soon &mdash; episodes pending</Pill>
        ) : (
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-shallows">
            {count} {count === 1 ? 'message' : 'messages'}
          </p>
        )}
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className="font-shout text-[clamp(2.4rem,4vw,3.4rem)] font-extrabold uppercase leading-[0.86]">{title}</p>
          {!isPlaceholder && (
            <span
              aria-hidden="true"
              className="mb-1 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-bone/40 transition-[background-color,border-color,color,transform] duration-500 ease-current group-hover:translate-x-1 group-hover:border-ember group-hover:bg-ember group-hover:text-abyss"
            >
              <ArrowGlyph />
            </span>
          )}
        </div>
      </div>
    </>
  )

  return (
    <li className="w-[76vw] flex-none snap-start sm:w-[20rem] lg:w-[22rem]">
      {isPlaceholder ? (
        <div className="group relative">{body}</div>
      ) : (
        <Link
          to={`/media/series/${slug}`}
          viewTransition
          onClick={(e) => markCover(e, slug)}
          className="group relative block"
        >
          {body}
        </Link>
      )}
    </li>
  )
}

/**
 * Topics / Speakers / Scripture as an editorial word index: each term set
 * big in shout, its count as an ember-ink superscript, an ember underline
 * flowing in on hover. `query` carries the active category into the
 * drill-down. Placeholder terms stay visible under "All", faded, marked
 * "pending", not linked.
 */
function TermIndex({
  items,
  basePath,
  query,
}: {
  items: { slug: string; title: string; count: number; isPlaceholder?: boolean }[]
  basePath: string
  query: string
}) {
  return (
    <ul className="flex flex-wrap items-baseline gap-x-10 gap-y-5 sm:gap-x-14">
      {items.map((item, i) => (
        <Reveal as="li" key={item.slug} delay={Math.min(i, 8) * 60}>
          {item.isPlaceholder ? (
            <span className="inline-flex items-start gap-2 font-shout text-[clamp(2.5rem,6.5vw,5.75rem)] font-extrabold uppercase leading-[0.95] text-abyss/30">
              {item.title}
              <span className="mt-[0.35em] font-whisper text-base normal-case italic text-abyss/55">pending</span>
            </span>
          ) : (
            <Link
              to={`${basePath}/${item.slug}${query}`}
              viewTransition
              className="group inline-flex items-start gap-2 font-shout text-[clamp(2.5rem,6.5vw,5.75rem)] font-extrabold uppercase leading-[0.95] text-abyss"
            >
              <span className="relative">
                {item.title}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-[3px] w-full origin-left scale-x-0 bg-ember transition-transform duration-[600ms] ease-current group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
              <span className="mt-[0.3em] font-sans text-[0.95rem] font-bold tabular-nums text-ember-ink">
                {item.count}
                <span className="sr-only"> {item.count === 1 ? 'message' : 'messages'}</span>
              </span>
            </Link>
          )}
        </Reveal>
      ))}
    </ul>
  )
}
