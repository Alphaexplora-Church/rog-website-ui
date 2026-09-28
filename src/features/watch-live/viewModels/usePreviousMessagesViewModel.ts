import { useQuery } from '@tanstack/react-query'
import { fetchMediaLibrary, MEDIA_LIBRARY_QUERY_KEY } from '../../../shared/models/api/mediaApi'

/** Enough to scroll through, not the whole archive — that's the Media tab. */
const LIST_COUNT = 6

/**
 * Watch Live — "Previous Messages" ViewModel. Same query key as the Media
 * feature, so it shares one cached request (see useWatchOrListenViewModel).
 *
 * The newest Sermons-category messages — the Sunday and Midweek services
 * this page's livestream produces.
 */
export function usePreviousMessagesViewModel() {
  const { data, isLoading, error } = useQuery({
    queryKey: MEDIA_LIBRARY_QUERY_KEY,
    queryFn: fetchMediaLibrary,
    staleTime: 60 * 1000,
  })

  const sermons = (data?.sermons ?? []).filter((s) => s.category === 'sermon').slice(0, LIST_COUNT)

  return { sermons, isLoading, error }
}
