import { Link } from 'react-router-dom'
import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'

/**
 * The loading / error page for the Media detail routes (series, browse,
 * watch). Those pages look a record up by slug, and before the library has
 * arrived every lookup misses — so without this they would flash "not
 * found" on every visit before the real page appeared.
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
    <section data-plate="dark" className="bg-black text-white">
      <div className="mx-auto max-w-[86rem] px-6 pt-32 pb-24 sm:pt-40">
        <Link to={backTo} className="text-xs font-bold tracking-[0.15em] text-[#8FD4C9] uppercase">
          ← Media Library
        </Link>
        <div className="mt-8">
          {error ? <ErrorBlock tone="dark" error={error} onRetry={onRetry} /> : <LoadingBlock tone="dark" />}
        </div>
      </div>
    </section>
  )
}
