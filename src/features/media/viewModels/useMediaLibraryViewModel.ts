import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchMediaLibrary, MEDIA_LIBRARY_QUERY_KEY } from '../../../shared/models/api/mediaApi'
import { createMediaIndex, EMPTY_LIBRARY } from '../data/mediaData'

/**
 * Media feature ViewModel — the Media page, series pages, browse pages and
 * the watch page all read through this.
 *
 * Returns `media` (a MediaIndex — see mediaData.ts) plus the usual
 * `isLoading` / `error`. While loading, `media` is an empty index rather
 * than undefined, so a view can always call `media.findSermon(...)`; it just
 * must check `isLoading` before deciding something is "not found".
 *
 * `staleTime` 60s: moving between list and detail pages reuses the cached
 * library instead of refetching, and a Publish in the CMS shows up on the
 * site within a minute — or immediately on a page refresh.
 */
export function useMediaLibraryViewModel() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: MEDIA_LIBRARY_QUERY_KEY,
    queryFn: fetchMediaLibrary,
    staleTime: 60 * 1000,
  })

  const media = useMemo(() => createMediaIndex(data ?? EMPTY_LIBRARY), [data])

  return {
    media,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    retry: () => void refetch(),
  }
}
