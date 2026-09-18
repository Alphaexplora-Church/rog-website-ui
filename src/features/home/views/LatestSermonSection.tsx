import { Button } from '../../../shared/components/ui/Button'
import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
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
 * Gradient is teal/blue (the hero's own river palette), not flat grey —
 * ties this teaser back to the "River" brand instead of reading as a
 * generic dark placeholder, same colour-past-the-hero move documented in
 * index.css's RIVER GLOW block.
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
      className="bg-white text-black"
    >
      <div className="mx-auto max-w-[64rem] px-6 py-24 sm:py-32">
        <p className="text-xs font-bold tracking-[0.22em] text-[#8f8f8f] uppercase">
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
          className={`mt-12 overflow-hidden rounded-2xl ring-1 ring-[#e4e4e4] ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {/* 16:9 media teaser. `aspect-video` is the Tailwind name for 16:9. */}
          <div
            className="relative flex aspect-video items-center justify-center overflow-hidden
              bg-[linear-gradient(135deg,#04101a_0%,#0d3b4a_45%,#0a2a52_75%,#020617_100%)]"
          >
            <span
              aria-hidden="true"
              className="absolute -inset-[30%] opacity-60 blur-[70px]
                [background-image:radial-gradient(ellipse_50%_45%_at_30%_35%,rgb(45_212_191/0.35),transparent_65%),radial-gradient(ellipse_45%_40%_at_75%_65%,rgb(56_189_248/0.3),transparent_65%)]"
            />
            <span
              aria-hidden="true"
              className="relative flex h-16 w-16 items-center justify-center rounded-full
                bg-white/10 shadow-[0_0_35px_-8px_rgba(56,189,248,0.55)] ring-1 ring-white/25"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>

          <div className="flex flex-col gap-4 bg-[#f4f4f4] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt=""
                aria-hidden="true"
                className="h-10 w-10 rounded-full object-cover ring-1 ring-[#c4c4c4]"
                loading="lazy"
              />
              <div>
                <h3 className="font-heading text-xl font-bold">{sermon.title}</h3>
                <p className="mt-1 text-sm text-[#5c5c5c]">
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
