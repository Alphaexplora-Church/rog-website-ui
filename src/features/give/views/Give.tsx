import { useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useGiveViewModel, type GiveKey } from '../viewModels/useGiveViewModel'

/**
 * Give (`/give`) — the route navigation.ts has pointed at since the nav was
 * built; until now it fell through to App.tsx's "Coming next" stub.
 *
 * FROM JUDE'S REFERENCE, 2026-09-23 ("yung sa give, make it like this…
 * palitan mo lang yung image tsaka yung color"). Layout, accordion and modal
 * flow are the reference's, unchanged. Three things had to change:
 *
 *   1. PALETTE. The reference is built on `gold`, `gold-light`,
 *      `royal-purple`, `royal-purple-dark` — Tailwind theme colours from
 *      that project's config. This project deleted index.css and its
 *      `@theme` block (see tokens.ts), so those class names would compile to
 *      nothing and the page would render as unstyled dark-on-dark. Every one
 *      is replaced with this site's literal teal pair, `#1b7a70` and
 *      `#8FD4C9`, the same way every other section here writes colour.
 *   2. THE SECOND ACCENT. The reference separates its two cards by hue
 *      (gold vs purple). This site has exactly one accent, so the cards
 *      separate the way Button.tsx already separates primary from secondary:
 *      by FILL. Church is a solid teal CTA, Alphaexplora is an outlined one.
 *   3. PHOTOGRAPHY. The church card uses an Unsplash URL already shipping
 *      elsewhere in this codebase, picked by looking at it rather than
 *      trusting a filename. The tech card keeps the reference's own
 *      `/assets/Photos/tech_team1.png` on Jude's call ("use the same image
 *      ng sinend kong code") — that file is NOT in `public/` yet, so it
 *      404s until it is added at `public/assets/Photos/tech_team1.png`.
 *      A failed load falls back to a plain panel rather than a broken-image
 *      icon; drop the file in and the fallback disappears on its own.
 *
 * FRAMER-MOTION IS USED HERE, matching the reference. That is consistent
 * with this codebase: HeroSection.tsx already imports it, and it is a
 * declared dependency. The rest of the site's scroll reveals use the
 * `useInView` + CSS-transition system in tokens.ts; this page is the
 * exception because the reference's accordion and modal exit animation
 * (AnimatePresence) genuinely need it.
 *
 * ⚠ AFTER THIS FILE LANDS, RESTART THE DEV SERVER. It introduces a lot of
 * utility classes that appear nowhere else in the project, and Vite's
 * running Tailwind cache only emits class names it has already seen. A cold
 * build compiles all of them — this was verified against tailwindcss 4.3.3
 * directly — but the running server will show half of them missing until it
 * is restarted.
 */
