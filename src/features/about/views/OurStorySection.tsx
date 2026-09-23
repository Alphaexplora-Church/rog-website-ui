import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * About, section 2 — Our Story.
 *
 * ⚠ THIS IS A FIRST DRAFT, NOT ROG'S FINAL COPY. Doc 8 §6 item 1 flags
 * "Our Story copy" as the single highest-priority content gap on the whole
 * site — the live riverofgod.ph `/our-story` page is Lorem ipsum under
 * three real headers, and Doc 8 calls this "their strongest asset and it
 * is literally unwritten." The three beats below are built ONLY from facts
 * already confirmed by direct inspection in Doc 1 §2.1 (founding year,
 * founders' names, the Pinagbuhatan origin, the Robinsons Galleria
 * opening, the 477-church figure — flagged there as the client's own
 * claim, unverified). No detail is invented. It should still be replaced
 * with ROG's own voice before this reaches production.
 *
 * REDESIGNED 2026-09-17 (impeccable/ui-ux-pro-max/emil-design-eng pass).
 * The original laid the three beats out as three equal-width columns, each
 * under its own small-caps date kicker — a generic grid of text blobs with
 * a banned eyebrow-per-item pattern. Replaced with an editorial timeline:
 * one narrow column of large year numerals (real informational content,
 * not decorative ordinals — the years ARE the fact, which is exactly the
 * craft floor's carve-out for numbers-as-labels) beside a wide column of
 * prose, rows separated by a single hairline rule rather than three
 * separate boxes. Reads top-to-bottom like an actual history, not a
 * feature-comparison grid.
 */
const beats = [
  {
    year: '1998',
    text: (
      <>
        River of God began as the Jesus Loves the Little Children Foundation, an
        orphanage in Pinagbuhatan, Pasig, caring for street children and families with
        little else. Bishop Augusto "Chito" Sanchez Jr. and Pastor Rachel Sanchez started
        it as an act of care, not a church plant — the church grew out of that ministry,
        not the other way around.
      </>
    ),
  },
  {
    year: '2002',
    text: (
      <>
        The church proper opened at Robinsons Galleria, Ortigas Center — which is why some
        of our oldest materials still carry the name "River of God Galleria." The
        congregation has since moved to the River of God Center at Shangri-La Plaza, EDSA
        corner Shaw Boulevard, Mandaluyong.
      </>
    ),
  },
  {
    year: 'Now',
    text: (
      <>
        What started in one room is now a network of{' '}
        <strong className="font-semibold text-black">477 River of God churches and
        affiliates</strong> across the Philippines, with works in Beijing, Ulaanbaatar and
        London — every one of them still building on the same conviction that a life, and
        a city, can be made new.
      </>
    ),
  },
]

export function OurStorySection() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="light"
      aria-labelledby="our-story-heading"
      className="bg-white text-black"
    >
      <div className="mx-auto max-w-[64rem] px-6 py-24 sm:py-32">
        <h2
          id="our-story-heading"
          className="font-heading text-4xl font-black tracking-tight text-black sm:text-5xl"
        >
          From one room to a nation.
        </h2>

        <div
          className={`mt-16 divide-y divide-[#e4e4e4] border-t border-[#e4e4e4] ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {beats.map((beat) => (
            <div key={beat.year} className="grid gap-4 py-10 sm:grid-cols-[8rem_1fr] sm:gap-10">
              <p className="font-heading text-3xl font-bold tracking-tight text-black tabular-nums sm:text-4xl">
                {beat.year}
              </p>
              <p className="max-w-[62ch] leading-relaxed text-[#5c5c5c]">{beat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
