import { useEffect, useState } from 'react'
import { ministries, type Ministry } from '../../../shared/data/ministries'
import { person } from '../../../shared/data/people'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Ministries, section 4 — "Service Ministries" (volunteer recruitment).
 * NOT part of the Figma Ministries.dc.html board — this is real copy Jude
 * pasted from riverofgod.ph's own recruitment page ("#SAVEDTOSERVE"),
 * distinct from Body of Christ Ministries above (that section is
 * cross-church programs; this one is internal serving teams recruiting
 * volunteers, each with a named contact and phone number).
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * Jude: "make sure that the data placeholders are all the same… para pag
 * inimplement tsaka inintegrate natin yung cms, we wont encounter any
 * issue."
 *
 * The eight ministries used to be an array in this file, and About's
 * "Serving Ministry Heads" roster carried its own second copy of six of the
 * same people — with two role labels spelled differently there ("Media &
 * Production", "Discipleship & Connect"). They now both read
 * `shared/data/ministries.ts`, and the contact person is a slug into
 * `shared/data/people.ts` rather than a name and a phone number typed out
 * beside each ministry. Nothing on this page changed to look at; About's
 * two mismatched labels did.
 *
 * All descriptions, taglines, hashtags, contacts and numbers moved across
 * byte-for-byte — including the two reconciliations against the official
 * cards ("Carissa Traigo", one r; and "Nica Moreno" rather than "Veronica
 * Moreno", flagged then as an inference since Nica is a common nickname for
 * Veronica).
 *
 * ── REVAMPED 2026-09-23 ──────────────────────────────────────────────────
 * Jude: "masyado siyang makalat, too much wording, not enough color, it's
 * too pale, add some placeholder pictures." All four were true:
 *
 *   1. MAKALAT / TOO MUCH WORDING. Eight cards each rendered a full ~90-word
 *      description PLUS a tagline PLUS contact PLUS hashtags, all at once —
 *      roughly 800 words of body copy in a single viewport. No word has been
 *      deleted; the long copy now lives behind a tap (progressive
 *      disclosure), and the card face carries a one-line blurb compressed
 *      from each ministry's OWN description. Those blurbs are compressions,
 *      never new claims — Creative Arts' names its three divisions because
 *      its own description names them.
 *   2. TOO PALE. Every card was `bg-white/5` on `#232323` — one flat wash,
 *      eight times.
 *   3. NOT ENOUGH COLOUR. The previous version's own comment justified the
 *      teal-only palette by citing "Doc 9's 'black is primary, teal is the
 *      one allowed accent' rule". That rule is not in Doc 9 — Doc 9 §4
 *      actually calls the current palette "an explicitly placeholder
 *      palette, not designed work". The teal-only rule is tokens.ts's own
 *      ACCENT comment, a code convention. Under Doc 9 §2 precedence 1 ("the
 *      brief wins") Jude's instruction outranks a code comment, and
 *      riverofgod.ph itself gives each serving ministry its own colour — so
 *      each one gets a hue here.
 *   4. NO PICTURES. Added — see the placeholder warning below.
 *
 * COLOURS ARE INLINE `style`, NOT TAILWIND CLASSES, deliberately. Tailwind
 * only emits utilities whose exact class string it has already seen in the
 * project, so eight brand-new `from-[#…]` pairs would render as nothing in
 * the running dev server until it restarts — the one thing this pass exists
 * to fix would be invisible. Inline style bypasses the compiler and is the
 * same escape hatch tokens.ts uses for textH1.
 *
 * ⚠ THE PHOTOS ARE PLACEHOLDERS AND TWO MINISTRIES SHARE ONE. They are
 * stock Unsplash frames already shipping elsewhere in this codebase, chosen
 * by looking at them rather than trusting a filename (for the record,
 * ServiceTimesSection's "Sunday Worship" image is a hippopotamus). No stock
 * frame here honestly reads as River Kids, so it reuses the congregation
 * frame rather than passing off a stock photo of someone else's children as
 * ROG's. Every one of these wants a real ROG photo of the actual team; that
 * swap is the `image:` field and nothing else.
 *
 * Doc 9 obligations applied: eyebrow pill above the H2 (§4C), double-bezel
 * shells (§4A), `py-24`+ section padding, hairline rings rather than 1px
 * grey borders, custom cubic-bezier on every transition, reduced-motion
 * honoured, tap targets over 44px, and no hover-only affordance — each card
 * is a real `<button>`, so touch and keyboard reach the detail exactly the
 * way a mouse does.
 */


export function ServiceMinistriesSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex === null ? null : ministries[openIndex]

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section
      ref={ref}
      id="service-ministries"
      data-plate="dark"
      aria-labelledby="service-ministries-heading"
      className="bg-[#0d0d0d] text-white"
    >
      <div className="mx-auto max-w-[86rem] px-6 py-24 sm:py-32">
        <div className={`${revealBase} ${shown ? revealShown : revealHidden}`}>
          {/* Doc 9 §4C eyebrow pill. */}
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              color: '#8FD4C9',
              backgroundColor: 'rgb(27 122 112 / 0.18)',
              boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
            }}
          >
            #SavedToServe
          </span>
          <h2
            id="service-ministries-heading"
            className="mt-5 font-heading text-3xl font-bold sm:text-5xl"
          >
            Service Ministries
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-[#a6a6a6] sm:text-base">
            Eight teams, always in need of committed volunteers. Being under discipleship at ROG is
            a requirement to join any of them.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((m, i) => (
            <li
              key={m.title}
              className={`${revealBase} ${shown ? revealShown : revealHidden}`}
              style={{ transitionDelay: `${120 + Math.min(i, 7) * 60}ms` }}
            >
              <MinistryCard ministry={m} index={i} onOpen={() => setOpenIndex(i)} />
            </li>
          ))}
        </ul>
      </div>

      {open && <MinistryDialog ministry={open} onClose={() => setOpenIndex(null)} />}
    </section>
  )
}

