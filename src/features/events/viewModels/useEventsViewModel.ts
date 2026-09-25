import { useQuery } from '@tanstack/react-query'
import { EVENTS_QUERY_KEY, fetchEvents } from '../../../shared/models/api/eventsApi'

/**
 * Events feature ViewModel — the Events page and the Home teaser both read
 * through this, sharing one request via EVENTS_QUERY_KEY (same pattern as
 * `useMediaLibraryViewModel`).
 *
 * `events` is an empty array while loading rather than undefined, so a view
 * can always `.map()` it; check `isLoading` before deciding "no events" is
 * final.
 *
 * `staleTime` 60s: a Publish in the CMS shows up on the site within a
 * minute, or immediately on a page refresh.
 */
export function useEventsViewModel() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEvents,
    staleTime: 60 * 1000,
  })

  return {
    events: data ?? [],
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    retry: () => void refetch(),
  }
}
