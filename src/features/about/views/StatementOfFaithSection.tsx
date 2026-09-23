import { useState } from 'react'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * About, section 8 — Statement of Faith. Real doctrinal text UPDATED
 * 2026-09-22, pasted verbatim from riverofgod.ph by Jude — replacing the
 * earlier bracketed placeholder note (doctrinal copy isn't something to
 * paraphrase, so this is reproduced as given rather than edited for web
 * tone). Ten articles, same order as the live site.
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
  const { ref, shown } = useInView<HTMLElement>()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      ref={ref}
      id="statement-of-faith"
      data-plate="dark"
      aria-labelledby="statement-of-faith-heading"
      className="relative bg-[#232323] text-white"
    >
      <div className="mx-auto max-w-[80rem] px-6 py-24 sm:py-32">
        <h2
          id="statement-of-faith-heading"
          className="font-heading text-3xl font-bold sm:text-4xl"
        >
          Statement of Faith
        </h2>

        <div
          className={`mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {articles.map((article, i) => {
            const isOpen = open === i
            return (
              <div key={article.title} className="border-b border-white/10 py-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="font-heading text-lg font-bold text-white">
                    {article.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-2xl font-light text-[#1b7a70] transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-[#a6a6a6]">
                    {article.body}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[60px] w-full sm:h-[90px]"
      >
        <path
          d="M0,50 C360,100 720,0 1080,45 C1260,68 1350,58 1440,45 L1440,130 L0,130 Z"
          fill="#000000"
        />
      </svg>
    </section>
  )
}
