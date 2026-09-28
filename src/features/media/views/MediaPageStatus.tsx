import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import { WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { BackLink } from './MediaParts'

/**
 * The loading / error page for the Media detail routes (series, browse,
 * watch). Those pages look a record up by slug, and before the library has
 * arrived every lookup misses — so without this they would flash "not
 * found" on every visit before the real page appeared.
 *
 * REVAMP 2026-09-25: abyss ground with a slow-drawing wave mark while it
 * waits, a shout placeholder bar where the title will land, then the shared
 * shimmer or the retry block.
 */
export function MediaPageStatus({
  error,
  onRetry,
  backTo = '/media',
}: {
  error?: unknown
  onRetry?: () => void
  backTo?: string
}) {
  return (
    <section data-plate="dark" aria-busy={!error} className="relative isolate min-h-[80svh] overflow-hidden bg-abyss text-bone">
      <WaveMark
        draw={!error}
        className="absolute -right-[8%] top-[12%] -z-10 h-auto w-[70vw] max-w-[1000px] text-bone/[0.05]"
        strokeWidth={3}
      />
      <div className={`${container} pt-36 pb-24`}>
        <BackLink to={backTo} />
        {!error && (
          <div aria-hidden="true" className="mt-10 motion-safe:animate-pulse">
            <div className="h-[clamp(3rem,8vw,7rem)] w-3/4 max-w-[46rem] bg-bone/[0.06]" />
            <div className="mt-4 h-4 w-48 rounded-full bg-bone/[0.06]" />
          </div>
        )}
        <div className="mt-12">
          {error ? <ErrorBlock tone="dark" error={error} onRetry={onRetry} /> : <LoadingBlock tone="dark" />}
        </div>
      </div>
    </section>
  )
}
