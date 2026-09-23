import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * About, section 4 — What We Believe.
 *
 * ⚠ HEADINGS ONLY, NOT FINAL PARAGRAPHS. Doc 8 §5 records `/about/beliefs`
 * as "7 doctrinal headings, already written" on the live site — meaning
 * the full paragraph text exists there, it just wasn't transcribed into
 * any project doc during discovery. The seven headings below (God,
 * Revelation, Mankind, the Fall, Salvation, the Church, Resurrection) are
 * confirmed by Doc 1 §2.1 ("Doctrine is standard evangelical across seven
 * headings"). The one-line descriptor under each is a plain, generic
 * summary of what that heading conventionally covers in evangelical
 * statements of faith — NOT ROG's actual doctrinal language. Before
 * launch, pull the real paragraph text from riverofgod.ph's own
 * `/what-we-believe` page (or ask ROG directly) and replace every
 * descriptor here; doctrinal copy is not something to paraphrase freely.
 *
 * REDESIGNED 2026-09-17 (impeccable/ui-ux-pro-max/emil-design-eng pass),
 * two rounds of changes now folded into one:
 *
 * 1. (First pass) Cards badged each heading with its first letter, and two
 *    of seven collided — "Revelation" and "Resurrection" both start with
 *    R, rendering the identical glyph on two different tiles.
 * 2. (This pass) The card-grid itself is gone. Seven same-size boxes of
 *    icon + heading + text is exactly the "lazy container" pattern the
 *    craft floor names directly — "cards are the lazy container; nested
 *    cards are always wrong." Rebuilt as a real `<dl>` definition list:
 *    term and definition, wide column of prose beside a narrower column of
 *    headings, rows separated by a hairline rule. This is also a genuine
 *    accessibility upgrade over the card version — a definition list gives
 *    screen readers the term/definition relationship directly instead of
 *    leaving it to visual proximity inside a `<div>`.
 */
const beliefs = [
  { heading: 'God', summary: 'One God, eternally existing in three persons.' },
  { heading: 'Revelation', summary: "Scripture as God's inspired, authoritative word." },
  { heading: 'Mankind', summary: 'People made in God’s image, for relationship with Him.' },
  { heading: 'The Fall', summary: 'Sin’s entry into the world and its consequence for all.' },
  { heading: 'Salvation', summary: 'New life through faith in Jesus Christ alone.' },
  { heading: 'The Church', summary: 'The body of believers, gathered to worship and serve.' },
  { heading: 'Resurrection', summary: "Christ's bodily resurrection and the hope it secures." },
]

export function BeliefsSection() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="light"
      aria-labelledby="beliefs-heading"
      className="bg-white text-black"
    >
      <div className="mx-auto max-w-[64rem] px-6 py-24 sm:py-32">
        <h2
          id="beliefs-heading"
          className="font-heading text-4xl font-black tracking-tight text-black sm:text-5xl"
        >
          Seven convictions, one gospel.
        </h2>

        <dl
          className={`mt-16 divide-y divide-[#e4e4e4] border-t border-[#e4e4e4] ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {beliefs.map((b) => (
            <div key={b.heading} className="grid gap-2 py-8 sm:grid-cols-[13rem_1fr] sm:gap-10">
              <dt className="font-heading text-2xl font-bold text-black">{b.heading}</dt>
              <dd className="max-w-[62ch] leading-relaxed text-[#5c5c5c]">{b.summary}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
