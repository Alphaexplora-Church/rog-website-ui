# River of God (ROG) Website Design — "Textured Editorial"

**Revamped 2026-09-25.** Source of truth for the direction: ROG 11 — Design Plan (Textured Editorial) in the CMS project. This file is the working summary for anyone editing `src/`.

> Concept in one line: **the website is a poster wall that flows.** ROG's own graphics are loud, grainy, high-contrast — closer to a movement than a heritage institution. The site carries that energy: grain everywhere, two typographic voices, deep-water grounds, one ember accent, and motion that drifts like water.

## Principles

1. **The photo is the poster.** Frame images, don't flatten them into uniform cards.
2. **Everything has atmosphere.** No flat fills: grain on every ground, light from gradients and glows — never drop shadows.
3. **Two voices.** *Shout* = Big Shoulders Display, uppercase, short lines (2–4 words). *Whisper* = Bodoni Moda italic for scripture, leads and quotes. Hanken Grotesk does the work in between.
4. **Water moves.** Drift, tide, fill. Never bounce, spring or wobble.
5. **Hard edges, soft light.** Posters/images/sections are square (radius 0). Pills and nav are fully round. Softness lives in light and grain.
6. **Every section a different shape.** No bento grids, no symmetric three-card rows repeated down a page. If two sections on a page look alike, change one.

## Tokens (`src/index.css` `@theme` → real Tailwind utilities)

| Utility | Hex | Role |
|---|---|---|
| `abyss` | `#06131b` | Primary ground. Deep water, not black |
| `abyss-2` | `#0a1d27` | Raised surface on abyss |
| `deep` | `#0b2a33` | Between abyss and river |
| `river` | `#0e5f68` | Secondary ground / section bands (ROG 11 calls it `--current`; renamed because Tailwind reserves `current`) |
| `shallows` | `#7fc2b8` | Secondary text & eyebrows on dark |
| `bone` | `#f4ede2` | Text on dark; light ground |
| `bone-2` | `#e9dfcf` | Raised surface on bone |
| `sand` | `#cdb892` | Warm meta text on dark |
| `ember` | `#f2761c` | **The one accent.** Primary CTA, LIVE, active state, fill lines |
| `ember-ink` | `#a3420b` | Ember as text on bone only |

Contrast: bone/abyss 16.2 · bone/river 6.3 · shallows/abyss 9.2 · sand/abyss 9.7 · ember/abyss 6.6 · abyss-on-ember 6.6 · ember-ink/bone 5.4. **Ember is never text on bone or on river.** shallows/sand on river = large text only.

Fonts: `font-shout`, `font-whisper`, `font-sans` (default). Self-hosted in `public/fonts`.
Easing: `ease-current` (UI), `ease-tide` (reveals). Animations: `animate-marquee`, `animate-boil`, `animate-drift`, `animate-wave-draw`, `animate-live`.
Texture utilities: `grain` (local grain overlay; parent `relative`), `duotone` (River duotone → true colour on hover/focus/centre = **Colour Bloom**), `halftone`, `no-scrollbar`. A global grain layer already sits on `body::after`.

Opacity modifiers work on every token (`text-bone/70`, `border-bone/12`, `bg-abyss/80`).

## Shared class strings (`src/shared/styles/tokens.ts`)

`displayXL / displayL / displayM / displayS / numeral` (shout scale), `whisperL / lead` (whisper), `meta`, `eyebrow`, `container` (`mx-auto max-w-[88rem] px-4 sm:px-8` — use on every section), `reveal*` / `maskLine*` / `heroReveal*` (motion), `riverGlow`, `emberGlow`, `plate.dark|light` (legacy prop-switched colour sets), `accent`.

## Primitives (`src/shared/components/ui/`)

- `Button` — `variant`: `ember` (the ONE primary action per view, has the only glow), `solid` (bone), `outline`, `ghost` (ember underline flows in). `size`: sm/md/lg. `tone`: dark/light. `live` adds pulsing dot, `arrow` adds sliding arrow.
- `River.tsx` — `WaveMark` (ROG's three strokes; `draw` animates), `WaveRule` (full-width wave hairline divider), `Pill` (outlined italic lowercase label — ROG's own label style), `Eyebrow` (wave + uppercase label), `RiverImage` (duotone + scrim + grain; `bloom="hover"` for lists, `"always"` for detail pages), `Reveal` (scroll entrance for a group; `delay` for 60ms staggers), `Marquee` (with pause control — WCAG 2.2.2), `SectionHead` (eyebrow + masked shout title + whisper lead), `useCenterBloom`.
- `PageHero` — every inner page's first screen: eyebrow, masked shout title (array = explicit lines), whisper lead, optional `image` (drift + scrim + boiling grain), `aside` slot, `actions`, `align`, `size`.

Hooks: `useInView` (fires once, has failsafe), `useScrollProgress` (writes 0→1 progress to a style without re-rendering — for fill lines).

## Rules

- Mark every section `data-plate="dark"` or `"light"` (the nav flips its ink on light). Bone sections are the light plate.
- Section padding ≥ `py-24` (`sm:py-32` typical). Full-bleed hero heights use `svh`, never `h-screen`.
- One `h1` per page (PageHero provides it). Keep heading order.
- Everything moving has a reduced-motion fallback (`motion-reduce:` or the global rule in `index.css`). Nothing's meaning is hover-only.
- Text over photos always sits on a scrim.
- Use complete literal class strings (Tailwind scans source text). Per-item colours from data go in `style`, not interpolated class names.
- Keep MVVM: views call the feature's ViewModel hook; data lives in `shared/data`, `features/*/data` or `shared/models`. Never fetch in a view.
- Legacy colours `#1b7a70`, `#8FD4C9`, `#161616`, `#232323`, `bg-black`, `text-[#a6a6a6]`, cyan-* and `font-heading` (a dead class) are retired — replace on sight.

## Page map

| Route | Shape |
|---|---|
| `/` | Poster hero (liquid teal/ember texture, motto, service times) → ember marquee → The Current (weekly rhythm on river ground) → Watch or Listen editorial split + index rows → Five crossings (5Es) → upcoming events poster shelf → visit CTA |
| `/about/who-we-are` | PageHero → in-page pill nav → founders timeline → leadership → teams → life stages → **Core Values** (value rail with slide colours + photos) → Statement of Faith → Discipleship teaser → footer |
| `/discipleship` | PageHero with stage index → five chapters on one ember Current Fill line (pinned title, scripture, goal/tools/environment, materials) → "the path" on bone → next step on river |
| other routes | PageHero + content sections following the rules above |
