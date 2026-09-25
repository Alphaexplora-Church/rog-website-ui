import { useState } from 'react'
import { Reveal, SectionHead, WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * Ministries, section 4 — "Body of Christ Ministries". REVAMP 2026-09-25.
 *
 * Ministries ROG runs for the wider Body of Christ, not just Ortigas (PCEC
 * Transformation & Revival, Supernatural Ministry, Soaking in the River,
 * Worship Mentoring, Activate, Women Arise) — copy verbatim from the Figma
 * source. Not the #SavedToServe serving teams above (those recruit
 * volunteers inside ROG).
 *
 * `navigation.ts` lists `/ministries/body-of-christ` as its own nav child;
 * that route renders the Ministries page and scrolls to the `id` below
 * (see Ministries.tsx). Keep the id.
 *
 * Shape: the page's LIGHT PLATE — a numbered two-column index on bone, so
 * it reads nothing like the river-band row list above it. Big ember-ink
 * numeral, shout title, the teaser as ROG's italic pill, the body in plain
 * text, and a small portrait thumbnail that blooms on hover. History worth
 * keeping: the old carousel hid half the six behind arrows (all six are
 * simply listed now), and the first photo URL (photo-1760367121593…) was
 * dead and has been swapped. Every thumbnail has a textured ground, so a
 * failed load never shows an empty frame.
 */
interface BodyMinistry {
  title: string
  teaser: string
  body: string
  photo: string
}

const ministries: BodyMinistry[] = [
  {
    title: 'PCEC Transformation & Revival',
    teaser: 'Events, activities & testimonies',
    body: 'Links out to a Facebook page for events, activities, and testimonies from the Commission.',
    // Was photo-1760367121593-97b9a02bbd65 — that URL returns nothing.
    photo:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Supernatural Ministry / Prophetic Workshops',
    teaser: 'Founded 2005 by Pastor Rachel Sanchez',
    body: 'Has its own Vision and Mission statement, with a supporting scripture: Ephesians 2:19–20.',
    photo:
      'https://images.unsplash.com/photo-1604882737206-8a000c03d8fe?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Soaking in the River',
    teaser: 'Monthly gathering for the Body of Christ',
    body: 'Focused on prayer for the nation and encountering the Holy Spirit.',
    photo:
      'https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Worship Mentoring',
    teaser: 'Running since 2014',
    body: 'Equips worship teams — prophetic worship, worship leading, skills training, and song-writing.',
    photo:
      'https://images.unsplash.com/photo-1740650511388-f693ce80016c?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Activate',
    teaser: 'Annual conference — parent brand of Activate12',
    body: 'Four stated goals around the Holy Spirit, the supernatural, and revival. This year’s conference lives at Activate12.',
    photo:
      'https://images.unsplash.com/photo-1600019246742-3b66977db044?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Women Arise',
    teaser: 'Gathering & empowering women',
    body: 'Has its own Vision and Mission statement, focused on gathering and empowering women.',
    photo:
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80',
  },
]

export function BodyOfChristMinistriesSection() {
  return (
    <section
      id="body-of-christ"
      data-plate="light"
      aria-labelledby="bocm-heading"
      className="relative isolate scroll-mt-16 overflow-hidden bg-bone py-24 text-abyss sm:py-32"
    >
      <WaveMark
        className="pointer-events-none absolute -right-[12%] -top-[4%] -z-10 h-auto w-[60vw] max-w-[900px] text-abyss/[0.05]"
        strokeWidth={3}
      />
      <div className={container}>
        <SectionHead
          id="bocm-heading"
          tone="light"
          eyebrow="Beyond Ortigas"
          title={
            <>
              Body of Christ
              <br />
              ministries
            </>
          }
          lead="Ministries ROG runs for the wider Body of Christ and other churches — not just Ortigas."
        />

        <ol className="mt-16 grid border-t border-abyss/15 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          {ministries.map((m, i) => (
            <Reveal
              as="li"
              key={m.title}
              delay={(i % 2) * 90}
              className="border-b border-abyss/15"
            >
              <Entry ministry={m} index={i} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Entry({ ministry, index }: { ministry: BodyMinistry; index: number }) {
  const [failed, setFailed] = useState(false)

  return (
    <article className="group grid grid-cols-[minmax(0,1fr)_5.5rem] gap-6 py-10 sm:grid-cols-[4.5rem_minmax(0,1fr)_7rem] sm:gap-8">
      <p
        aria-hidden="true"
        className="hidden font-shout text-[3.5rem] font-black leading-[0.8] tabular-nums text-ember-ink sm:block"
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      <div className="min-w-0">
        <p className="font-shout text-sm font-bold tabular-nums text-ember-ink sm:hidden">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-1 font-shout text-[clamp(1.9rem,3vw,2.6rem)] font-extrabold uppercase leading-[0.92] text-balance sm:mt-0">
          {ministry.title}
        </h3>
        <span className="mt-4 inline-flex rounded-full border border-abyss/30 px-3 py-[0.2rem] text-[0.82rem] font-medium italic leading-snug text-abyss/80">
          {ministry.teaser}
        </span>
        <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-abyss/75">{ministry.body}</p>
      </div>

      <div
        aria-hidden="true"
        className="duotone relative aspect-[4/5] w-full self-start overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0e5f68, #06131b 85%)' }}
      >
        {!failed && (
          <img
            src={ministry.photo}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
          />
        )}
        <WaveMark className="absolute bottom-3 left-3 h-3 w-10 text-bone/50" strokeWidth={7} />
        <span className="grain absolute inset-0" />
      </div>
    </article>
  )
}
