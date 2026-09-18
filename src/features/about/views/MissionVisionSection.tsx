import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown, riverGlow } from '../../../shared/styles/tokens'

/**
 * About, section 3 — Mission & Vision.
 *
 * VISION is quoted verbatim from Doc 1 §2.1, which records it as confirmed
 * client copy: "to create a community of authentic believers and to
 * witness a city transformed by the life changing reality of the gospel."
 *
 * MISSION is NOT quoted verbatim. Doc 1 §2.1 records that the live site's
 * mission statement "is the Great Commission verbatim" but doesn't capture
 * which exact wording/translation ROG uses — and several common English
 * Bible translations (NIV, ESV, NLT) are copyrighted, so guessing one
 * wouldn't be safe to ship. The line below is a plain paraphrase of the
 * Great Commission's sense (Matthew 28:19–20), not a quotation of any
 * specific translation. ⚠ Swap in ROG's actual mission-statement wording
 * (screenshot or copy-paste from the live site) before this goes further —
 * flagged here in the comment only; every other placeholder on this site
 * (loremflickr photos, the beliefs summaries) is flagged the same way,
 * never in rendered UI.
 *
 * REDESIGNED 2026-09-17 (impeccable/ui-ux-pro-max/emil-design-eng pass).
 * "Mission" and "Vision" used to sit as small tracked-caps labels above
 * each quote — a kicker-above-heading, which the craft floor bans outright
 * regardless of size. Folded the word into the sentence itself instead
 * (bold lead-in, same type block, no separate line) so the quote reads as
 * one continuous statement rather than a label-plus-caption card. Both
 * panels keep the site's existing bg-line/gap-px divider construction
 * (already used by NextStepsSection and MinistriesGrid) — that's a real
 * layout device, not the banned label.
 */
export function MissionVisionSection() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="mission-vision-heading"
      className="relative overflow-hidden bg-black text-white"
    >
      <div aria-hidden="true" className={riverGlow} />

      <div className="relative z-10 mx-auto max-w-[64rem] px-6 py-24 sm:py-32">
        <h2 id="mission-vision-heading" className="sr-only">
          Mission and Vision
        </h2>

        <div
          className={`grid gap-px overflow-hidden rounded-2xl bg-[#262626] ring-1 ring-[#262626] sm:grid-cols-2 ${revealBase} ${shown ? revealShown : revealHidden}`}
        >
          <div className="flex flex-col justify-center bg-[#0d0d0d] p-10 sm:p-14">
            <p className="font-heading text-2xl leading-snug font-bold text-white">
              Mission.{' '}
              <span className="font-normal">
                Go and make disciples of every nation — baptizing them, and teaching them
                to follow everything Christ commanded.
              </span>
            </p>
          </div>

          <div className="flex flex-col justify-center bg-[#0d0d0d] p-10 sm:p-14">
            <p className="font-heading text-2xl leading-snug font-bold text-white">
              Vision.{' '}
              <span className="font-normal">
                To create a community of authentic believers and to witness a city
                transformed by the life-changing reality of the gospel.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