export default function Give() {
  const { activeModal, setActiveModal, expandedCard, setExpandedCard, option } =
    useGiveViewModel()

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.8, ease: [0.19, 1, 0.22, 1] as const },
    }),
  }

  return (
    <div
      data-plate="dark"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black"
    >
      {/* Ambience — the reference's three blobs, re-tinted to the one accent
          this site allows. */}
      <motion.div
        aria-hidden="true"
        style={{ y: y1 }}
        className="pointer-events-none absolute top-0 left-1/4 h-[35rem] w-[35rem] rounded-full bg-[#1b7a70]/15 blur-[120px] sm:h-[60rem] sm:w-[60rem] sm:blur-[180px]"
      />
      <motion.div
        aria-hidden="true"
        style={{ y: y2 }}
        className="pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#8FD4C9]/10 blur-[100px] sm:h-[50rem] sm:w-[50rem] sm:blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[25rem] w-[25rem] rounded-full bg-[#1b7a70]/5 blur-[100px] sm:h-[40rem] sm:w-[40rem]"
      />

      <section className="relative z-10 flex-grow px-4 pt-32 pb-24 sm:px-6 sm:pt-40 sm:pb-32 md:pt-48 md:pb-40">
        <div className="mx-auto w-full max-w-[86rem]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="mb-16 text-center sm:mb-24"
          >
            <div className="mb-6 flex items-center justify-center gap-3 sm:gap-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-px bg-gradient-to-r from-transparent to-[#8FD4C9]"
              />
              <span className="text-[10px] font-black tracking-[0.3em] text-[#8FD4C9] uppercase sm:text-xs">
                Worship Through Giving
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-px bg-gradient-to-l from-transparent to-[#8FD4C9]"
              />
            </div>

            <h1 className="mb-6 font-heading text-4xl leading-[1.1] font-black tracking-tighter text-white sm:text-6xl md:text-7xl">
              Generosity{' '}
              <span className="relative inline-block bg-gradient-to-r from-[#1b7a70] to-[#8FD4C9] bg-clip-text text-transparent italic">
                Changes
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#8FD4C9] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </span>{' '}
              Everything.
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mx-auto max-w-2xl text-sm font-light text-[#a6a6a6] sm:text-base"
            >
              Your seeds of generosity cultivate eternal impact. Choose how you&apos;d like to sow
              today.
            </motion.p>
          </motion.div>

          {/* Accordion */}
          <div className="flex min-h-[500px] flex-col items-stretch gap-4 sm:gap-6 lg:min-h-[650px] lg:flex-row">
            <GiveCard
              index={0}
              cardKey="church"
              variants={cardVariants}
              expanded={expandedCard === 'church'}
              onExpand={setExpandedCard}
              onOpen={setActiveModal}
              image="https://images.unsplash.com/photo-1740650511388-f693ce80016c?auto=format&fit=crop&q=80&w=1200"
              imageAlt="River of God congregation in worship"
              eyebrow="Direct to River of God"
              title="Support the Mission"
              body="Your tithes and offerings fuel our local ministries, community reach, and church operations. Every seed sown makes an eternal impact."
              cta="Give to Church"
              ctaStyle="solid"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              }
            />

            <GiveCard
              index={1}
              cardKey="tech"
              variants={cardVariants}
              expanded={expandedCard === 'tech'}
              onExpand={setExpandedCard}
              onOpen={setActiveModal}
              image="/assets/Photos/tech_team1.png"
              imageAlt="The Alphaexplora team behind this site"
              eyebrow="Buy us Coffee"
              title="Fuel the Tech Team"
              body="Support the developers and creators behind the River of God digital experience. Keep the servers running and the code flowing."
              cta="Support Tech Team"
              ctaStyle="outline"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 8h1a4 4 0 014 4v1a4 4 0 01-4 4h-1 M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3 M10 1v3 M14 1v3"
                />
              }
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && option && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={option.title}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0d0d0d] shadow-2xl sm:rounded-[2.5rem]"
            >
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#a6a6a6] transition-all hover:bg-white/10 hover:text-white sm:top-6 sm:right-6"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="p-6 sm:p-8 md:p-12">
                <div className="mb-8 text-center">
                  <h3 className="mb-2 bg-gradient-to-r from-[#1b7a70] to-[#8FD4C9] bg-clip-text font-heading text-2xl font-black text-transparent sm:text-3xl">
                    {option.title}
                  </h3>
                  <p className="px-4 text-xs font-light text-[#a6a6a6] sm:text-sm">
                    {option.description}
                  </p>
                </div>

                <QrPanel src={option.qrSrc} title={option.title} />

                <div className="mb-8 space-y-2 text-center">
                  <span className="block text-[10px] font-bold tracking-widest text-[#8FD4C9] uppercase opacity-70">
                    Scan to Open Form
                  </span>
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-[#a6a6a6] underline decoration-white/30 underline-offset-4 transition-all duration-300 hover:text-white hover:decoration-white sm:text-sm"
                  >
                    Can&apos;t scan the QR? Click this link
                  </a>
                </div>

                <div className="mb-8 space-y-3">
                  {option.steps.map((text, index) => (
                    <div
                      key={text}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-white/10"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#1b7a70] to-[#8FD4C9] text-sm font-black text-black shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-xs leading-relaxed font-light text-[#a6a6a6] sm:text-sm">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full rounded-xl bg-gradient-to-r from-[#1b7a70] to-[#8FD4C9] py-4 text-xs font-black tracking-widest text-black uppercase shadow-lg transition-all hover:brightness-110 sm:text-sm"
                >
                  I have sent my generosity seed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * The QR itself. Neither PNG is in `public/` yet, and a broken-image icon in
 * the middle of a giving flow reads as "this church's payment page is
 * broken" — so a failed load collapses to a line of text and leaves the
 * fallback link below to do the work.
 */
function QrPanel({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center rounded-3xl border border-dashed border-white/20 p-6 text-center sm:h-56 sm:w-56">
        <p className="text-xs text-[#737373]">
          QR code not available yet — use the link below.
        </p>
      </div>
    )
  }

  return (
    <div className="relative mx-auto mb-4 flex h-48 w-48 items-center justify-center overflow-hidden rounded-3xl border-4 border-[#1b7a70]/30 bg-white p-3 shadow-2xl sm:h-56 sm:w-56">
      <img
        src={src}
        alt={`${title} QR code`}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

interface GiveCardProps {
  index: number
  cardKey: GiveKey
  variants: Record<string, unknown>
  expanded: boolean
  onExpand: (k: GiveKey) => void
  onOpen: (k: GiveKey) => void
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  body: string
  cta: string
  ctaStyle: 'solid' | 'outline'
  icon: React.ReactNode
}

/**
 * One accordion panel. Extracted rather than written twice inline — the
 * reference repeats the whole card markup for each option, and the two
 * copies had already drifted (one image animated on hover, the other did
 * not; one title carried `whitespace-nowrap`, the other did not).
 */
function GiveCard({
  index,
  cardKey,
  variants,
  expanded,
  onExpand,
  onOpen,
  image,
  imageAlt,
  eyebrow,
  title,
  body,
  cta,
  ctaStyle,
  icon,
}: GiveCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      onMouseEnter={() => onExpand(cardKey)}
      onClick={() => onExpand(cardKey)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-[#1b7a70]/40 ${
        expanded ? 'lg:w-[70%]' : 'lg:w-[30%]'
      }`}
    >
      <div className="relative flex h-full flex-col">
        <div
          className={`relative w-full shrink-0 overflow-hidden transition-all duration-700 ${
            expanded ? 'h-40 sm:h-56 lg:h-64' : 'h-24 lg:h-40'
          }`}
        >
          {imageFailed ? (
            <div
              aria-hidden="true"
              className="h-full w-full bg-gradient-to-br from-[#0d0d0d] to-[#1b7a70]/20"
            />
          ) : (
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent" />
        </div>

        <div
          className={`relative flex flex-grow flex-col p-6 pb-8 transition-all duration-700 sm:p-8 lg:p-10 ${
            expanded ? '-mt-12 lg:-mt-16' : 'mt-0'
          }`}
        >
          <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-start lg:gap-0">
            <div className="relative h-12 w-12 shrink-0 lg:mb-6 lg:h-16 lg:w-16">
              <div className="absolute inset-0 rounded-full bg-[#1b7a70]/20 blur-xl" />
              <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#1b7a70] to-[#8FD4C9]">
                <svg
                  className="h-6 w-6 text-black lg:h-8 lg:w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {icon}
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-heading text-xl font-black tracking-tight text-white sm:text-2xl lg:mb-2 lg:text-4xl">
                {title}
              </h3>
              <div
                className={`hidden items-center gap-2 transition-opacity duration-500 lg:flex ${
                  expanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="h-[2px] w-8 bg-gradient-to-r from-[#8FD4C9] to-transparent" />
                <p className="text-[10px] font-black tracking-[0.2em] text-[#8FD4C9] uppercase">
                  {eyebrow}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`shrink-0 overflow-hidden transition-all duration-700 ${
              expanded ? 'mt-4 max-h-40 opacity-100' : 'mt-0 max-h-0 opacity-0'
            }`}
          >
            <p className="max-w-md text-xs leading-relaxed font-light text-[#a6a6a6] sm:text-sm lg:text-base">
              {body}
            </p>
          </div>

          <div className="mt-auto flex flex-col justify-end pt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                onOpen(cardKey)
              }}
              className="group/btn relative w-full overflow-hidden rounded-2xl sm:w-auto"
            >
              <div
                className={`relative flex items-center justify-center gap-3 px-6 py-4 text-xs font-black tracking-widest uppercase shadow-2xl lg:px-10 lg:py-5 lg:text-sm ${
                  ctaStyle === 'solid'
                    ? 'bg-gradient-to-r from-[#1b7a70] to-[#8FD4C9] text-black'
                    : 'border border-[#1b7a70]/40 bg-transparent text-white transition-colors group-hover/btn:bg-[#1b7a70]/10'
                }`}
              >
                <span>{cta}</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
