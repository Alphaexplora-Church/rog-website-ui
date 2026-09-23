import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import {
  scripture,
  scriptureCount,
  series,
  seriesCount,
  seriesCardThumbnail,
  speakerSummaries,
  topics,
  topicCount,
} from '../data/mediaData'

type TabKey = 'series' | 'topics' | 'speakers' | 'scripture'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'series', label: 'Series' },
  { key: 'topics', label: 'Topics' },
  { key: 'speakers', label: 'Speakers' },
  { key: 'scripture', label: 'Scripture' },
]

const TEAL = '#1b7a70'

/**
 * Media, section 2 — "Media Library". Reproduces the real site's filtering
 * logic Jude asked to keep (Series / Topics / Speakers / Scripture tabs,
 * each a term list that drills into a filtered sermon grid) — just against
 * our seven-sermon sample set instead of the real site's full archive.
 * Search is a real client-side substring match, not a visual placeholder —
 * cheap and correct since all the sample data already lives in memory.
 *
 * ── REDESIGNED 2026-09-23 ────────────────────────────────────────────────
 * Jude: "while keeping the filtering of the Media tab, enhance also the UI…
 * fix also the design of… the Media Library Section."
 *
 * THE FILTERING IS UNTOUCHED. `q`, the four `.filter()` expressions, the
 * `speakerSummaries()` memo, every drill-down path and every count helper
 * are character-for-character what they were. Only presentation changed,
 * plus three things that were missing rather than wrong:
 *
 *   - AN EMPTY STATE. Searching for something with no matches rendered a
 *     silently blank area — the user could not tell the search had worked,
 *     failed, or broken. Doc 9's own checklist lists empty states as
 *     non-negotiable. There is now one, and it echoes the query back and
 *     offers a way out.
 *   - A RESULT COUNT, so a filter that narrows 12 down to 3 says so.
 *   - REAL TAB SEMANTICS. The tabs were `<button aria-pressed>`, which
 *     announces a toggle, not a tab set. They are now a proper
 *     `role="tablist"` with `aria-selected` and left/right arrow-key
 *     movement, which is what a screen reader and a keyboard both expect.
 *
 * WHY IT LOOKED PALE. The section was `bg-white`, the cards were white, and
 * the `isPlaceholder` tiles were `bg-black/[0.02]` with `border-black/15`
 * text at `black/40` — near-invisible on the ground they sat on, which is
 * why the library read as washed out next to the hero. It now has three
 * tones instead of one: an `#f4f4f4` ground, white cards, and teal as the
 * live accent. Placeholder tiles finally have enough contrast to be read as
 * deliberate rather than broken.
 *
 * Teal-with-alpha goes through inline `style`, not Tailwind classes:
 * Tailwind only emits utilities whose exact class string already exists in
 * the project, so a new `bg-[#1b7a70]/10` would render as nothing until the
 * dev server restarts. Same escape hatch tokens.ts uses for textH1.
 */
