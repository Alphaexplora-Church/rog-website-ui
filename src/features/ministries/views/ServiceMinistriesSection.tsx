import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ministries, type Ministry } from '../../../shared/data/ministries'
import { person } from '../../../shared/data/people'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * Ministries, section 3 — "Service Ministries" (#SAVEDTOSERVE volunteer
 * recruitment). REVAMP 2026-09-25.
 *
 * Real copy Jude pasted from riverofgod.ph's recruitment page — internal
 * serving teams, each with a named contact and phone number. Distinct from
 * Body of Christ Ministries below (cross-church programmes). Data is
 * single-sourced in `shared/data/ministries.ts`; the contact is a slug into
 * `people.ts` (2026-09-23). Every description, tagline, hashtag, contact
 * and number is unchanged.
 *
 * Shape: an EDITORIAL INDEX on the river band, not a card grid. Each
 * ministry is one full-width row — number, big shout name, whisper
 * one-liner (the `blurb`, compressed from its own description on
 * 2026-09-23 after Jude's "too much wording"). Hover/focus lifts the row,
 * grows the ministry's own hue bar, slides in "How to join" and a
 * duotone thumbnail. The full copy lives one tap away in a dialog — the
 * row is a real <button>, so nothing depends on hover.
 *
 * Per-ministry hues (`tint`) stay as inline style: riverofgod.ph gives
 * each serving ministry its own colour, and Tailwind cannot see runtime
 * hex values. Photos are stock placeholders (two ministries share one);
 * every image has a tinted-gradient ground so a failed load is never an
 * empty box.
 */
export function ServiceMinistriesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex === null ? null : ministries[openIndex]
  const returnFocus = useRef<HTMLElement | null>(null)

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
      returnFocus.current?.focus()
    }
  }, [open])

  return (
    <section
      id="service-ministries"
      data-plate="dark"
      aria-labelledby="service-ministries-heading"
      className="relative isolate overflow-hidden bg-river py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[15%] -z-10 blur-[80px] [background-image:radial-gradient(ellipse_40%_35%_at_10%_90%,rgb(6_19_27/0.55),transparent_70%)]"
      />

      <div className={container}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHead
            id="service-ministries-heading"
            eyebrow="#SavedToServe"
            title={
              <>
                Service
                <br />
                ministries
              </>
            }
            lead="Eight teams, always in need of committed volunteers."
          />
          <p className="max-w-[34ch] border-l-2 border-bone/40 pl-5 text-[0.95rem] leading-relaxed text-bone/85">
            Being under discipleship at ROG is a requirement to join any of them.
          </p>
        </div>

        <ol className="mt-16 border-t border-bone/25">
          {ministries.map((m, i) => (
            <Reveal as="li" key={m.slug} delay={Math.min(i, 7) * 50} className="border-b border-bone/25">
              <MinistryRow
                ministry={m}
                index={i}
                onOpen={(el) => {
                  returnFocus.current = el
                  setOpenIndex(i)
                }}
              />
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Portalled: this section is `isolate`, which would trap the dialog
          under the fixed navbar whatever its z-index. */}
      {open && createPortal(<MinistryDialog ministry={open} onClose={() => setOpenIndex(null)} />, document.body)}
    </section>
  )
}

function MinistryRow({
  ministry,
  index,
  onOpen,
}: {
  ministry: Ministry
  index: number
  onOpen: (el: HTMLElement) => void
}) {
  const [deep, light] = ministry.tint

  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`${ministry.title} — read more and how to join`}
      className="group relative grid w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-6 text-left transition-colors duration-[500ms] ease-current hover:bg-abyss/25 focus-visible:bg-abyss/25 focus-visible:outline-offset-[-2px] motion-reduce:transition-none sm:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-8 lg:px-4"
    >
      {/* hue bar — the ministry's own colour, grows on engage */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-[3px] w-10 origin-left transition-transform duration-[700ms] ease-current group-hover:scale-x-[6] group-focus-visible:scale-x-[6] motion-reduce:transition-none"
        style={{ background: light }}
      />
      <span className="self-start pt-2 font-shout text-sm font-bold tabular-nums text-bone/60 sm:pt-3 sm:text-base">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="min-w-0">
        <span className="block font-shout text-[clamp(2.25rem,5.2vw,4.75rem)] font-extrabold uppercase leading-[0.88] transition-transform duration-[600ms] ease-current group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
          {ministry.title}
        </span>
        {/* one-liner under the name on mobile */}
        <span className="mt-2 block font-whisper text-[1.05rem] italic leading-snug text-bone/85 sm:hidden">
          {ministry.blurb}
        </span>
      </span>

      <span className="hidden items-center gap-6 sm:flex">
        <span
          aria-hidden="true"
          className="relative hidden h-20 w-28 flex-none overflow-hidden opacity-0 transition-[opacity,transform] duration-[600ms] ease-current group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none lg:block lg:-translate-x-3"
          style={{ background: `linear-gradient(150deg, ${light}, ${deep} 60%, #06131b)` }}
        >
          <img
            src={ministry.image}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="grain absolute inset-0" />
        </span>
        <span className="font-whisper text-[1.2rem] italic leading-snug text-bone/90">{ministry.blurb}</span>
      </span>

      <span className="flex items-center gap-3 self-center text-[0.72rem] font-semibold tracking-[0.2em] uppercase">
        <span className="hidden overflow-hidden xl:block">
          <span className="block translate-y-full transition-transform duration-[500ms] ease-current group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:translate-y-0">
            How to join
          </span>
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/40 transition-colors duration-[400ms] ease-current group-hover:border-bone group-hover:bg-bone group-hover:text-abyss">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-[400ms] ease-current group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </button>
  )
}

