import { useEffect, useState } from 'react'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Ministries, section 4 — "Service Ministries" (volunteer recruitment).
 * NOT part of the Figma Ministries.dc.html board — this is real copy Jude
 * pasted from riverofgod.ph's own recruitment page ("#SAVEDTOSERVE"),
 * distinct from Body of Christ Ministries above (that section is
 * cross-church programs; this one is internal serving teams recruiting
 * volunteers, each with a named contact and phone number).
 *
 * All contact names, phone numbers, descriptions, taglines and hashtags
 * below are UNCHANGED from the authoritative version — including the two
 * reconciliations against the official cards ("Carissa Traigo", one r; and
 * "Nica Moreno" rather than "Veronica Moreno", flagged then as an inference
 * since Nica is a common nickname for Veronica). About's Serving Ministry
 * Heads roster mirrors these.
 *
 * ── REVAMPED 2026-09-23 ──────────────────────────────────────────────────
 * Jude: "masyado siyang makalat, too much wording, not enough color, it's
 * too pale, add some placeholder pictures." All four were true:
 *
 *   1. MAKALAT / TOO MUCH WORDING. Eight cards each rendered a full ~90-word
 *      description PLUS a tagline PLUS contact PLUS hashtags, all at once —
 *      roughly 800 words of body copy in a single viewport. No word has been
 *      deleted; the long copy now lives behind a tap (progressive
 *      disclosure), and the card face carries a one-line blurb compressed
 *      from each ministry's OWN description. Those blurbs are compressions,
 *      never new claims — Creative Arts' names its three divisions because
 *      its own description names them.
 *   2. TOO PALE. Every card was `bg-white/5` on `#232323` — one flat wash,
 *      eight times.
 *   3. NOT ENOUGH COLOUR. The previous version's own comment justified the
 *      teal-only palette by citing "Doc 9's 'black is primary, teal is the
 *      one allowed accent' rule". That rule is not in Doc 9 — Doc 9 §4
 *      actually calls the current palette "an explicitly placeholder
 *      palette, not designed work". The teal-only rule is tokens.ts's own
 *      ACCENT comment, a code convention. Under Doc 9 §2 precedence 1 ("the
 *      brief wins") Jude's instruction outranks a code comment, and
 *      riverofgod.ph itself gives each serving ministry its own colour — so
 *      each one gets a hue here.
 *   4. NO PICTURES. Added — see the placeholder warning below.
 *
 * COLOURS ARE INLINE `style`, NOT TAILWIND CLASSES, deliberately. Tailwind
 * only emits utilities whose exact class string it has already seen in the
 * project, so eight brand-new `from-[#…]` pairs would render as nothing in
 * the running dev server until it restarts — the one thing this pass exists
 * to fix would be invisible. Inline style bypasses the compiler and is the
 * same escape hatch tokens.ts uses for textH1.
 *
 * ⚠ THE PHOTOS ARE PLACEHOLDERS AND TWO MINISTRIES SHARE ONE. They are
 * stock Unsplash frames already shipping elsewhere in this codebase, chosen
 * by looking at them rather than trusting a filename (for the record,
 * ServiceTimesSection's "Sunday Worship" image is a hippopotamus). No stock
 * frame here honestly reads as River Kids, so it reuses the congregation
 * frame rather than passing off a stock photo of someone else's children as
 * ROG's. Every one of these wants a real ROG photo of the actual team; that
 * swap is the `image:` field and nothing else.
 *
 * Doc 9 obligations applied: eyebrow pill above the H2 (§4C), double-bezel
 * shells (§4A), `py-24`+ section padding, hairline rings rather than 1px
 * grey borders, custom cubic-bezier on every transition, reduced-motion
 * honoured, tap targets over 44px, and no hover-only affordance — each card
 * is a real `<button>`, so touch and keyboard reach the detail exactly the
 * way a mouse does.
 */

const PHOTO_CONGREGATION =
  'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&q=80&w=900'
const PHOTO_HEADPHONES =
  'https://images.unsplash.com/photo-1511806754518-53bada35f930?auto=format&fit=crop&q=80&w=900'
const PHOTO_STAGE_LIGHTS =
  'https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?auto=format&fit=crop&q=80&w=900'
const PHOTO_WORSHIP_WARM =
  'https://images.unsplash.com/photo-1740650511388-f693ce80016c?auto=format&fit=crop&q=80&w=900'
const PHOTO_SEASONED =
  'https://images.unsplash.com/photo-1504004030892-d06adf9ffbcf?auto=format&fit=crop&q=80&w=900'
const PHOTO_EMBRACE =
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=900'
const PHOTO_HORIZON =
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=900'

interface Ministry {
  title: string
  /** One line for the card face, compressed from this ministry's own description. */
  blurb: string
  description: string
  tagline: string
  contact: string
  phone: string
  hashtag: string
  image: string
  /** Deep and light ends of this ministry's hue. */
  tint: [string, string]
}

const ministries: Ministry[] = [
  {
    title: 'Ushering',
    blurb: 'Order, security and a warm welcome at every service.',
    description:
      'The Ushering Ministry is driven by their vision "to love God and serve His people". Their mission to keep and maintain order and security in the church is one way they do to serve the purpose. Differences in the strength of each member keeps the ministry balanced. The increasing passion in the hearts of people across all ages to serve through this ministry has been one of their core strength.',
    tagline:
      "If you love God and it's your desire to serve His people, this may be an open door for you to serve Jesus.",
    contact: 'Erika Garcia',
    phone: '09338112473',
    hashtag: '#Ushering',
    image: PHOTO_CONGREGATION,
    tint: ['#B45309', '#FCD34D'],
  },
  {
    title: 'Media and Production',
    blurb: 'Graphics, photography, videography and live broadcast.',
    description:
      "We support ministries in communicating their message through quality presentations, graphic design, photography, videography, and live broadcast, while social media is our primary method for making noise. Our purpose is to relay God's message in today's high-tech society, in this creative and innovative generation. The team is also responsible for communicating updates, information, and changes to the ROG Community through the creation of online collaterals and other related documents.",
    tagline:
      "If you're praying for God to use your creative talents, this may be an open door for you to serve Jesus.",
    contact: 'Joy Mallari',
    phone: '09972249914',
    hashtag: '#MediaProduction #RMP #MediaforJesus',
    image: PHOTO_HEADPHONES,
    tint: ['#0E7490', '#67E8F9'],
  },
  {
    title: 'Creative Arts',
    blurb: 'Dance and banner, prophetic painting, performing arts.',
    description:
      'The Creative Arts Ministry of River of God has three divisions namely FIRESTARTERS (dance and banner), VISIONCASTERS (prophetic painting), and TRAILBLAZERS (performing arts). To love God and disciple His people through arts is the main thrust of this ministry. Our mission is to evangelize the lost through arts and establish them in the Christian faith, to usher God’s people in worship, and equip them to enhance their artistic skills and empower them to equip others.',
    tagline: "ROG's serving ministries are in need of committed and available volunteers!",
    contact: 'Jieyan Antonio',
    phone: '09947498070',
    hashtag: '#CreativeArts',
    image: PHOTO_STAGE_LIGHTS,
    tint: ['#A21CAF', '#F0ABFC'],
  },
  {
    title: 'Worship Team',
    blurb: 'Ushering people into spirit-led, prophetic worship.',
    description:
      'More than just a team, the River Worship is a family dedicated to honor and serve God using our skills and talents through music. Our aim is to usher people to spirit-led worship and minister to their thirst for God’s presence through prophetic worship. Our mission is to awaken and equip the hearts of worshippers, for we long to see the Body of Christ worshipping the Father in Spirit and in Truth.',
    tagline: 'Praying to serve in the Worship Team?',
    contact: 'Olga Lomuntad',
    phone: '0928487771',
    hashtag: '#RiverWorship',
    image: PHOTO_WORSHIP_WARM,
    tint: ['#6D28D9', '#C4B5FD'],
  },
  {
    title: 'River Kids Teachers',
    blurb: 'Where fun meets faith — from playtime to purpose.',
    description:
      'River Kids Ministry is a place where fun meets faith. We believe that every moment — from games and laughter to lessons and prayer — can lead a child closer to Jesus. Our heart is to guide children from simple playtime to discovering their God-given purpose. Through Bible-based teaching, creative activities, worship, and meaningful relationships, we help kids grow in character, confidence, and Christ.',
    tagline:
      'From playtime to purpose, walk with River Kids as they learn to follow Jesus wholeheartedly.',
    contact: 'Aprile Liwanag',
    phone: '09178320417',
    hashtag: '#RiverKidsTeachers',
    image: PHOTO_CONGREGATION,
    tint: ['#C2410C', '#FDBA74'],
  },
  {
    title: 'River Families',
    blurb: 'Five life stages, one connected family.',
    description:
      'River Families Ministry is a vibrant community that embraces every stage of family life. At its core are five life stages — River Kids, River Youth, Young Adults, Adults, and Seasoned — each representing a unique season of growth and discipleship. Together, these layers form a loving and connected ministry where every person and every family can belong, be supported, and thrive in faith within the community.',
    tagline:
      'If you have a heart to walk alongside families, mentor the next generation, or help create spaces where every life stage can grow in Christ, this may be your opportunity to serve.',
    contact: 'Nestor and Sol Mendoza',
    phone: '09176510919',
    hashtag: '#RiverFamilies',
    image: PHOTO_SEASONED,
    tint: ['#047857', '#6EE7B7'],
  },
  {
    title: 'Discipleship',
    blurb: 'Connecting people into the ROG spiritual family.',
    description:
      'Loving God and making disciples are essential to the vision of the Discipleship Team. We aim to equip and empower people to do the great commission. Our mission is to help VIPs and ROG members to grow in their relationship with God by connecting them to the River of God Spiritual Family, and eventually getting them into discipleship. Our aim is to encourage leaders to raise more leaders who are in love with God and are passionate in making disciples.',
    tagline:
      'If you love God and you have a heart to make disciples, then this may be an open door for you to serve Jesus.',
    contact: 'Carissa Traigo',
    phone: '09171163975',
    hashtag: '#Discipleship',
    image: PHOTO_EMBRACE,
    tint: ['#1D4ED8', '#93C5FD'],
  },
  {
    title: 'Cross Cultural',
    blurb: 'Completing the Great Commission, locally and globally.',
    description:
      "River Cross-Cultural Ministry is God's voice, bringing God's people back to God's agenda. We exist to take part in completing the remaining task of the Great Commission through equipping, edifying and mobilizing churches, both locally and globally.",
    tagline: 'Do you have the heart of Jesus for the lost? Do you feel called to missions?',
    contact: 'Nica Moreno',
    phone: '09616058244',
    hashtag: '#CrossCultural #ROGMissions #GreatCommission',
    image: PHOTO_HORIZON,
    tint: ['#1b7a70', '#8FD4C9'],
  },
]

export function ServiceMinistriesSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex === null ? null : ministries[openIndex]

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section
      ref={ref}
      id="service-ministries"
      data-plate="dark"
      aria-labelledby="service-ministries-heading"
      className="bg-[#0d0d0d] text-white"
    >
      <div className="mx-auto max-w-[86rem] px-6 py-24 sm:py-32">
        <div className={`${revealBase} ${shown ? revealShown : revealHidden}`}>
          {/* Doc 9 §4C eyebrow pill. */}
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              color: '#8FD4C9',
              backgroundColor: 'rgb(27 122 112 / 0.18)',
              boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
            }}
          >
            #SavedToServe
          </span>
          <h2
            id="service-ministries-heading"
            className="mt-5 font-heading text-3xl font-bold sm:text-5xl"
          >
            Service Ministries
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-[#a6a6a6] sm:text-base">
            Eight teams, always in need of committed volunteers. Being under discipleship at ROG is
            a requirement to join any of them.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((m, i) => (
            <li
              key={m.title}
              className={`${revealBase} ${shown ? revealShown : revealHidden}`}
              style={{ transitionDelay: `${120 + Math.min(i, 7) * 60}ms` }}
            >
              <MinistryCard ministry={m} index={i} onOpen={() => setOpenIndex(i)} />
            </li>
          ))}
        </ul>
      </div>

      {open && <MinistryDialog ministry={open} onClose={() => setOpenIndex(null)} />}
    </section>
  )
}

