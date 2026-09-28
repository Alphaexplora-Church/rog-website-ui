import { useQuery } from '@tanstack/react-query'
import { fallbackMinistries } from '../../../shared/models/api/ministriesFallback'
import { fetchMinistries, MINISTRIES_QUERY_KEY } from '../../../shared/models/api/ministriesApi'

/**
 * Ministries feature ViewModel — the three Ministries sections read
 * through this (they used to import shared/data directly, which the MVVM
 * standard doesn't allow), sharing one request via MINISTRIES_QUERY_KEY.
 *
 * `placeholderData` is the bundled copy, so the page renders at once and
 * then settles on whatever the CMS says — this page was fully static until
 * 2026-09-28 and should never open empty. `staleTime` 60s, like Events and
 * Media: a Publish shows up within a minute, or on refresh.
 */
export function useMinistriesViewModel() {
  const { data, isLoading } = useQuery({
    queryKey: MINISTRIES_QUERY_KEY,
    queryFn: fetchMinistries,
    staleTime: 60 * 1000,
    placeholderData: fallbackMinistries,
  })
  const content = data ?? fallbackMinistries
  return { ...content, isLoading }
}
