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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
