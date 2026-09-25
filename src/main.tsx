import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// `index.css` import KEPT, 2026-09-17 (tailwind-design-system migration).
// I tried removing this along with every custom class — wrong call, caught
// live: this import isn't just "custom CSS," its first line is
// `@import 'tailwindcss'`, which is what makes the Tailwind Vite plugin
// generate ANY utility CSS at all, including plain stock classes like
// `text-white`. Dropping the import didn't just remove the old custom
// classes, it silently zeroed out every Tailwind stylesheet on the site —
// confirmed via the live page having `document.styleSheets.length === 0`.
// index.css itself is now stripped down to just that one import (see its
// own header comment) — everything it used to hand-author is gone, but the
// file still has to exist and still has to be imported for Tailwind itself
// to work.
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * TanStack Query (Doc 3 §1, Doc 5 §4.5) — added 2026-09-23 with the CMS
 * connection. It was already a dependency but never mounted, because
 * nothing fetched until now. One client for the app, so every ViewModel
 * reading the same query key shares one request and one cache.
 *
 * `retry: 1` — one quiet retry for a network blip, then show the error
 * state. The default (3, with backoff) leaves a visitor staring at a
 * loading shimmer for several seconds when the CMS is simply down.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
