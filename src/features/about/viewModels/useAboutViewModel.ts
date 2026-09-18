/**
 * ViewModel for the `about` feature — currently a stub, same shape as
 * `useHomeViewModel`.
 *
 * Every section on this first pass (Doc 4 §3.2) reads static copy: the
 * confirmed facts in Doc 1 §2.1 (founding year, founders, campus history,
 * the 477-church claim) and the mission/vision lines already settled in
 * Doc 1 §2.1. Nothing here calls the CMS yet. Per Doc 2 §4.1 this page's
 * real content will eventually come from the `page` collection type
 * (About Us is explicitly named as one of its covered pages) plus the
 * `person` collection for founders/leadership — when that wiring happens,
 * it goes through this hook, never fetched directly in a View.
 */
export function useAboutViewModel() {
  return {}
}