export function MediaLibrarySection() {
  const { ref, shown } = useInView<HTMLElement>()
  const [tab, setTab] = useState<TabKey>('series')
  const [query, setQuery] = useState('')
  const tablistRef = useRef<HTMLDivElement>(null)

  const speakers = useMemo(() => speakerSummaries(), [])
  const q = query.trim().toLowerCase()

  /* ── FILTERING — unchanged from the original ─────────────────────────── */
  const filteredSeries = series.filter((s) => s.title.toLowerCase().includes(q))
  const filteredTopics = topics.filter((t) => t.title.toLowerCase().includes(q))
  const filteredSpeakers = speakers.filter((s) => s.name.toLowerCase().includes(q))
  const filteredScripture = scripture.filter((s) => s.title.toLowerCase().includes(q))
  /* ────────────────────────────────────────────────────────────────────── */

  const totals: Record<TabKey, number> = {
    series: series.length,
    topics: topics.length,
    speakers: speakers.length,
    scripture: scripture.length,
  }
  const shownCounts: Record<TabKey, number> = {
    series: filteredSeries.length,
    topics: filteredTopics.length,
    speakers: filteredSpeakers.length,
    scripture: filteredScripture.length,
  }
  const noun: Record<TabKey, [string, string]> = {
    series: ['series', 'series'],
    topics: ['topic', 'topics'],
    speakers: ['speaker', 'speakers'],
    scripture: ['passage', 'passages'],
  }

  const count = shownCounts[tab]
  const total = totals[tab]
  const [one, many] = noun[tab]
  const isEmpty = count === 0

  /* Left/right arrows move between tabs, which is what the tablist role
     promises. Without it the role is a lie to anyone on a keyboard. */
  function onTabKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const i = TABS.findIndex((t) => t.key === tab)
    const next = e.key === 'ArrowRight' ? (i + 1) % TABS.length : (i - 1 + TABS.length) % TABS.length
    setTab(TABS[next].key)
    const buttons = tablistRef.current?.querySelectorAll('button')
    buttons?.[next]?.focus()
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
            Every message, sorted four ways. Pick a lens, or search across all of them.
          </p>
        </div>

        {/* Controls */}
        <div
          className={`mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${revealBase} ${shown ? revealShown : revealHidden}`}
          style={{ transitionDelay: '100ms' }}
        >
          {/* Segmented control — was four bare text links with a hairline
              underline; at 12px on white they barely registered as controls. */}
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Browse the media library by"
            onKeyDown={onTabKeyDown}
            className="inline-flex flex-wrap gap-1 rounded-full border border-black/10 bg-white p-1"
          >
            {TABS.map((t) => {
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
              placeholder="Search the library"
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

        {/* Result count — silence here was the reason a filter felt broken. */}
        <p
          aria-live="polite"
          className={`mt-6 text-xs font-bold tracking-[0.12em] text-black/45 uppercase ${revealBase} ${shown ? revealShown : revealHidden}`}
          style={{ transitionDelay: '140ms' }}
        >
          {/* In the "X of Y" form the noun agrees with Y, not X — "1 of 7
              topic" is wrong, "1 of 7 topics" is right. */}
          {q
            ? `${count} of ${total} ${total === 1 ? one : many}`
            : `${total} ${total === 1 ? one : many}`}
        </p>

        <div
          className={`mt-6 ${revealBase} ${shown ? revealShown : revealHidden}`}
          style={{ transitionDelay: '180ms' }}
        >
          {isEmpty ? (
            <EmptyState query={query} noun={many} onClear={() => setQuery('')} />
          ) : (
            <>
              {tab === 'series' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSeries.map((s, i) => (
                    <SeriesCard
                      key={s.slug}
                      slug={s.slug}
                      title={s.title}
                      isPlaceholder={s.isPlaceholder}
                      count={seriesCount(s.slug)}
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
                    count: topicCount(t.slug),
                  }))}
                  basePath="/media/browse/topic"
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
                />
              )}

              {tab === 'scripture' && (
                <TermList
                  items={filteredScripture.map((s) => ({
                    slug: s.slug,
                    title: s.title,
                    isPlaceholder: s.isPlaceholder,
                    count: scriptureCount(s.slug),
                  }))}
                  basePath="/media/browse/scripture"
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
  query,
  noun,
  onClear,
}: {
  query: string
  noun: string
  onClear: () => void
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
      <p className="mt-4 font-heading text-lg font-bold">No {noun} match “{query}”</p>
      <p className="mt-1 max-w-[38ch] text-sm text-black/50">
        Try a shorter word, or clear the search to see everything in this tab.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        style={{ backgroundColor: TEAL }}
      >
        Clear search
      </button>
    </div>
  )
}

function SeriesCard({
  slug,
  title,
  count,
  isPlaceholder,
  index,
}: {
  slug: string
  title: string
  count: number
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

  const cover = seriesCardThumbnail(slug)

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

      {/* Count as a badge rather than a grey sub-line — it is the one piece
          of data that tells you whether the series is worth opening. */}
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
 * Terms were thin text rows on hairline borders — legible, but the palest
 * thing on an already-pale plate, and a 3px-tall hover target's worth of
 * affordance. They are cards now: white on the grey ground, teal count
 * badge, whole row tappable.
 */
function TermList({
  items,
  basePath,
}: {
  items: { slug: string; title: string; count: number; isPlaceholder?: boolean }[]
  basePath: string
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
              to={`${basePath}/${item.slug}`}
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