/**
 * The full copy, on demand — description, tagline, contact, hashtags. The
 * phone is a real `tel:` link so a phone dials it in one tap. Square
 * abyss-2 sheet (hard edges), the ministry's hue only as a top rule and
 * the header ground. Focus moves to Close on open and back to the row on
 * close; Escape and the backdrop close it.
 */
function MinistryDialog({ ministry, onClose }: { ministry: Ministry; onClose: () => void }) {
  const [entered, setEntered] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [deep, light] = ministry.tint
  const contact = person(ministry.contact)

  useEffect(() => {
    closeRef.current?.focus()
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ministry-dialog-title"
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-abyss/85 backdrop-blur-sm transition-opacity duration-300 ease-current motion-reduce:transition-none"
        style={{ opacity: entered ? 1 : 0 }}
      />

      <div
        className="relative max-h-[88svh] w-full max-w-xl overflow-y-auto bg-abyss-2 text-bone transition-[opacity,transform] duration-[500ms] ease-tide motion-reduce:transition-none"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div
          className="relative h-40 w-full overflow-hidden sm:h-48"
          style={{ background: `linear-gradient(150deg, ${light}, ${deep} 55%, #06131b)` }}
        >
          {!imgFailed && (
            <img
              src={ministry.image}
              alt=""
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div aria-hidden="true" className="grain absolute inset-0" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-abyss-2 via-abyss-2/40 to-transparent" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-abyss/70 text-bone transition-colors duration-300 ease-current hover:bg-bone hover:text-abyss"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-8 sm:px-10 sm:pb-10">
          <span aria-hidden="true" className="block h-[3px] w-16" style={{ background: light }} />
          <h3 id="ministry-dialog-title" className="mt-5 font-shout text-[clamp(2.5rem,8vw,3.75rem)] font-extrabold uppercase leading-[0.9]">
            {ministry.title}
          </h3>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-bone/80">{ministry.description}</p>
          <p className="mt-6 font-whisper text-xl italic leading-snug text-bone">{ministry.tagline}</p>

          <div className="mt-8 border-t border-bone/12 pt-6">
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">To join, contact</p>
            <p className="mt-2 font-shout text-2xl font-bold uppercase">{contact.name}</p>
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-[0.95rem] font-semibold text-ember underline-offset-4 hover:underline"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 5c0 8.284 6.716 15 15 15a2 2 0 002-2v-2a1 1 0 00-.76-.97l-3.6-.9a1 1 0 00-1 .27l-1.1 1.1a12 12 0 01-5.44-5.44l1.1-1.1a1 1 0 00.27-1l-.9-3.6A1 1 0 007.6 3H5.6A2 2 0 003 5z" />
                </svg>
                {contact.phone}
              </a>
            )}
          </div>

          <p className="mt-6 text-sm tracking-[0.04em] text-sand">{ministry.hashtag}</p>
        </div>
      </div>
    </div>
  )
}
