# River of God (ROG) Website Design

This document records the visual language already present in this project and gives a consistent starting point for new pages and components. It is based on the shared tokens, current page components, and a local browser inspection of the Home, About, Events, Media, and Plan a Visit pages.

## Brand and experience

The site represents River of God Ortigas. Its visual tone is welcoming, faith-centered, calm, and confident. It combines cinematic worship imagery with clear, practical information for people deciding whether to visit, looking for a service, or finding a message or ministry.

Use a human, invitational voice. Keep labels short and often uppercase; keep explanatory copy plain and warm. Calls to action should tell visitors what happens next, such as **Commune Together**, **Watch Live**, and **Give**.

## Visual system

### Color

The foundation is monochrome. Use contrast, photography, and light to create depth; reserve the cool accent for small points of attention.

| Role | Dark plate | Light plate |
| --- | --- | --- |
| Page background | `#000000` | `#ffffff` |
| Main text | `#ffffff` | `#000000` |
| Muted text | `#a6a6a6` | `#5c5c5c` |
| Subtle text | `#737373` | `#8f8f8f` |
| Raised surface | `#0d0d0d` | `#f4f4f4` |
| Border | `#262626` | `#e4e4e4` |
| Strong border | `#3d3d3d` | `#c4c4c4` |

The shared palette lives in `src/shared/styles/tokens.ts` as `plate.dark` and `plate.light`. Mark large sections with `data-plate="dark"` or `data-plate="light"`; the floating navigation uses that marker to choose a readable text and glass treatment.

The shared accent is cyan: use the existing `accent` token (`text-cyan-300`, `ring-cyan-400/30`, `border-cyan-400/30`, and `bg-cyan-400/10`). `riverGlow` is the existing low-opacity ambient treatment for dark sections. Some current pages still use the older pale mint `#8FD4C9` and deeper green `#1b7a70`. Treat those as legacy color drift; use the shared cyan tokens for new work and align old components when they are next revised.

Do not use saturated accent color as a large section background. It should identify a live state, eyebrow, small badge, focus ring, or restrained glow while black and white remain dominant.

### Typography

- The site-wide stack is `'proxima-nova', 'Figtree', ui-sans-serif, system-ui, sans-serif`.
- Figtree is the active web-font stand-in. Proxima Nova is first in the stack for when the church Adobe Fonts kit is enabled on this domain.
- Use strong, compact headings with generous line breaks. Headline tracking is generally tight; small section labels use bold, widely tracked uppercase text.
- Body text uses a global line-height of `1.6` and slight negative letter spacing.
- Prefer the shared fluid `textH1` and `textH2` sizes in `src/shared/styles/tokens.ts` where they fit. Existing pages also use responsive Tailwind size steps; keep their scale and weight consistent when editing.

### Layout and shape

- Center primary content in a maximum width of `86rem`, with `px-6` page gutters as the common pattern.
- Give sections room to breathe. Use an editorial hierarchy: a short eyebrow, a clear heading, concise supporting text, then one primary action or a focused content group.
- Use full-bleed, darkened photography for story, ministry, and event heroes. Place a strong scrim between image and text so copy stays legible across crops.
- The home hero is a special, centered stage composition: black canvas, ROG logo, the motto, and two actions. Its soft white light beams, subtle grain, vignette, and restrained cyan glow should stay atmospheric rather than compete with the message.
- Use wave-shaped dividers where one page section intentionally hands into the next dark plate; keep them occasional rather than a repeated decoration on every section.
- Keep cards quiet: simple surfaces, fine borders, and clear content hierarchy. Let real people, ministry names, message artwork, and event details supply the interest.

### Photography and brand assets

Prefer genuine ROG, congregation, worship, and community photography. The current project uses the site logo assets under `public/assets/` and remote Unsplash photos for several hero sections. For new imagery, choose candid, documentary-feeling moments and leave enough quiet area for the headline. Use a dark scrim when text overlays a photo. Mark purely decorative images with empty alt text; give meaningful portraits and message artwork useful descriptions.

Use the logo paths from `src/shared/config/site.ts` rather than hardcoding an asset path in page components. The full lockup is for prominent brand moments; the wide wave mark is suited to the compact navigation and footer.

## Shared interface patterns

### Navigation and footer

- Keep the navigation fixed near the top in a rounded, translucent glass pill with backdrop blur.
- On desktop, show the primary links and concise action links. The pill adapts its text and surface to the dark or light section behind it and becomes more opaque after scrolling.
- On small screens, use the menu toggle and a focused mobile navigation state; opening it should prevent background scrolling and Escape should close it.
- Keep the footer dark. It carries the mark, motto, address, phone, social link, grouped site links, and legal links.

