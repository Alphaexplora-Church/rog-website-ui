import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
  revealBase,
  revealDelay1,
  revealHidden,
  revealShown,
} from '../../../shared/styles/tokens'

/**
 * About, section 2 — Founders' Story timeline. Matches the Figma
 * WhoWeAre.dc.html "Founders' Story" board shape (left column heading +
 * prose, right column a 2x2 milestone grid). Milestone copy UPDATED
 * 2026-09-22 with the real narrative Jude pasted from riverofgod.ph —
 * the intro paragraph is now their own "Drinking Well" framing, and the
 * 477-churches milestone now names the international reach (Beijing,
 * Ulaanbaatar, London) the real site includes.
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
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="founders-story"
      data-plate="dark"
      aria-labelledby="founders-story-heading"
      className="relative bg-[#232323] text-white"
    >
      <div className="mx-auto max-w-[86rem] px-6 py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
          <div>
            <h2
              id="founders-story-heading"
              className="text-balance font-heading text-3xl leading-[1.1] font-bold sm:text-4xl"
            >
              <span className="block overflow-hidden pb-[0.1em]">
                <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
                  Founders&rsquo; Story
                </span>
              </span>
            </h2>
            <p
              className={`mt-6 max-w-[42ch] leading-relaxed text-[#a6a6a6] ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
            >
              The church is a &ldquo;Drinking Well&rdquo; for those who are weary, hungry and
              thirsty for God, and to experience the manifest presence of the Holy Spirit — a
              calling that started with one children&rsquo;s home and grew, year by year, into
              the family it is today.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
          >
            {milestones.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border border-white/10 bg-[#161616] p-7"
              >
                <p className="text-xs font-bold tracking-[0.14em] text-[#1b7a70] uppercase">
                  {m.year}
                </p>
                <p className="mt-3 font-heading text-lg font-bold text-white">{m.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#a6a6a6]">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[70px] w-full sm:h-[100px]"
      >
        <path
          d="M0,55 C360,120 720,5 1080,60 C1260,90 1350,78 1440,60 L1440,130 L0,130 Z"
          fill="#161616"
        />
      </svg>
    </section>
  )
}
