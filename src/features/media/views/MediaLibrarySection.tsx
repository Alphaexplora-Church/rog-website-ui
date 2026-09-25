import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import {
  CATEGORY_FILTERS,
  categoryLabel,
  categoryQuery,
  parseCategory,
  sermonThumbnail,
  type CategoryFilter,
  type Sermon,
} from '../data/mediaData'
import { useMediaLibraryViewModel } from '../viewModels/useMediaLibraryViewModel'

type TabKey = 'messages' | 'series' | 'topics' | 'speakers' | 'scripture'

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

const TEAL = '#1b7a70'
const INK = '#0B0F14'

/**
 * Media, section 2 — "Media Library".
 *
 * ── CATEGORY + CASCADING FILTERS, 2026-09-23 ─────────────────────────────
 * Jude: the category filter "reflects to everything — pag clinick ko yung
 * series category, tas pumunta ko sa topics na tab, lahat lang ng existing
 * topics sa series na tab ay yun lang makikita ko."
 *
 * Two layers now, and the order matters:
 *
 *   1. CATEGORY (All / Series / Sermons) picks the POOL of messages. It is a
 *      filter, so it is a radio group, not tabs.
 *   2. The TABS are lenses on that pool. Every list and every count is
 *      computed from the pool, so choosing "Sermons" and opening Topics shows
 *      only topics that Sermons actually use, with Sermon-only counts. A term
 *      with nothing in the chosen category is hidden rather than shown as a
 *      dead end. Under "All" the old behaviour stands, placeholder terms
 *      included, since that is the full index.
 *
 * The category also carries THROUGH the drill-down: term links append
 * `?category=…`, and BrowseDetail scopes its list the same way.
 *
 * "Messages" is a new tab: the videos themselves. Without it, Sunday and
 * Midweek messages — which have no series — could only be reached by
 * guessing a topic or speaker. It is offered under Sermons and All, not
 * under Series (see `tabsFor`).
 *
 * WHY THE URL IS UPDATED WITH history.replaceState, NOT setSearchParams:
 * ScrollToTop re-runs when the navigation type changes, and a router
 * `replace` flips it from PUSH to REPLACE — so every category click would
 * have thrown the page back to the top. Writing the URL directly keeps the
 * browser's Back button returning to the same category, without the router
 * treating a filter click as a navigation. `history.state` is passed through
 * untouched because React Router keeps its own bookkeeping there.
 *
 * DATA FROM THE CMS (2026-09-23): everything here is computed from
 * `media`, the library the ViewModel fetched from Strapi. While it loads the
 * results area shows a shimmer (the controls stay usable), and if the CMS
 * can't be reached it shows a retry instead of an empty library that would
 * look like "no messages".
 *
 * Everything from the 2026-09-23 redesign still holds: the empty states,
 * the result count, the real tablist semantics with arrow-key movement, and
 * teal-with-alpha through inline `style` (Tailwind only emits classes that
 * already exist in the project, so a new `bg-[#1b7a70]/10` would render as
 * nothing until the dev server restarts).
 */
