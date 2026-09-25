/**
 * Loading and error blocks for CMS-backed sections.
 *
 * Before 2026-09-23 every section rendered from bundled data, so neither
 * state existed. Now data arrives over the network, and both need a face:
 *
 *   loading → a quiet shimmer in the shape of the content, so the section
 *             doesn't collapse and then jump when the data lands
 *   error   → says the content couldn't be loaded and offers a retry.
 *             The technical reason (CMS not running, 403 permissions…) goes
 *             to the console, where the person who can fix it will look —
 *             a visitor gets a sentence, not a stack trace.
 *
 * `tone` matches the plate the block sits on (dark sections vs the light
 * Media Library ground). `label` names what's loading/failed — "Messages",
 * "Events", etc — defaulting to "Messages" (this block's first caller)
 * so every call site from before the Events wiring (2026-09-24) keeps
 * reading exactly as it did.
 */

type Tone = 'dark' | 'light'

export function LoadingBlock({
  tone = 'dark',
  rows = 3,
  label = 'Messages',
}: {
  tone?: Tone
  rows?: number
  label?: string
}) {
  const tile = tone === 'dark' ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
  return (
    <div role="status" aria-live="polite" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Loading {label.toLowerCase()}…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} aria-hidden="true" className="motion-safe:animate-pulse">
          <div className={`aspect-video w-full rounded-2xl ${tile}`} />
          <div className={`mt-4 h-4 w-3/4 rounded-full ${tile}`} />
          <div className={`mt-2 h-3 w-1/2 rounded-full ${tile}`} />
        </div>
      ))}
    </div>
  )
}

export function ErrorBlock({
  tone = 'dark',
  error,
  onRetry,
  label = 'Messages',
}: {
  tone?: Tone
  error?: unknown
  onRetry?: () => void
  label?: string
}) {
  if (error) console.error('[CMS]', error instanceof Error ? error.message : error)

  const dark = tone === 'dark'
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-14 text-center ${
        dark ? 'border-white/15 bg-white/[0.02]' : 'border-black/15 bg-white'
      }`}
    >
      <p className={`font-heading text-lg font-bold ${dark ? 'text-white' : 'text-[#0B0F14]'}`}>
        {label} couldn’t be loaded right now
      </p>
      <p className={`mt-1 max-w-[40ch] text-sm ${dark ? 'text-white/55' : 'text-black/50'}`}>
        Please try again in a moment.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-[#1b7a70] px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#166059] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          Try again
        </button>
      )}
    </div>
  )
}
