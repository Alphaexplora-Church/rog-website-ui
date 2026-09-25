import { useQuery } from '@tanstack/react-query'
import { fetchMediaLibrary, MEDIA_LIBRARY_QUERY_KEY } from '../../../shared/models/api/mediaApi'

/** How many messages the home teaser shows — a taste, not the shelf. */
const TEASER_COUNT = 3

/**
 * Home — "Watch or Listen" ViewModel.
 *
 * Its own ViewModel per Doc 4 ("each feature gets its own ViewModel, even if
 * two features fetch the same data"), but the same query key as the Media
 * feature's, so TanStack Query serves both from one request.
 *
 * The three newest Sermons-category messages — Strapi returns messages
 * newest-first by their required date, so "latest" is now a real claim.
 */
export function useWatchOrListenViewModel() {
  const { data, isLoading, error } = useQuery({
    queryKey: MEDIA_LIBRARY_QUERY_KEY,
    queryFn: fetchMediaLibrary,
    staleTime: 60 * 1000,
  })

  const teasers = (data?.sermons ?? []).filter((s) => s.category === 'sermon').slice(0, TEASER_COUNT)

  return { teasers, isLoading, error }
}
