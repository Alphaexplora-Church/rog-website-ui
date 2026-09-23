import { Link } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
  plate,
  revealBase,
  revealDelay1,
  revealHidden,
  revealShown,
  textH2,
} from '../../../shared/styles/tokens'

/**
 * Home, section 4 — "Latest Messages" (Doc 8 §3), refined per Jude's
 * 2026-09-16 revision from a 3-card feed down to a single teaser — the full
 * feed can come later once the `sermon` collection (Doc 7) is actually
 * live; this is the "here's what's current" pointer, not the archive.
 *
 * REAL CONTENT, NOT A PLACEHOLDER: title, speaker and date come from Doc 1
 * §"the sermon library is current" — "SOZO" by Pastor Mark Libunao was the
 * latest message on Subsplash as of this build. Update `sermon` below once
 * the Strapi `sermon` collection is live and this can fetch instead.
 *
 * NO THUMBNAIL IMAGE — same reasoning as the hero's "no stock photo/video":
 * there's no real frame from this sermon to show yet, and a stock preaching
 * photo would read as generic. The 16:9 box below is an authored gradient +
 * play glyph, the same abstract-CSS approach the hero uses, not a fake still.
 * Swap in the real thumbnail (from Subsplash or wherever hosts it) the
 * moment one exists — this placeholder should not survive to launch.
 *
 * REFINED 2026-09-18 (impeccable/ui-ux-pro-max pass, Jude's request to go
 * deeper on this section specifically). Two real problems, not just polish:
 *
 * 1. AFFORDANCE BUG — the play-button glyph made a promise the markup broke.
 *    It sat on a plain `<div>`; nothing happened if you clicked it. Only the
 *    small "Watch Full Series" button below actually went anywhere. Fixed by
 *    making the thumbnail itself a real `<Link to="/sermons">` (siblings with
 *    the footer's own Button/Link, not nested — nesting an `<a>` inside an
 *    `<a>` is invalid HTML and breaks click handling), with an `aria-label`
 *    naming the actual sermon, a hover response, and a visible
 *    `focus-visible` ring — the same three things any real "press play"
 *    control needs and this one had none of.
 *
 * 2. PALETTE DRIFT — the gradient was `#04101a → #0d3b4a → #0a2a52 →
 *    #020617`, the same navy-wash family corrected out of Hero/ServiceTimes/
 *    AboutHero this session. Rebuilt on the same restrained language those
 *    now use: a near-black base with exactly one soft accent glow, not a
 *    multi-stop navy gradient carrying half the section's colour weight.
 *
 * The ONE authored motion moment here is new too: a slow ripple behind the
 * play button (Tailwind's built-in `ping` keyframe, already shipped in the
 * bundle because `Button.tsx`'s `live` dot uses `animate-ping` — reusing it
 * costs nothing extra). A ripple is a water motif for free, and it reads as
 * "press me" without being a second, competing hover-only cue. Hover then
 * answers that invitation: the glow deepens and the play button brightens
 * and scales, one coordinated response instead of several separate ones.
 * `motion-reduce:hidden` on the ripple, same convention as the live dot.
 *
 * Gradient is teal/blue (the hero's own river palette), not flat grey —
 * ties this teaser back to the "River" brand instead of reading as a
 * generic dark placeholder, same colour-past-the-hero move documented in
 * tokens.ts's `riverGlow` export.
 *
 * ⚠ PLACEHOLDER PHOTO — the small avatar next to the speaker credit is a
 * generic portrait from randomuser.me (a placeholder-headshot service made
 * for exactly this — it isn't a photo of Pastor Mark Libunao, so `alt` is
 * left empty rather than naming him). Swap for his real photo once one is
 * on hand; don't let a stranger's face keep his name attached at launch.
 */
const sermon = {
  title: 'SOZO',
  speaker: 'Pastor Mark Libunao',
  date: 'July 5, 2026',
}

export function LatestSermonSection() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="light"
      aria-labelledby="latest-sermon-heading"
      className={`${plate.light.bg} ${plate.light.ink}`}
    >
      <div className="mx-auto max-w-[64rem] px-6 py-24 sm:py-32">
        <p className={`text-xs font-bold tracking-[0.22em] uppercase ${plate.light.inkSubtle}`}>
          Latest Message
        </p>

        <h2
          id="latest-sermon-heading"
          className="mt-6 max-w-[62ch] text-balance font-heading leading-[1.05] font-bold"
          style={{ fontSize: textH2, letterSpacing: '-0.04em' }}
        >
          <span className="block overflow-hidden pb-[0.1em]">
            <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
              Missed Sunday? Catch up.
            </span>
          </span>
        </h2>

        <div
          className={`mt-12 overflow-hidden rounded-2xl ring-1 ${plate.light.ring} ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {/* 16:9 media teaser, and the actual play control — see the doc
              comment above for why this is a real `<Link>` now, not a `<div>`
              wearing a play-button costume. */}
          <Link
            to="/sermons"
            aria-label={`Watch ${sermon.title} with ${sermon.speaker}`}
            className="group relative flex aspect-video items-center justify-center overflow-hidden
              bg-[linear-gradient(135deg,#050505_0%,#0a0a0a_55%,#000_100%)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-inset"
          >
            {/* One restrained accent glow — this card's whole colour budget
                past black/white, same low-key language as the corrected
                Hero mesh. Deepens on hover instead of shifting hue. */}
            <span
              aria-hidden="true"
              className="absolute -inset-[30%] opacity-60 blur-[70px] transition-opacity duration-700 group-hover:opacity-90
                [background-image:radial-gradient(ellipse_50%_45%_at_30%_35%,rgb(45_212_191/0.22),transparent_65%),radial-gradient(ellipse_45%_40%_at_75%_65%,rgb(56_189_248/0.16),transparent_65%)]"
            />

            {/* Ripple — the section's one authored motion moment, always on,
                quiet: a water ring inviting the press rather than a second
                hover-only cue competing with the button's own hover state. */}
            <span
              aria-hidden="true"
              className="absolute h-16 w-16 rounded-full bg-white/25 [animation:ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite] motion-reduce:hidden"
            />

            <span
              aria-hidden="true"
              className="relative flex h-16 w-16 items-center justify-center rounded-full
                bg-white/10 shadow-[0_0_35px_-8px_rgba(56,189,248,0.55)] ring-1 ring-white/25
                transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                group-hover:scale-110 group-hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </Link>

          <div
            className={`flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between ${plate.light.surface}`}
          >
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt=""
                aria-hidden="true"
                className={`h-10 w-10 rounded-full object-cover ring-1 ${plate.light.ringStrong}`}
                loading="lazy"
              />
              <div>
                <h3 className="font-heading text-xl font-bold">{sermon.title}</h3>
                <p className={`mt-1 text-sm ${plate.light.inkMuted}`}>
                  {sermon.speaker} · <time className="tabular-nums">{sermon.date}</time>
                </p>
              </div>
            </div>

            {/* ⚠ Placeholder route — see HeroSection's own /sermons CTA note. */}
            <Button to="/sermons" variant="outline" tone="light" size="sm">
              Watch Full Series
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
