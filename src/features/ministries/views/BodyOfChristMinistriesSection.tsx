import { useState } from 'react'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Ministries, section 3 — "Body of Christ Ministries". From the Figma
 * Ministries.dc.html board: ministries ROG runs for the wider Body of Christ,
 * not just Ortigas (PCEC Transformation & Revival, Supernatural Ministry,
 * Soaking in the River, Worship Mentoring, Activate, Women Arise) — copy
 * pulled verbatim from the Figma source and unchanged since.
 *
 * Not to be confused with the "Serving Ministry Heads" roster on the About
 * page, or the volunteer-recruitment "Service Ministries" section — that's
 * internal serving teams recruiting volunteers, a different concept from these
 * cross-church programmes. It sits directly ABOVE this one on the page; Jude
 * reordered Ministries.tsx to put it there, which is why this section is now
 * the last band before the footer and carries the closing wave.
 *
 * `navigation.ts` lists `/ministries/body-of-christ` as its own nav child;
 * rather than a second route duplicating this section, the `id` below lets
 * that link anchor-jump straight here. Keep the id.
 *
 * ── REWORKED 2026-09-23 ──────────────────────────────────────────────────
 * Jude: "fix also the body of christ ministries section… gandahan mo rin
 * yung design which matches the theme nung mga nirevise nating website."
 *
 * Every title, teaser and body string is byte-identical to before. What
 * changed is how they are presented, and four things were genuinely broken
 * rather than merely dated:
 *
 *   1. UNICODE GLYPHS AS BUTTONS. The carousel arrows were the literal
 *      characters "‹" and "›". Doc 9's first surviving ban is "no unicode
 *      glyphs or emoji as icons" — the same violation as the "▷" that was
 *      sitting in LiveServicesSection until today.
 *   2. THE CAROUSEL HID HALF THE CONTENT. Six ministries, three visible, and
 *      a fixed 320px step with 300px cards — so it neither filled a wide
 *      screen nor fitted a narrow one, and three of the six needed an
 *      interaction to reach. They are a responsive grid now; all six are
 *      simply there. Same call as the Upcoming Events and Watch or Listen
 *      carousels earlier today.
 *   3. THE FIRST CARD'S PHOTO NEVER LOADED. `photo-1760367121593…` returns
 *      nothing — that is now the fourth place this one dead URL has turned
 *      up (Christmas Eve event, Main Center card, the Facebook tile). Every
 *      card also falls back to a tinted panel rather than a broken frame.
 *   4. IT DID NOT MATCH THE REVISED THEME. 24px heading with no eyebrow
 *      pill, `bg-white/5` cards with no edge, Figma's asymmetric corners, a
 *      112px-tall image strip, and no stagger on entrance. All brought in
 *      line with the sections revised this week.
 *
 * PLATE: #161616, between Service Ministries' #0d0d0d above and the footer's
 * black below, so it reads as its own band against both. The closing wave is
 * the same one the Events page uses to hand off to the footer.
 */
interface Ministry {
  title: string
  teaser: string
  body: string
  photo: string
}

const ministries: Ministry[] = [
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
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section
      id="body-of-christ"
      ref={ref}
      data-plate="dark"
      aria-labelledby="bocm-heading"
      className="relative overflow-hidden bg-[#161616] text-white"
    >
      <div className="relative z-10 mx-auto max-w-[86rem] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44">
        <div className={reveal} style={{ transitionDelay: '0ms' }}>
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              color: '#8FD4C9',
              backgroundColor: 'rgb(27 122 112 / 0.18)',
              boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
            }}
          >
            Beyond Ortigas
          </span>
          <h2
            id="bocm-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Body of Christ Ministries
          </h2>
          <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-white/55 sm:text-base">
            Ministries ROG runs for the wider Body of Christ and other churches — not just
            Ortigas.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m, i) => (
            <li
              key={m.title}
              className={reveal}
              style={{ transitionDelay: `${120 + Math.min(i, 5) * 60}ms` }}
            >
              <MinistryCard ministry={m} />
            </li>
          ))}
        </ul>
      </div>

      {/* Wave divider into the footer (bg-black — see Footer.tsx). This is now
          the last content band on /ministries, so it closes the page the same
          way Home and Events close theirs. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[90px] w-full sm:h-[120px]"
      >
        <path
          d="M0,70 C240,10 480,130 720,60 C960,10 1200,120 1440,55 L1440,140 L0,140 Z"
          fill="#000000"
        />
      </svg>
    </section>
  )
}

function MinistryCard({ ministry }: { ministry: Ministry }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#1b7a70]/40 motion-reduce:transition-none">
      <div className="relative aspect-video w-full overflow-hidden">
        {imageFailed ? (
          <div
            aria-hidden="true"
            className="h-full w-full"
            style={{ background: 'linear-gradient(135deg, #161616, rgb(27 122 112 / 0.35))' }}
          />
        ) : (
          <img
            src={ministry.photo}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent"
        />
      </div>

      <div className="flex flex-grow flex-col gap-2 p-6">
        <p className="text-[11px] font-bold tracking-[0.12em] text-[#8FD4C9] uppercase">
          {ministry.teaser}
        </p>
        <h3 className="font-heading text-lg leading-snug font-bold text-white">{ministry.title}</h3>
        <p className="text-sm leading-relaxed text-white/55">{ministry.body}</p>
      </div>
    </article>
  )
}
