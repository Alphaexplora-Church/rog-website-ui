import { useState } from 'react'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * About — Statement of Faith. REVAMP 2026-09-25: the bone light plate
 * (rhythm after the dark Core Values poster wall), set as a numbered
 * accordion — shout numerals and titles, the article itself in the
 * whisper voice because it is the church's confession, not UI copy.
 * Heading pins on the left on desktop; one article open at a time,
 * the first open on load so the interaction reads immediately.
 *
 * Text: pasted verbatim from riverofgod.ph by Jude 2026-09-22 — doctrinal
 * copy isn't something to paraphrase, so it is reproduced exactly as
 * given. Ten articles, same order as the live site.
 */
const articles = [
  {
    title: 'Worship & Prayer',
    body: 'We Believe Worship and prayer are the avenues to know God intimately. Intimacy with God is the key to a victorious Christian life.',
  },
  {
    title: 'The Holy Scriptures',
    body: 'We Believe the Bible is the word of God written without error and is our guide for doctrinal teaching, building up our faith in Christ, strengthening our spiritual life and walk in Christ Jesus.',
  },
  {
    title: 'The Trinity',
    body: 'We Believe and Serve the one True God who revealed Himself in the Bible as three persons sharing one indivisible essence in the mystery of the Holy Trinity, that is, God the Father, God the Son, and God the Holy Spirit.',
  },
  {
    title: 'The Lord Jesus Christ',
    body: 'We Believe Jesus Christ is the unique person having two natures — the perfection of both God and Man. He was conceived of the Holy Spirit, born of Virgin Mary, lived a sinless life, suffered, was crucified and died in the place of sinful man. He was buried, resurrected and ascended bodily into Heaven, and is to return bodily to earth a second time.',
  },
  {
    title: 'The Holy Spirit',
    body: 'We Believe the Holy Spirit is God who is actively at work in the world. He dwells permanently in every Christian. He is our Counsellor, Teacher and Helper. He helps us to pray, equips and empowers us to serve God. He strengthens and molds us to be more like Christ, and protects us to guarantee our eternal life. We believe in His manifest presence today, revealing Himself in power and making Himself known experientially to every Believer who hungers and thirsts for Him. We Believe in the operation of all the gifts of the Holy Spirit as the Spirit gives.',
  },
  {
    title: "Man's Sinful Nature",
    body: 'We Believe Man is God’s creature who bears His image and was originally sinless, but through the sin of the first man Adam, all mankind sinned, became separated from God and totally unable to gain God’s favour of forgiveness and eternal life by self-effort or good works.',
  },
  {
    title: 'Salvation',
    body: 'We Believe Salvation is God’s act of forgiving sins, reconciling people to Him, and giving eternal life to those who believe in Jesus. Salvation is not a reward for good works but a free gift of God received by faith in Jesus Christ alone.',
  },
  {
    title: 'Water Baptism',
    body: 'We Believe in Water Baptism by immersion, and all who repent should be baptized in the name of the Father, and the Son, and of the Holy Ghost.',
  },
  {
    title: 'The Second Coming',
    body: 'We Believe Jesus Christ will come again to reign and to reward God’s people with eternal life with Him in the new Heaven and earth, and to judge unbelievers with eternal separation from God and suffering in hell.',
  },
  {
    title: 'The Church',
    body: 'We Believe the Church is the universal body of Christ consisting of all born again Believers in Jesus, made one by the dwelling of the Holy Spirit.',
  },
]

export function StatementOfFaithSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="statement-of-faith"
      data-plate="light"
      aria-labelledby="statement-of-faith-heading"
      className="relative scroll-mt-32 bg-bone py-24 text-abyss sm:py-32"
    >
      <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20`}>
        <div className="lg:sticky lg:top-44 lg:self-start">
          <SectionHead
            id="statement-of-faith-heading"
            tone="light"
            eyebrow={<span className="text-river">What we believe</span>}
            title={
              <>
                Statement
                <br />
                of Faith
              </>
            }
          />
          <p className="mt-6 hidden font-shout text-[clamp(5rem,10vw,9rem)] lg:block font-black leading-[0.8] tabular-nums text-abyss/[0.07]" aria-hidden="true">
            10
          </p>
        </div>

        <Reveal>
          <ol className="border-t border-abyss/15">
            {articles.map((article, i) => {
              const isOpen = open === i
              const panelId = `faith-article-${i}`
              return (
                <li key={article.title} className="border-b border-abyss/15">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group grid w-full grid-cols-[3.25rem_1fr_auto] items-center gap-4 py-6 text-left sm:grid-cols-[5.5rem_1fr_auto] sm:gap-6"
                    >
                      <span
                        className={`font-shout text-[2.4rem] font-black leading-none tabular-nums transition-colors duration-500 ease-current sm:text-[3.4rem] ${
                          isOpen ? 'text-ember-ink' : 'text-abyss/45 group-hover:text-abyss/70'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-shout text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold uppercase leading-[0.95]">
                        {article.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative flex h-10 w-10 flex-none items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-current ${
                          isOpen ? 'rotate-45 border-abyss bg-abyss text-bone' : 'border-abyss/25 group-hover:border-abyss'
                        }`}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-label={article.title}
                    className={`grid transition-[grid-template-rows] duration-500 ease-current motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    inert={!isOpen}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-[58ch] pb-8 pl-[4.25rem] font-whisper text-[clamp(1.1rem,1.5vw,1.3rem)] italic leading-[1.55] text-abyss/85 sm:pl-[7rem]">
                        {article.body}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