export function MediaLibrarySection() {
  const { ref, shown } = useInView<HTMLElement>()
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const [searchParams] = useSearchParams()
  const [category, setCategoryState] = useState<CategoryFilter>(() =>
    parseCategory(searchParams.get('category')),
  )
  const [tab, setTab] = useState<TabKey>(() => tabsFor(category)[0].key)
  const [query, setQuery] = useState('')
  const tablistRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  const tabs = tabsFor(category)
  const label = categoryLabel(category)
  const scoped = category !== 'all'

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
      ref={ref}
      id="media-library"
      data-plate="light"
      aria-labelledby="media-library-heading"
      className="bg-[#f4f4f4] text-[#0B0F14]"
    >
      <div className="mx-auto max-w-[86rem] px-6 py-24 sm:py-28">
        <div className={`${revealBase} ${shown ? revealShown : revealHidden}`}>
          {/* Doc 9 §4C eyebrow pill. */}
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              color: TEAL,
              backgroundColor: 'rgb(27 122 112 / 0.12)',
              boxShadow: 'inset 0 0 0 1px rgb(27 122 112 / 0.22)',
            }}
          >
            Browse Everything
          </span>
          <h2
            id="media-library-heading"
            className="mt-5 font-heading text-3xl font-bold sm:text-5xl"
          >
            Media Library
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-black/55 sm:text-base">
            Pick a category, then a lens. Everything below follows the category you choose.
          </p>
        </div>

        {/* Category — the filter every lens below is scoped to. */}
        <div
          className={`mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 ${revealBase} ${shown ? revealShown : revealHidden}`}
          style={{ transitionDelay: '80ms' }}
        >
          <p
            id="media-category-label"
            className="text-[10px] font-bold tracking-[0.2em] text-black/45 uppercase"
          >
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
                  className="h-11 min-w-24 rounded-full border px-5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
                  style={
                    active
                      ? { backgroundColor: INK, borderColor: INK, color: '#ffffff' }
                      : { backgroundColor: '#ffffff', borderColor: 'rgb(0 0 0 / 0.14)', color: 'rgb(0 0 0 / 0.7)' }
                  }
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Lenses + search */}
        <div
          className={`mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${revealBase} ${shown ? revealShown : revealHidden}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Browse the media library by"
            onKeyDown={onTabKeyDown}
            className="inline-flex flex-wrap gap-1 self-start rounded-full border border-black/10 bg-white p-1"
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
                  className="rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
                  style={
                    active
                      ? { backgroundColor: TEAL, color: '#ffffff' }
                      : { color: 'rgb(0 0 0 / 0.55)' }
                  }
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:w-80">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-black/35"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
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
              className="h-12 w-full rounded-full border border-black/10 bg-white pr-11 pl-11 text-sm text-[#0B0F14] transition-shadow duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-black/35 focus:border-transparent focus:ring-2 focus:outline-none"
              style={{ ['--tw-ring-color' as string]: 'rgb(27 122 112 / 0.5)' }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-black/40 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/5 hover:text-black/70"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Result count — says what the category did, not just the search. */}
        <p
          aria-live="polite"
          className={`mt-6 text-xs font-bold tracking-[0.12em] text-black/45 uppercase ${revealBase} ${shown ? revealShown : revealHidden}`}
          style={{ transitionDelay: '140ms' }}
        >
          {/* In the "X of Y" form the noun agrees with Y, not X. */}
          {isLoading || error
            ? '\u00a0'
            : q
              ? `${count} of ${total} ${total === 1 ? one : many}${suffix}`
              : `${total} ${total === 1 ? one : many}${suffix}`}
        </p>

        <div
          className={`mt-6 ${revealBase} ${shown ? revealShown : revealHidden}`}
          style={{ transitionDelay: '180ms' }}
        >
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
              {tab === 'messages' && (
                <MessageGrid items={filteredMessages} showCategory={!scoped} />
              )}

              {tab === 'series' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSeries.map((s, i) => (
                    <SeriesCard
                      key={s.slug}
                      slug={s.slug}
                      title={s.title}
                      isPlaceholder={s.isPlaceholder}
                      count={media.seriesCount(s.slug)}
                      cover={media.seriesCardThumbnail(s.slug)}
                      index={i}
                    />
                  ))}
                </div>
              )}

              {tab === 'topics' && (
                <TermList
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
                <TermList
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
                <TermList
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
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgb(27 122 112 / 0.1)', color: TEAL }}
      >
        <svg
          viewBox="0 0 20 20"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="9" r="5.5" />
          <path d="M13.5 13.5L17 17" />
        </svg>
      </span>
      <p className="mt-4 font-heading text-lg font-bold">{title}</p>
      <p className="mt-1 max-w-[40ch] text-sm text-black/50">{body}</p>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          style={{ backgroundColor: TEAL }}
        >
          {action}
        </button>
      )}
    </div>
  )
}

/**
 * The videos themselves. Under "All" each card says which category it is in,
 * since that is the one thing a mixed grid otherwise hides; inside a single
 * category the label would just repeat the filter.
 */
function MessageGrid({ items, showCategory }: { items: Sermon[]; showCategory: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <li key={s.slug}>
          <Link
            to={`/media/watch/${s.slug}`}
            className="group block rounded-3xl bg-white p-3 ring-1 ring-black/5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
            style={{ transitionDelay: `${Math.min(i, 8) * 30}ms` }}
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0B0F14]">
              <img
                src={sermonThumbnail(s)}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
              />
              {showCategory && (
                <span
                  className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.14em] text-white uppercase backdrop-blur-sm"
                  style={{ backgroundColor: 'rgb(11 15 20 / 0.7)' }}
                >
                  {categoryLabel(s.category)}
                </span>
              )}
              <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 motion-reduce:transition-none"
                  style={{ backgroundColor: 'rgb(27 122 112 / 0.85)' }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </div>
            <div className="px-2 pt-4 pb-2">
              <p className="font-heading text-base leading-snug font-bold">{s.title}</p>
              <p className="mt-1 text-[13px] text-black/50">
                {s.date && (
                  <span className={s.dateIsPlaceholder ? 'text-black/35 italic' : undefined}>
                    {s.date}
                  </span>
                )}
                {s.date && s.speakerName ? ' · ' : ''}
                {s.speakerName}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function SeriesCard({
  slug,
  title,
  count,
  cover,
  isPlaceholder,
  index,
}: {
  slug: string
  title: string
  count: number
  cover?: string
  isPlaceholder?: boolean
  index: number
}) {
  if (isPlaceholder) {
    return (
      <div
        className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-3xl border border-dashed p-6 text-center"
        style={{ borderColor: 'rgb(27 122 112 / 0.3)', backgroundColor: 'rgb(27 122 112 / 0.05)' }}
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgb(27 122 112 / 0.12)', color: TEAL }}
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 5v10M5 10h10" />
          </svg>
        </span>
        <p className="font-heading text-lg font-bold text-black/70">{title}</p>
        <p className="text-xs text-black/45">Coming soon &mdash; episodes pending</p>
      </div>
    )
  }

  return (
    <Link
      to={`/media/series/${slug}`}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-3xl bg-[#0B0F14] text-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      {cover && (
        <img
          src={cover}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
      />

      <span
        className="absolute top-4 right-4 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.14em] text-white uppercase backdrop-blur-sm"
        style={{ backgroundColor: 'rgb(27 122 112 / 0.85)' }}
      >
        {count} {count === 1 ? 'message' : 'messages'}
      </span>

      <div className="relative flex items-end justify-between gap-3 p-6">
        <p className="font-heading text-xl leading-tight font-bold">{title}</p>
        <span
          aria-hidden="true"
          className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

/**
 * Term cards: white on the grey ground, teal count badge, whole row
 * tappable. `query` carries the active category into the drill-down.
 */
function TermList({
  items,
  basePath,
  query,
}: {
  items: { slug: string; title: string; count: number; isPlaceholder?: boolean }[]
  basePath: string
  query: string
}) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) =>
        item.isPlaceholder ? (
          <li
            key={item.slug}
            className="flex items-center justify-between rounded-2xl border border-dashed border-black/15 bg-white/60 px-5 py-4"
          >
            <span className="font-medium text-black/45 italic">{item.title}</span>
            <span className="text-xs text-black/35">pending</span>
          </li>
        ) : (
          <li key={item.slug}>
            <Link
              to={`${basePath}/${item.slug}${query}`}
              className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
              style={{ transitionDelay: `${Math.min(i, 8) * 30}ms` }}
            >
              <span className="font-semibold">{item.title}</span>
              <span className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ backgroundColor: 'rgb(27 122 112 / 0.1)', color: TEAL }}
                >
                  {item.count}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 text-black/25 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </span>
            </Link>
          </li>
        ),
      )}
    </ul>
  )
}
