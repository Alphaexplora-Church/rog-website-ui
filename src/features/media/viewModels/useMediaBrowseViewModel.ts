import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categoryQuery, parseCategory, type CategoryFilter, type Sermon } from '../data/mediaData'
import { useMediaLibraryViewModel } from './useMediaLibraryViewModel'

/**
 * Media browse ViewModel — everything the Netflix-style `/media` page needs
 * to render its rows, its filter bar and its results grid (2026-09-27, Jude:
 * "make it like the UI of Netflix … para lang maayos yung filtering").
 *
 * ── STATE (all of it in the URL, so a filtered view can be shared) ────────
 *   ?category=series|sermon   the pool (All when absent)
 *   ?topic= ?speaker= ?scripture=   one term per facet, ANDed together
 *   ?q=                       free-text search
 *   ?view=grid                show every message as a grid instead of rows
 * The URL is written with history.replaceState, not setSearchParams — a
 * router `replace` flips the navigation type and ScrollToTop would throw the
 * page back to the top on every click (same reason as the old library).
 *
 * ── HOW FILTERING WORKS ───────────────────────────────────────────────────
 * Category picks the pool. Each facet menu is FACETED: its options and
 * counts are computed from the pool with every OTHER active filter applied,
 * and terms with nothing left are dropped — so a menu never offers a dead
 * end ("Hope (0)"). Search matches title, speaker, topic, series and
 * scripture names.
 *
 * ── ROWS vs GRID ──────────────────────────────────────────────────────────
 * No filter and no search → Netflix rows (Latest, the Series shelf, then one
 * row per top topic, speaker and passage — no row per series). Any filter or search → a results grid, newest
 * first, because a row you have to side-scroll is the wrong shape for
 * "show me exactly these". `?view=grid` gives the same grid unfiltered.
 */

export type Facet = 'topic' | 'speaker' | 'scripture'
export type BrowseView = 'rows' | 'grid'

export interface FacetOption {
  slug: string
  label: string
  count: number
}

export interface SeriesCard {
  slug: string
  title: string
  count: number
  cover?: string
  isPlaceholder?: boolean
}

export type BrowseRow =
  | { kind: 'messages'; key: string; eyebrow: string; title: string; items: Sermon[]; seeAll?: string }
  | { kind: 'series'; key: string; eyebrow: string; title: string; series: SeriesCard[] }

interface BrowseState {
  category: CategoryFilter
  topic?: string
  speaker?: string
  scripture?: string
  q: string
  view: BrowseView
}

export const FACETS: { key: Facet; label: string; plural: string }[] = [
  { key: 'topic', label: 'Topic', plural: 'Topics' },
  { key: 'speaker', label: 'Speaker', plural: 'Speakers' },
  { key: 'scripture', label: 'Scripture', plural: 'Scripture' },
]

function readState(p: URLSearchParams): BrowseState {
  return {
    category: parseCategory(p.get('category')),
    topic: p.get('topic') || undefined,
    speaker: p.get('speaker') || undefined,
    scripture: p.get('scripture') || undefined,
    q: p.get('q') ?? '',
    view: p.get('view') === 'grid' ? 'grid' : 'rows',
  }
}

function writeUrl(s: BrowseState) {
  const url = new URL(window.location.href)
  const set = (k: string, v?: string) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k))
  set('category', s.category === 'all' ? undefined : s.category)
  set('topic', s.topic)
  set('speaker', s.speaker)
  set('scripture', s.scripture)
  set('q', s.q.trim() || undefined)
  set('view', s.view === 'grid' ? 'grid' : undefined)
  window.history.replaceState(window.history.state, '', url)
}

/** Newest first by `isoDate`; undated (sample) messages keep their order at the end. */
function newestFirst(list: Sermon[]): Sermon[] {
  return list
    .map((s, i) => ({ s, i }))
    .sort((a, b) => {
      const da = a.s.isoDate ?? ''
      const db = b.s.isoDate ?? ''
      if (da !== db) return da < db ? 1 : -1
      return a.i - b.i
    })
    .map((x) => x.s)
}

const ROW_LIMIT = 16
/* How many rows each kind of term gets, most-used first. Seen with 300
   dummy uploads (2026-09-27): one row per term made 62 rows and a page
   ~26,000px tall. Everything past these caps is still one click away in the
   filter bar's menus, and every row's "See all" opens the full list. */