/**
 * Poster card. Double-bezel per Doc 9 §4A — the outer shell carries the
 * ministry's gradient and a hairline edge, the inner core is the photo at a
 * tighter radius. The whole card is one `<button>` rather than a hover
 * target, because Doc 9 bans hover-only affordances: touch is the majority
 * case for this audience.
 */
function MinistryCard({
  ministry,
  index,
  onOpen,
}: {
  ministry: Ministry
  index: number
  onOpen: () => void
}) {
  const [deep, light] = ministry.tint

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${ministry.title} — read more and how to join`}
      className="group block h-full w-full rounded-3xl p-[1.5px] text-left transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
      style={{ background: `linear-gradient(160deg, ${deep}, ${light}55 55%, transparent)` }}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-[#141414]">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={ministry.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
          />
          {/* The hue lives here — a wash over the photo, so cards that share
              a stock frame still read as different ministries. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, #141414 6%, ${deep}CC 45%, ${light}40 100%)`,
            }}
          />
          <span
            className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-black uppercase"
            style={{ backgroundColor: light }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-grow flex-col p-5">
          <h3 className="font-heading text-lg leading-tight font-bold text-white">
            {ministry.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#a6a6a6]">{ministry.blurb}</p>

          <span
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] uppercase"
            style={{ color: light }}
          >
            How to join
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  )
}