/**
 * Poster card. Double-bezel per Doc 9 §4A — the outer shell carries the
 * ministry's gradient and a hairline edge, the inner core is the photo at a
 * tighter radius. The whole card is one `<button>` rather than a hover
 * target, because Doc 9 bans hover-only affordances: touch is the majority
 * case for this audience.
 */
function MinistryCard({
  ministry,
  index,
  onOpen,
}: {
  ministry: Ministry
  index: number
  onOpen: () => void
}) {
  const [deep, light] = ministry.tint

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${ministry.title} — read more and how to join`}
      className="group block h-full w-full rounded-3xl p-[1.5px] text-left transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
      style={{ background: `linear-gradient(160deg, ${deep}, ${light}55 55%, transparent)` }}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-[#141414]">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={ministry.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
          />
          {/* The hue lives here — a wash over the photo, so cards that share
              a stock frame still read as different ministries. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, #141414 6%, ${deep}CC 45%, ${light}40 100%)`,
            }}
          />
          <span
            className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-black uppercase"
            style={{ backgroundColor: light }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-grow flex-col p-5">
          <h3 className="font-heading text-lg leading-tight font-bold text-white">
            {ministry.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#a6a6a6]">{ministry.blurb}</p>

          <span
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] uppercase"
            style={{ color: light }}
          >
            How to join
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  )
}

/**
 * The full copy, on demand. Everything the old card showed at once lives
 * here — description, tagline, contact, hashtags — so the trim lost nothing.
 * The phone is a real `tel:` link, which the flat text version never was, so
 * a phone can dial it in one tap.
 */
function MinistryDialog({ ministry, onClose }: { ministry: Ministry; onClose: () => void }) {
  const [entered, setEntered] = useState(false)
  const [deep, light] = ministry.tint

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ministry.title}
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        style={{ opacity: entered ? 1 : 0 }}
      />

      <div
        className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-[1.5px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:rounded-3xl"
        style={{
          background: `linear-gradient(160deg, ${deep}, ${light}55 55%, transparent)`,
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
        }}
      >
        <div className="rounded-t-[1.4rem] bg-[#141414] sm:rounded-[1.4rem]">
          <div className="relative h-32 w-full overflow-hidden rounded-t-[1.4rem]">
            <img
              src={ministry.image}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, #141414 8%, ${deep}CC 55%, ${light}40 100%)`,
              }}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/70"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="font-heading text-2xl font-bold text-white">{ministry.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#a6a6a6]">{ministry.description}</p>
            <p className="mt-4 text-sm font-semibold" style={{ color: light }}>
              {ministry.tagline}
            </p>

            <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: `${deep}26` }}>
              <p className="text-[10px] font-bold tracking-[0.18em] text-[#a6a6a6] uppercase">
                To join, contact
              </p>
              <p className="mt-1 font-heading text-base font-bold text-white">
                {person(ministry.contact).name}
              </p>
              <a
                href={`tel:${person(ministry.contact).phone ?? ''}`}
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:underline"
                style={{ color: light }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 5c0 8.284 6.716 15 15 15a2 2 0 002-2v-2a1 1 0 00-.76-.97l-3.6-.9a1 1 0 00-1 .27l-1.1 1.1a12 12 0 01-5.44-5.44l1.1-1.1a1 1 0 00.27-1l-.9-3.6A1 1 0 007.6 3H5.6A2 2 0 003 5z" />
                </svg>
                {person(ministry.contact).phone}
              </a>
            </div>

            <p className="mt-4 text-xs text-[#737373]">{ministry.hashtag}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
