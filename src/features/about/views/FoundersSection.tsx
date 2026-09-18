import { Button } from '../../../shared/components/ui/Button'
import { navActions } from '../../../shared/config/navigation'
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
 * About, section 5 (last) — Founders + closing CTA.
 *
 * Names and titles confirmed by Doc 1 §2.1. Bishop Augusto "Chito" Sanchez
 * Jr. and Pastor Rachel Sanchez founded the orphanage this church grew out
 * of in 1998; nothing in project docs gives a fuller bio for either, so
 * the one-line descriptions below stay close to the confirmed facts rather
 * than inventing biographical detail.
 *
 * ⚠ PLACEHOLDER PHOTOS — randomuser.me headshots, same convention and same
 * production caveat as LatestSermonSection's speaker avatar: not licensed
 * for production, `alt=""` + `aria-hidden` since these are not really
 * Bishop Chito or Pastor Rachel. Swap for real photos before launch. Once
 * Doc 2 §4.1's `person` collection type is wired up, this whole section
 * becomes a CMS-driven list through `useAboutViewModel` instead of the two
 * static entries below.
 *
 * ADDED 2026-09-16: the whole About page had zero calls-to-action — a
 * visitor who read all five sections hit a dead end. This is also where
 * Doc 8 §3 item 9's "Story & Scale" closing CTA naturally lands (that
 * section was dropped from the homepage rewrite; see Home.tsx's own note).
 * Reuses `navActions.planAVisit` — the same primary CTA as HeroSection.
 *
 * REDESIGNED 2026-09-17 (impeccable/ui-ux-pro-max/emil-design-eng pass).
 * Removed the small-caps "Founders" label that used to sit above the
 * heading — a kicker-above-heading is banned outright in the craft floor;
 * the heading ("Started by two people who saw children no one else did.")
 * already says exactly who this section is about, so the label was pure
 * redundancy. Founders now sit under a hairline rule instead of floating
 * with no separation from the heading above, and the portraits are larger
 * so they read as a real editorial pairing instead of a form-field-sized
 * avatar-plus-caption row.
 */
const founders = [
  {
    name: 'Bishop Augusto "Chito" Sanchez Jr.',
    title: 'Founder',
    photo: 'https://randomuser.me/api/portraits/men/62.jpg',
  },
  {
    name: 'Pastor Rachel Sanchez',
    title: 'Founder',
    photo: 'https://randomuser.me/api/portraits/women/58.jpg',
  },
]

export function FoundersSection() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="founders-heading"
      className="bg-black text-white"
    >
      <div className="mx-auto max-w-[64rem] px-6 py-24 sm:py-32">
        <h2
          id="founders-heading"
          className="max-w-[62ch] text-balance font-heading leading-[1.05] font-bold"
          style={{ fontSize: textH2, letterSpacing: '-0.04em' }}
        >
          <span className="block overflow-hidden pb-[0.1em]">
            <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
              Started by two people who saw children no one else did.
            </span>
          </span>
        </h2>

        <div
          className={`mt-14 grid grid-cols-1 gap-10 border-t border-[#262626] pt-12 sm:grid-cols-2 sm:gap-12 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {founders.map((f) => (
            <div key={f.name} className="flex items-center gap-6">
              <img
                src={f.photo}
                alt=""
                aria-hidden="true"
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-[#3d3d3d]"
                loading="lazy"
              />
              <div>
                <p className="font-heading text-xl font-bold text-white">{f.name}</p>
                <p className="mt-1 text-sm text-[#a6a6a6]">{f.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 flex flex-col items-center gap-5 border-t border-[#262626] pt-14 text-center ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          <p className="max-w-[62ch] font-heading text-2xl font-bold text-white">
            Come see it for yourself.
          </p>
          <Button to={navActions.planAVisit.to} variant="solid" tone="dark" size="md">
            Plan a Visit
          </Button>
        </div>
      </div>
    </section>
  )
}