const ROW_CAPS = { topic: 6, speaker: 4, scripture: 4 }

export function useMediaBrowseViewModel() {
  const { media, isLoading, error, retry } = useMediaLibraryViewModel()
  const [params] = useSearchParams()
  const [state, setState] = useState<BrowseState>(() => readState(params))

  /* Write the URL after the first render only — the initial state came FROM it. */
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    writeUrl(state)
  }, [state])

  const update = useCallback((patch: Partial<BrowseState>) => setState((s) => ({ ...s, ...patch })), [])

  const derived = useMemo(() => {
    const { category, topic, speaker, scripture } = state
    const q = state.q.trim().toLowerCase()
    const pool = newestFirst(media.sermonsInCategory(category))

    const matchesQ = (s: Sermon) => {
      if (!q) return true
      const hay = [
        s.title,
        s.speakerName,
        s.seriesSlug ? media.findSeries(s.seriesSlug)?.title : undefined,
        s.scriptureSlug ? media.findScripture(s.scriptureSlug)?.title : undefined,
        ...s.topicSlugs.map((t) => media.findTopic(t)?.title),
      ]
      return hay.some((h) => h?.toLowerCase().includes(q))
    }

    /** Every active filter except `skip` — the basis for faceted counts. */
    const passes = (s: Sermon, skip?: Facet) =>
      (skip === 'topic' || !topic || s.topicSlugs.includes(topic)) &&
      (skip === 'speaker' || !speaker || s.speakerSlug === speaker) &&
      (skip === 'scripture' || !scripture || s.scriptureSlug === scripture) &&
      matchesQ(s)

    const byCount = (a: FacetOption, b: FacetOption) => b.count - a.count || a.label.localeCompare(b.label)

    const facetOptions: Record<Facet, FacetOption[]> = {
      topic: media.topics
        .map((t) => ({
          slug: t.slug,
          label: t.title,
          count: pool.filter((s) => passes(s, 'topic') && s.topicSlugs.includes(t.slug)).length,
        }))
        .filter((o) => o.count > 0 || o.slug === topic)
        .sort(byCount),
      speaker: media
        .speakerSummaries(pool.filter((s) => passes(s, 'speaker')))
        .map((sp) => ({ slug: sp.slug, label: sp.name, count: sp.count }))
        .sort(byCount),
      scripture: media.scripture
        .map((sc) => ({
          slug: sc.slug,
          label: sc.title,
          count: pool.filter((s) => passes(s, 'scripture') && s.scriptureSlug === sc.slug).length,
        }))
        .filter((o) => o.count > 0 || o.slug === scripture)
        .sort(byCount),
    }
    /* A speaker picked from a link but absent from the pool still needs a label. */
    if (speaker && !facetOptions.speaker.some((o) => o.slug === speaker)) {
      const name = media.sermons.find((s) => s.speakerSlug === speaker)?.speakerName
      if (name) facetOptions.speaker.unshift({ slug: speaker, label: name, count: 0 })
    }

    const labelFor = (f: Facet, slug?: string) =>
      slug ? (facetOptions[f].find((o) => o.slug === slug)?.label ?? slug) : undefined

    const filtering = Boolean(topic || speaker || scripture || q)
    const mode: BrowseView = filtering || state.view === 'grid' ? 'grid' : 'rows'
    const results = pool.filter((s) => passes(s))

    const seriesCard = (slug: string, title: string, isPlaceholder?: boolean): SeriesCard => ({
      slug,
      title,
      isPlaceholder,
      count: media.seriesCount(slug),
      cover: media.seriesCardThumbnail(slug),
    })
    const matchingSeries =
      q && category !== 'sermon'
        ? media.series.filter((s) => s.title.toLowerCase().includes(q)).map((s) => seriesCard(s.slug, s.title, s.isPlaceholder))
        : []

    /* ── Rows ─────────────────────────────────────────────────────────── */
    const rows: BrowseRow[] = []
    const qs = categoryQuery(category)
    if (mode === 'rows') {
      if (pool.length) {
        rows.push({ kind: 'messages', key: 'latest', eyebrow: 'Just added', title: 'Latest Messages', items: pool.slice(0, ROW_LIMIT) })
      }
      const shelf = media.seriesInCategory(category)
      if (shelf.length) {
        rows.push({
          kind: 'series',
          key: 'series-shelf',
          eyebrow: 'Watch in order',
          title: 'Series',
          series: shelf.map((s) => seriesCard(s.slug, s.title, s.isPlaceholder)),
        })
      }
      /* No row per series (Jude 2026-09-27: "masyado nang redundant") —
         the Series shelf above is the way into each series; its poster
         opens the series page with every episode in order. */
      for (const t of facetOptions.topic.slice(0, ROW_CAPS.topic)) {
        const items = pool.filter((m) => m.topicSlugs.includes(t.slug))
        if (items.length) rows.push({ kind: 'messages', key: `topic-${t.slug}`, eyebrow: 'Topic', title: t.label, items: items.slice(0, ROW_LIMIT), seeAll: `/media/browse/topic/${t.slug}${qs}` })
      }
      for (const sp of facetOptions.speaker.slice(0, ROW_CAPS.speaker)) {
        const items = pool.filter((m) => m.speakerSlug === sp.slug)
        if (items.length) rows.push({ kind: 'messages', key: `speaker-${sp.slug}`, eyebrow: 'Messages by', title: sp.label, items: items.slice(0, ROW_LIMIT), seeAll: `/media/browse/speaker/${sp.slug}${qs}` })
      }
      for (const sc of facetOptions.scripture.slice(0, ROW_CAPS.scripture)) {
        const items = pool.filter((m) => m.scriptureSlug === sc.slug)
        if (items.length) rows.push({ kind: 'messages', key: `scripture-${sc.slug}`, eyebrow: 'Through the Word', title: sc.label, items: items.slice(0, ROW_LIMIT), seeAll: `/media/browse/scripture/${sc.slug}${qs}` })
      }
    }
    /* Drop a row that shows exactly what an earlier row already shows
       (e.g. a church with one speaker would otherwise repeat "Latest"). */
    const seen = new Set<string>()
    const uniqueRows = rows.filter((r) => {
      if (r.kind !== 'messages') return true
      const sig = r.items.map((i) => i.slug).join('|')
      if (seen.has(sig)) return false
      seen.add(sig)
      return true
    })

    const chips = [
      ...FACETS.filter((f) => state[f.key]).map((f) => ({
        key: f.key as Facet | 'q',
        label: `${f.label}: ${labelFor(f.key, state[f.key])}`,
      })),
      ...(q ? [{ key: 'q' as const, label: `“${state.q.trim()}”` }] : []),
    ]

    return {
      pool,
      results,
      rows: uniqueRows,
      matchingSeries,
      facetOptions,
      chips,
      filtering,
      mode,
      newestSlug: pool.find((s) => s.isoDate)?.slug,
      /* The mobile billboard: the newest message in the current category,
         with Netflix-style tags ("Sermon • Hope • Restoration"). */
      featured: pool[0],
      featuredTags: pool[0]
        ? [
            pool[0].category === 'series'
              ? (media.findSeries(pool[0].seriesSlug ?? '')?.title ?? 'Series')
              : 'Sermon',
            ...pool[0].topicSlugs.map((t) => media.findTopic(t)?.title).filter((t): t is string => Boolean(t)),
          ].slice(0, 3)
        : [],
      selectedLabel: (f: Facet) => labelFor(f, state[f]),
    }
  }, [media, state])

  return {
    isLoading,
    error,
    retry,
    category: state.category,
    query: state.q,
    view: state.view,
    selected: { topic: state.topic, speaker: state.speaker, scripture: state.scripture } as Record<Facet, string | undefined>,
    ...derived,
    setCategory: (category: CategoryFilter) => update({ category }),
    setFacet: (facet: Facet, slug?: string) => update({ [facet]: slug } as Partial<BrowseState>),
    setQuery: (q: string) => update({ q }),
    setView: (view: BrowseView) => update({ view }),
    clearChip: (key: Facet | 'q') => update(key === 'q' ? { q: '' } : ({ [key]: undefined } as Partial<BrowseState>)),
    clearAll: () => update({ topic: undefined, speaker: undefined, scripture: undefined, q: '' }),
  }
}