### Buttons and controls

Use `src/shared/components/ui/Button.tsx` for shared calls to action. It provides solid and outline treatments, dark and light tones, and size variants. A solid button may use its existing sheen hover; the optional live state uses a small pulsing dot. Keep button labels action-oriented and consistent with `src/shared/config/navigation.ts`.

Forms should use visible labels, clear required states, comfortable spacing, and a distinct confirmation state. The Plan a Visit page is the reference: a narrow, centered form on black with a simple step label, high-contrast heading, and dark bordered confirmation panel.

## Motion

Motion should feel slow, smooth, and purposeful: it can suggest stage light, water, or a welcoming transition without delaying access to content.

- Use the shared easing curve `cubic-bezier(0.32, 0.72, 0, 1)` for shared transitions.
- Existing patterns include a subtle hero entrance, masked heading reveals, scroll-triggered fade/slide reveals, understated button highlights, and slow ambient movement in the home hero.
- Use `useInView` and the shared `reveal*`, `maskLine*`, and `heroReveal*` tokens for matching existing reveal patterns.
- Keep continuous ambient movement very slow and low contrast. Avoid adding motion to every card or section.
- Honor reduced-motion preferences. Shared transition tokens already include `motion-reduce:transition-none`; apply an equivalent reduced-motion behavior to new Framer Motion effects.

## Page patterns currently implemented

| Route | Page composition and visual pattern |
| --- | --- |
| `/` | Centered logo-and-motto hero; upcoming events; message previews; live-service links; service times and center address. |
| `/about/who-we-are` | Dark photo hero; in-page section navigation; founders’ story; leadership and team lists; life-stage coordinators; expandable statement of faith. |
| `/ministries` and `/ministries/body-of-christ` | Photo-led introduction followed by ministry and life-stage content. |
| `/media` | Featured-message hero followed by a light media library with Series, Topics, Speakers, and Scripture tabs plus search. |
| `/media/series/:slug`, `/media/browse/:type/:slug`, `/media/watch/:slug` | Series, category, and individual-message detail views. Keep thumbnails and message metadata central. |
| `/events` | Dark photo hero followed by weekly gatherings and upcoming event cards. |
| `/plan-a-visit` | Narrow, centered guest form with a clear completion state. |
| `/watch-live` | Dark, photo-led live-service page with current/next-service information. |
| `/give` | Dark, spacious giving page with restrained cyan-family ambient light and giving choices. |
| `/about/him-ph` | One continuous dark page (`#121212`) like Who We Are: full-screen photo hero with three network facts and an Explore link (no in-page section bar); the mission motto as display type beside mission and vision; a River of God and HIM connection band; two featured leaders plus a directory where each person appears once with Council/Board/Staff tags and one black-and-white portrait treatment; all 12 core values open (a swipeable row on phones); a numbered statement of faith; a closing membership panel with the application download and contact card, then a wave into the footer. See [HIM-PHILIPPINES-REDESIGN-PLAN.md](HIM-PHILIPPINES-REDESIGN-PLAN.md) for the full content inventory and asset notes. |

Every page keeps the shared navigation and footer. Preserve this shell and use each route’s existing page components when extending a section.

## Accessibility and implementation notes

- Keep one clear page-level heading and preserve heading order within sections.
- Maintain visible keyboard focus, usable contrast over photographs, and descriptive labels for links, tabs, buttons, and form fields.
- Decorative overlays, glow, texture, and background images should not add noise to screen readers.
- The project is Tailwind-first. `src/index.css` loads Tailwind and the web font; shared literal values and class strings live in `src/shared/styles/tokens.ts`. Use complete, static Tailwind class strings so the compiler can detect them.
- Keep navigation labels and action destinations centralized in `src/shared/config/navigation.ts`; keep site identity, logos, service times, and contact details in `src/shared/config/site.ts`.

### Route coverage note

The app currently sends unmatched paths to a stub route. Some configured navigation destinations (`/about/rbsi`, `/discipleship`, and `/activate12`) do not yet have dedicated routes, and the Home “Watch Latest Service” button currently points to `/sermons` while message pages live under `/media/watch/:slug`. Treat these as route follow-ups, not as implemented page designs. `/about/him-ph` now has a dedicated implementation; its source-content inventory and asset notes are in [HIM-PHILIPPINES-REDESIGN-PLAN.md](HIM-PHILIPPINES-REDESIGN-PLAN.md).
