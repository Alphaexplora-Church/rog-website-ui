import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * About, section 3 — Leadership bios. Matches the Figma "Bios" board shape
 * (alternating left/right layout, blob-shaped portrait frame) but the
 * copy is now the REAL text from riverofgod.ph, pasted in full by Jude
 * 2026-09-22 — replacing the earlier short paraphrased bios. Kept close to
 * verbatim rather than re-summarized, same principle as doctrinal copy:
 * this is the church's own account of its founders, not something to
 * paraphrase freely.
 *
 * ⚠ PLACEHOLDER AVATARS — same generic circle-glyph placeholder introduced
 * in TeamRosterRow.tsx (per Jude's direct feedback there), reused here at
 * blob-frame size instead of a real photo. Duplicated locally rather than
 * imported from TeamRosterRow since that component's version is sized and
 * exported only for its own grid cards; extract to a shared file if a
 * third place ends up needing it.
 */
function AvatarPlaceholder({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-[60%_40%_55%_45%/45%_55%_40%_60%] bg-[#2a2a2a] ring-1 ring-white/10 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-24 w-24 text-[#454545] sm:h-28 sm:w-28" fill="currentColor">
        <circle cx="12" cy="8.5" r="4" />
        <path d="M4 20.2C4 16.2 7.6 13.5 12 13.5s8 2.7 8 6.7c0 .4-.3.8-.8.8H4.8c-.5 0-.8-.4-.8-.8Z" />
      </svg>
    </div>
  )
}

const leaders = [
  {
    name: 'Bishop Augusto "Chito" Sanchez Jr.',
    title: 'Founder & Senior Pastor',
    bio: 'Bishop Chito is the Head of the Transformation and Revival Commission focusing on prayer for the Nation, a commission of the Philippine Council of Evangelical Churches (PCEC). He is one of the Bishops of PCEC and the convenor of the Philippine Council of Evangelical Bishops. In addition, he is appointed as the Regional Apostolic Coordinator of the Harvest International Ministry in the Philippines.\n\nHe is a revivalist by heart and is passionate about being intimately in love with Jesus Christ and the lost through evangelism and discipleship. He is at the forefront of a movement that conducts a series of free conferences and monthly revival meetings called Soaking in the River that has been running for more than ten years already. His message is clear: the genuine love that we have for Jesus will spark the great flame of transformation and revival from within ourselves, then it will spread to the entire nation of the Philippines and the rest of the world.',
  },
  {
    name: 'Pastor Rachel Sanchez',
    title: 'Senior Pastor, River of God Ortigas',
    bio: 'Pastor Rachel is a teacher by heart and loves to impart her knowledge and personal encounter with the Holy Spirit that radically changed her life. She heads ROG Supernatural Ministry, which regularly conducts trainings and workshops open to the Body of Christ. Her passion is to see the saints activated in their spiritual gifts and operate in the supernatural realm through signs, wonders, miracles and healing — all for the purpose of expanding God’s Kingdom.\n\nHer love for children led her to open an orphanage twenty years ago, now converted into a school offering free quality Christian education to qualified students regardless of race, religion or economic status. She started a movement called Women Arise, encouraging women to rise up for Christ and proclaim the gospel boldly, walking in partnership with men.',
  },
]

export function LeadershipBiosSection() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="leadership"
      data-plate="dark"
      aria-labelledby="leadership-heading"
      className="relative bg-[#161616] text-white"
    >
      <div className="mx-auto max-w-[80rem] px-6 py-24 sm:py-32">
        <h2 id="leadership-heading" className="sr-only">
          Leadership
        </h2>

        <div className="flex flex-col gap-20">
          {leaders.map((leader, i) => (
            <div
              key={leader.name}
              className={`flex flex-col items-center gap-10 sm:gap-14 ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
            >
              <AvatarPlaceholder className="h-64 w-64 sm:h-80 sm:w-80" />
              <div className="max-w-[52ch]">
                <p className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {leader.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1b7a70]">{leader.title}</p>
                {leader.bio.split('\n\n').map((para, pi) => (
                  <p key={pi} className="mt-5 leading-relaxed text-[#a6a6a6]">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p
          className={`mx-auto mt-20 max-w-[52ch] border-t border-white/10 pt-8 text-center text-sm text-[#a6a6a6] ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          Bishop Chito and Pastor Rachel have 6 children and 7 grandchildren. They reside in Pasig
          City, Metro Manila, Philippines.
        </p>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[70px] w-full sm:h-[100px]"
      >
        <path
          d="M0,60 C360,10 720,120 1080,55 C1260,25 1350,45 1440,60 L1440,130 L0,130 Z"
          fill="#232323"
        />
      </svg>
    </section>
  )
}