/**
 * The full copy, on demand. Everything the old card showed at once lives
 * here — description, tagline, contact, hashtags — so the trim lost nothing.
 * The phone is a real `tel:` link, which the flat text version never was, so
 * a phone can dial it in one tap.
 */
function MinistryDialog({ ministry, onClose }: { ministry: Ministry; onClose: () => void }) {
  const [entered, setEntered] = useState(false)
  const [deep, light] = ministry.tint

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ministry.title}
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        style={{ opacity: entered ? 1 : 0 }}
      />

      <div
        className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-[1.5px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:rounded-3xl"
        style={{
          background: `linear-gradient(160deg, ${deep}, ${light}55 55%, transparent)`,
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
        }}
      >
        <div className="rounded-t-[1.4rem] bg-[#141414] sm:rounded-[1.4rem]">
          <div className="relative h-32 w-full overflow-hidden rounded-t-[1.4rem]">
            <img
              src={ministry.image}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, #141414 8%, ${deep}CC 55%, ${light}40 100%)`,
              }}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/70"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="font-heading text-2xl font-bold text-white">{ministry.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#a6a6a6]">{ministry.description}</p>
            <p className="mt-4 text-sm font-semibold" style={{ color: light }}>
              {ministry.tagline}
            </p>

            <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: `${deep}26` }}>
              <p className="text-[10px] font-bold tracking-[0.18em] text-[#a6a6a6] uppercase">
                To join, contact
              </p>
              <p className="mt-1 font-heading text-base font-bold text-white">{ministry.contact}</p>
              <a
                href={`tel:${ministry.phone}`}
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:underline"
                style={{ color: light }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 5c0 8.284 6.716 15 15 15a2 2 0 002-2v-2a1 1 0 00-.76-.97l-3.6-.9a1 1 0 00-1 .27l-1.1 1.1a12 12 0 01-5.44-5.44l1.1-1.1a1 1 0 00.27-1l-.9-3.6A1 1 0 007.6 3H5.6A2 2 0 003 5z" />
                </svg>
                {ministry.phone}
              </a>
            </div>

            <p className="mt-4 text-xs text-[#737373]">{ministry.hashtag}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
