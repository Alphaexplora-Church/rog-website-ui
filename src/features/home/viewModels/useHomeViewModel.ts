/**
 * ViewModel for the `home` feature — currently a stub.
 *
 * Doc 4 (MVVM house standard) requires every feature to keep the
 * `viewModels/` + `views/` pair even before it has data of its own; this file
 * is that placeholder. `Home.tsx` does not call it yet because there is
 * nothing to fetch — the hero is static copy from `shared/config/site.ts`.
 *
 * Per Doc 5 §3, `home/` owns the `homepage` Strapi single type plus the
 * `sermon` and `event` feed queries for "Latest Messages" and "Upcoming"
 * style sections. When the first of those sections is built, its data goes
 * through this hook — never fetched directly in a View — following the same
 * shape as `useHomeViewModel` in Doc 4 §2:
 *
 *   const { data, isLoading, error } = useHomeViewModel()
 *
 * Until then this intentionally returns nothing, so nothing here is fake.
 */
export function useHomeViewModel() {
  return {}
}
