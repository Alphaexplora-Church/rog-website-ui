import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { ErrorBlock } from '../../../shared/components/ui/LoadState'
import { Reveal, WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { CATEGORY_FILTERS, categoryLabel, sermonThumbnail, type Sermon } from '../data/mediaData'
import { FACETS, useMediaBrowseViewModel } from '../viewModels/useMediaBrowseViewModel'
import { FilterMenu } from './FilterMenu'
import { Cover, MetaLine, PlayGlyph } from './MediaParts'
import { markCover } from './mediaViewHelpers'
import { MediaRail, MessageCard, RAIL_CARD, RAIL_POSTER, RailSkeleton, SeriesPoster } from './MediaRail'

/**
 * Media, section 2 — the library, rebuilt Netflix-style (2026-09-27).
 *
 * Jude: "make it like the UI of Netflix … it still matches the theme and
 * the identity of our revamped website. Para lang maayos yung filtering."
 *
 * What was borrowed from Netflix, and how it was made ROG's:
 *   - ROWS of side-scrolling shelves under a billboard. The first row rides
 *     up over the hero's fade (Media.tsx), the next card always peeks at the
 *     right edge, desktop gets paging arrows on hover. Titles are shout
 *     caps, cards are hard-edged River duotone with Colour Bloom, and the
 *     hover cue is an ember "current" line filling along the bottom.
 *   - A FILTER BAR modelled on Netflix's chip nav: category pills (All /
 *     Series / Sermons, the active one filled bone like "My Netflix"),
 *     facet dropdowns (Topic ▾ Speaker ▾ Scripture ▾ — like "Genres ▾"),
 *     search, and a rows/grid toggle. It's a glass pill like the Navbar and
 *     sticks under it while you scroll the rows.
 *   - Filtering switches the page from rows to a RESULTS GRID, newest
 *     first, with removable chips for every active filter and a live count.
 *     Menus are faceted (see useMediaBrowseViewModel) so they never offer
 *     an option that leads to zero results.
 *
 * `id="media-library"` stays — the hero's "Browse the library" and
 * ScrollToTop's hash handling point at it. The drill-down pages
 * (/media/series/…, /media/browse/…, /media/watch/…) are unchanged; each
 * row's "See all" goes to them.
 */
export function MediaLibrarySection() {
  const vm = useMediaBrowseViewModel()
  const sectionRef = useRef<HTMLElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const [searchOpen, setSearchOpen] = useState(() => Boolean(vm.query))
  const scoped = vm.category !== 'all'

  /* When the filters change while the user is deep in the rows, bring the
     top of the results back into view — otherwise a filter chosen from the
     sticky bar changes content they can't see. */
  const filterKey = `${vm.category}|${vm.selected.topic}|${vm.selected.speaker}|${vm.selected.scripture}|${vm.mode}`
  const lastKey = useRef(filterKey)
  useEffect(() => {
    if (lastKey.current === filterKey) return
    lastKey.current = filterKey
    const el = sectionRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 24
    if (window.scrollY > top) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    }
  }, [filterKey])

  function onCategoryKey(e: KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const n = CATEGORY_FILTERS.length
    const i = CATEGORY_FILTERS.findIndex((c) => c.key === vm.category)
    const next = e.key === 'ArrowRight' ? (i + 1) % n : (i - 1 + n) % n
    vm.setCategory(CATEGORY_FILTERS[next].key)
    categoryRef.current?.querySelectorAll('button')[next]?.focus()
  }

  const searchInput = (
    <div className="relative w-full">
      <SearchGlyph className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-bone/50" />
      <input
        type="search"
        value={vm.query}
        onChange={(e) => vm.setQuery(e.target.value)}
        placeholder={scoped ? `Search ${categoryLabel(vm.category)}` : 'Titles, speakers, topics'}
        aria-label="Search messages"
        className="h-10 w-full rounded-full border border-bone/20 bg-bone/[0.06] pr-10 pl-10 text-[0.9rem] text-bone transition-[border-color,background-color] duration-300 ease-current placeholder:text-bone/45 hover:border-bone/40 focus:border-bone/70 focus:bg-bone/[0.1] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {vm.query && (
        <button
          type="button"
          onClick={() => vm.setQuery('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
        >
          <CloseGlyph />
        </button>
      )}
    </div>
  )

  return (
    <section
      ref={sectionRef}
      id="media-library"
      data-plate="dark"
      aria-labelledby="media-library-heading"
      className="relative z-10 scroll-mt-24 bg-abyss pt-[4.6rem] pb-24 text-bone sm:-mt-40 sm:bg-transparent sm:bg-[linear-gradient(to_bottom,transparent,var(--color-abyss)_8rem)] sm:pt-0 sm:pb-36"
    >
      {/* Phones hide MediaHero (the billboard moves below the chips, Netflix-
          style), so the page's h1 moves here for them. Only one is ever shown. */}
      <h1 className="sr-only sm:hidden">Media</h1>
      <h2 id="media-library-heading" className="sr-only">
        Media Library
      </h2>

      {/* ── Filter bar (sticky) ─────────────────────────────────────────── */}
      <div className="sticky top-[4.6rem] z-30 max-sm:bg-abyss/92 max-sm:py-2 max-sm:backdrop-blur-xl sm:top-[5.6rem]">
        <div className={container}>
          <div className="flex items-center gap-2 rounded-full border-bone/12 sm:border sm:bg-abyss/90 sm:p-1.5 sm:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.9)] sm:backdrop-blur-xl sm:backdrop-saturate-150">
            <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pr-6 max-md:[mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] md:pr-0">
              <div
                ref={categoryRef}
                role="radiogroup"
                aria-label="Category"
                onKeyDown={onCategoryKey}
                className="flex flex-none items-center gap-2 sm:gap-1"
              >
                {CATEGORY_FILTERS.map((c) => {
                  const on = vm.category === c.key
                  return (
                    <button
                      key={c.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => vm.setCategory(c.key)}
                      className={`h-9 rounded-full border px-4 text-[0.8rem] font-semibold whitespace-nowrap transition-[background-color,border-color,color] duration-300 ease-current sm:h-10 sm:border-transparent sm:px-5 sm:text-[0.85rem] ${
                        on ? 'border-bone bg-bone text-abyss' : 'border-bone/25 text-bone/80 hover:bg-bone/[0.08] hover:text-bone'
                      }`}
                    >
                      {c.label}
                    </button>
                  )
                })}
              </div>

              <span aria-hidden="true" className="h-6 w-px flex-none bg-bone/15 sm:mx-1" />

              {FACETS.map((f) => (
                <FilterMenu
                  key={f.key}
                  label={f.label}
                  plural={f.plural}
                  options={vm.facetOptions[f.key]}
                  selected={vm.selected[f.key]}
                  selectedLabel={vm.selectedLabel(f.key)}
                  onSelect={(slug) => vm.setFacet(f.key, slug)}
                />
              ))}
            </div>

            {/* Search: inline on desktop, a toggle on phones */}
            <div className="hidden w-64 flex-none md:block">{searchInput}</div>
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label={searchOpen ? 'Hide search' : 'Search messages'}
              aria-expanded={searchOpen}
              className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10 md:hidden ${
                searchOpen || vm.query ? 'border-bone/60 bg-bone/10 text-bone' : 'border-bone/20 text-bone/80'
              }`}
            >
              <SearchGlyph className="h-4 w-4" />
            </button>

            {/* Hidden (not removed) while filtering — results are always a grid — so the bar doesn't shift. */}
            {(
              <div role="group" aria-label="Layout" aria-hidden={vm.filtering || undefined} className={`hidden flex-none items-center rounded-full border border-bone/15 p-0.5 sm:flex ${vm.filtering ? 'invisible' : ''}`}>
                {(['rows', 'grid'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={vm.view === v}
                    aria-label={v === 'rows' ? 'Show as rows' : 'Show every message as a grid'}
                    onClick={() => vm.setView(v)}
                    className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors duration-300 ${
                      vm.view === v ? 'bg-bone text-abyss' : 'text-bone/65 hover:text-bone'
                    }`}
                  >
                    {v === 'rows' ? <RowsGlyph /> : <GridGlyph />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchOpen && <div className="mt-2 md:hidden">{searchInput}</div>}
        </div>
      </div>

      {/* ── Active filters + count ──────────────────────────────────────── */}
      <div className={`${container} mt-3 flex min-h-8 flex-wrap items-center gap-2 sm:mt-6 ${vm.mode === 'rows' ? 'max-sm:hidden' : ''}`}>
        <p aria-live="polite" className="mr-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-bone/55 sm:text-[0.72rem] sm:tracking-[0.22em]">
          {vm.isLoading || vm.error
            ? ' '
            : vm.mode === 'grid'
              ? `${vm.results.length} ${vm.results.length === 1 ? 'message' : 'messages'}${scoped ? ` in ${categoryLabel(vm.category)}` : ''}`
              : `${vm.pool.length} ${vm.pool.length === 1 ? 'message' : 'messages'}${scoped ? ` in ${categoryLabel(vm.category)}` : ''}`}
        </p>
        {vm.chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => vm.clearChip(c.key)}
            aria-label={`Remove filter ${c.label}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ember/60 bg-ember/10 pr-2 pl-3.5 text-[0.8rem] font-medium italic text-bone transition-colors hover:border-ember hover:bg-ember hover:text-abyss"
          >
            {c.label}
            <CloseGlyph className="h-3.5 w-3.5" />
          </button>
        ))}
        {vm.chips.length > 1 && (
          <button
            type="button"
            onClick={vm.clearAll}
            className="ml-1 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-bone/60 underline-offset-4 transition-colors hover:text-ember hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="mt-4 sm:mt-8">
        {vm.isLoading ? (
          <RailSkeleton />
        ) : vm.error ? (
          <div className={container}>
            <ErrorBlock tone="dark" error={vm.error} onRetry={vm.retry} />
          </div>
        ) : vm.mode === 'rows' ? (
          vm.rows.length === 0 ? (
            <div className={container}>
              <Empty
                title={scoped ? `Nothing in ${categoryLabel(vm.category)} yet` : 'No messages yet'}
                body="This fills in on its own as messages are published."
                action={scoped ? 'Show all categories' : undefined}
                onAction={scoped ? () => vm.setCategory('all') : undefined}
              />
            </div>
          ) : (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-8 sm:gap-16">
              {vm.featured && <MobileBillboard s={vm.featured} tags={vm.featuredTags} />}
              {vm.rows.map((row, i) => (
                <Reveal key={row.key} delay={i < 3 ? i * 60 : 0}>
                  {row.kind === 'series' ? (
                    <MediaRail id={`rail-${row.key}`} eyebrow={row.eyebrow} title={row.title} count={row.series.length}>
                      {row.series.map((s) => (
                        <SeriesPoster key={s.slug} card={s} className={RAIL_POSTER} />
                      ))}
                    </MediaRail>
                  ) : (
                    <MediaRail id={`rail-${row.key}`} eyebrow={row.eyebrow} title={row.title} seeAll={row.seeAll}>
                      {row.items.map((s) => (
                        <MessageCard
                          key={s.slug}
                          s={s}
                          isNew={s.slug === vm.newestSlug}
                          showCategory={!scoped && row.key === 'latest'}
                          className={RAIL_CARD}
                        />
                      ))}
                    </MediaRail>
                  )}
                </Reveal>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-14">
            {vm.matchingSeries.length > 0 && (
              <MediaRail id="rail-matching-series" eyebrow="Series" title="Matching series" count={vm.matchingSeries.length}>
                {vm.matchingSeries.map((s) => (
                  <SeriesPoster key={s.slug} card={s} className={RAIL_POSTER} />
                ))}
              </MediaRail>
            )}
            <div className={container}>
              {vm.results.length === 0 ? (
                <Empty
                  title={vm.query.trim() ? `Nothing matches “${vm.query.trim()}”` : 'No messages match these filters'}
                  body="Try removing a filter, or a shorter search word."
                  action="Clear filters"
                  onAction={vm.clearAll}
                />
              ) : (
                <ResultsGrid
                  key={`${filterKey}|${vm.query}`}
                  items={vm.results}
                  newestSlug={vm.newestSlug}
                  showCategory={!scoped}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Phones only (2026-09-27, Jude: "sa mobile view … parang ganito", Netflix
 * app): the billboard as a CARD under the category chips — newest message in
 * the current category, title centred, a "Sermon • Hope • Restoration" tag
 * line, one full-width Watch Now (no "My List" — there are no accounts).
 * The card is filled by the thumbnail blown up and blurred, with the real
 * 16:9 thumbnail on top, so sermon art is never cropped to a portrait.
 */
function MobileBillboard({ s, tags }: { s: Sermon; tags: string[] }) {
  const thumb = sermonThumbnail(s)
  const to = `/media/watch/${s.slug}`
  return (
    <div className={`${container} sm:hidden`}>
      <article className="grain relative isolate overflow-hidden border border-bone/12 bg-abyss-2">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img src={thumb} alt="" className="h-full w-full scale-150 object-cover opacity-55 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-river/25 via-abyss/45 to-abyss" />
        </div>
        <Link to={to} viewTransition onClick={(e) => markCover(e, s.slug)} className="block" tabIndex={-1} aria-hidden="true">
          <Cover src={thumb} title={s.title} bloom="always" priority className="aspect-video w-full" />
        </Link>
        <div className="px-5 pt-5 pb-5 text-center">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-shallows">Latest message</p>
          <h2 className="mt-2 text-balance font-shout text-[2.1rem] font-extrabold uppercase leading-[0.9]">{s.title}</h2>
          {tags.length > 0 && (
            <p className="mt-3 text-[0.78rem] text-bone/75">
              {tags.map((t, i) => (
                <span key={t}>
                  {i > 0 && <span aria-hidden="true" className="px-1.5 text-bone/40">•</span>}
                  <span className={i === 0 ? 'font-semibold text-bone' : undefined}>{t}</span>
                </span>
              ))}
            </p>
          )}
          <MetaLine s={s} className="mt-1 text-[0.7rem] text-sand" />
          <Button to={to} variant="ember" className="mt-5 w-full">
            <span className="flex items-center gap-2">
              <PlayGlyph className="h-4 w-4" />
              Watch Now
            </span>
          </Button>
        </div>
      </article>
    </div>
  )
}

/** The results grid, 48 at a time. Keyed by the filters in the parent, so a
 *  new filter starts again from the first page without an effect. */
const PAGE = 48
function ResultsGrid({ items, newestSlug, showCategory }: { items: Sermon[]; newestSlug?: string; showCategory: boolean }) {
  const [limit, setLimit] = useState(PAGE)
  const left = items.length - limit
  return (
    <>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {items.slice(0, limit).map((s) => (
          <MessageCard key={s.slug} s={s} isNew={s.slug === newestSlug} showCategory={showCategory} />
        ))}
      </ul>
      {left > 0 && (
        <div className="mt-14 flex flex-col items-center gap-3">
          <Button onClick={() => setLimit((l) => l + PAGE)} variant="outline" size="lg">
            Show more
          </Button>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-bone/50">
            Showing {limit} of {items.length}
          </p>
        </div>
      )}
    </>
  )
}

function Empty({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <div className="border border-dashed border-bone/20 px-6 py-16 text-center sm:py-20">
      <WaveMark className="mx-auto h-6 w-16 text-shallows" strokeWidth={6} />
      <p className="mx-auto mt-6 max-w-[22ch] text-balance font-shout text-[clamp(1.9rem,4vw,3rem)] font-extrabold uppercase leading-[0.92]">
        {title}
      </p>
      <p className="mx-auto mt-4 max-w-[40ch] font-whisper text-lg italic text-bone/70">{body}</p>
      {action && onAction && (
        <div className="mt-8">
          <Button onClick={onAction} variant="solid">
            {action}
          </Button>
        </div>
      )}
    </div>
  )
}

/* ── Glyphs ───────────────────────────────────────────────────────────── */

function SearchGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13.5 13.5L17 17" />
    </svg>
  )
}

function CloseGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
    </svg>
  )
}

function RowsGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="3.5" width="4.5" height="4.5" />
      <rect x="8.5" y="3.5" width="4.5" height="4.5" />
      <path d="M14.5 3.5h3v4.5h-3" />
      <rect x="2.5" y="12" width="4.5" height="4.5" />
      <rect x="8.5" y="12" width="4.5" height="4.5" />
      <path d="M14.5 12h3v4.5h-3" />
    </svg>
  )
}

function GridGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="2.5" width="6.5" height="6.5" />
      <rect x="11" y="2.5" width="6.5" height="6.5" />
      <rect x="2.5" y="11" width="6.5" height="6.5" />
      <rect x="11" y="11" width="6.5" height="6.5" />
    </svg>
  )
}
