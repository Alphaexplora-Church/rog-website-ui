import { useRef } from 'react'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { useScrollProgress } from '../../../shared/hooks/useScrollProgress'
import { container } from '../../../shared/styles/tokens'

/**
 * About — Founders' Story. REVAMP 2026-09-25: a real timeline.
 *
 * Shape: the heading and the church's "Drinking Well" framing pin on the
 * left; on the right four milestones hang off one vertical line that fills
 * with ember as you scroll (the Current Fill). Each milestone is led by a
 * huge shout year. 1998 — the founding — is the only SOLID ember year; the
 * rest are outlined, so the eye lands on the seed first and the others
 * read as what grew from it. Rows step in and out on desktop for an
 * editorial, not-a-grid rhythm.
 *
 * Copy: real narrative from riverofgod.ph (pasted by Jude 2026-09-22),
 * including the international reach on the 477-churches milestone.
 */
const milestones = [
  {
    year: '1998',
    title: 'Jesus Loves the Little Children Foundation, Inc.',
    body: 'An orphanage for street children and children at risk in Pinagbuhatan, Pasig City — founded by Bishop Chito and Pastor Rachel, and the seed everything else grew from.',
  },
  {
    year: 'Growth',
    title: 'Riversprings School',
    body: 'The Home became a community-based Foundation sponsoring education for destitute children, plus feeding, medical, dental and calamity assistance for the poor of Pinagbuhatan.',
  },
  {
    year: '2002',
    title: 'River of God — Galleria',
    body: 'To reach people of every age and background, Bishop Chito and Pastor Rachel planted River of God — Galleria at Crowne Plaza Hotel, Robinsons Galleria, Ortigas Center.',
  },
  {
    year: 'Today',
    title: '477 churches & affiliates',
    body: 'Overseen across the Philippines and abroad — including Beijing, China; Ulaanbaatar, Mongolia; and London, UK.',
  },
]

export function FoundersStorySection() {
  const fill = useRef<HTMLDivElement>(null)
  const track = useScrollProgress<HTMLOListElement>((p) => {
    if (fill.current) fill.current.style.transform = `scaleY(${p})`
  })

  return (
    <section
      id="founders-story"
      data-plate="dark"
      aria-labelledby="founders-story-heading"
      className="relative scroll-mt-32 overflow-hidden bg-abyss pt-32 pb-24 text-bone sm:pt-40 sm:pb-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-[10%] -left-[20%] h-[70%] w-[70%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-river)_45%,transparent),transparent_65%)] blur-[40px]" />
      <div className={`${container} relative grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
        <div className="lg:sticky lg:top-44 lg:self-start">
          <SectionHead
            id="founders-story-heading"
            eyebrow="Since 1998"
            title={
              <>
                Founders&rsquo;
                <br />
                Story
              </>
            }
            lead={
              <>
                The church is a &ldquo;Drinking Well&rdquo; for those who are weary, hungry and
                thirsty for God, and to experience the manifest presence of the Holy Spirit — a
                calling that started with one children&rsquo;s home and grew, year by year, into
                the family it is today.
              </>
            }
          />
        </div>

        <ol ref={track} className="relative">
          <div aria-hidden="true" className="absolute top-3 bottom-3 left-0 w-px bg-bone/15">
            <div ref={fill} className="h-full w-full origin-top scale-y-0 bg-ember" />
          </div>
          {milestones.map((m, i) => {
            const founding = i === 0
            return (
              <Reveal
                as="li"
                key={m.title}
                className={`relative pb-16 pl-8 last:pb-0 sm:pl-14 ${i % 2 === 1 ? 'lg:ml-[14%]' : ''}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-[0.9em] -left-[5px] h-[11px] w-[11px] rounded-full ${founding ? 'bg-ember' : 'border border-bone/50 bg-abyss'}`}
                />
                <p
                  className={`font-shout text-[clamp(4.5rem,13vw,10rem)] font-black uppercase leading-[0.8] tracking-[-0.01em] ${
                    founding
                      ? 'text-ember'
                      : 'text-transparent [-webkit-text-stroke:1.5px_color-mix(in_srgb,var(--color-bone)_55%,transparent)]'
                  }`}
                >
                  {m.year}
                </p>
                <h3 className="mt-5 max-w-[22ch] font-shout text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold uppercase leading-[0.98]">
                  {m.title}
                </h3>
                <p className="mt-4 max-w-[52ch] leading-relaxed text-bone/75">{m.body}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
