import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { giveOptions, useGiveViewModel, type GiveKey } from '../viewModels/useGiveViewModel'
import { PageHero } from '../../../shared/components/ui/PageHero'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Reveal, SectionHead, WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * Give (`/give`). REVAMP 2026-09-25 ("Textured Editorial").
 *
 * Content and flow are unchanged from the 2026-09-23 build of Jude's
 * reference ("yung sa give, make it like this…"): two ways to give — tithes
 * and offering to River of God, and "buy us coffee" for the Alphaexplora
 * tech team — each opening a modal with its QR, the "can't scan" form link
 * and three steps. Links and QR filenames are Jude's, verbatim (see the
 * ViewModel's warning about the church pair being El Gibhor's form).
 *
 * Shape: dark, spacious, confident.
 *   1. PageHero — shout headline, whisper lead.
 *   2. Two METHOD BLOCKS, deliberately unequal: the church block is the
 *      big poster with the page's one ember action; the tech block is the
 *      quieter outline. The reference's accordion survives as a gentler
 *      version — hovering/focusing a block widens it on desktop (the
 *      ViewModel's `expandedCard`), but nothing is hidden when collapsed.
 *   3. "How giving works" on the bone light plate — the church steps as
 *      three big numbered moves, so people know the flow before opening
 *      the modal. Steps are read from the ViewModel's `giveOptions`.
 *
 * No giving scripture: none exists in this file's sources, and it isn't
 * ours to invent. Framer-motion stays only for the modal's exit animation
 * (AnimatePresence) and the blocks' entrance; both collapse to plain fades
 * under reduced motion via `useReducedMotion`.
 */
export default function Give() {
  const { activeModal, setActiveModal, expandedCard, setExpandedCard, option } =
    useGiveViewModel()
  const reduce = useReducedMotion()

  const blockVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.15, duration: reduce ? 0.01 : 0.9, ease: [0.7, 0, 0.2, 1] },
    }),
  }

  return (
    <>
      <PageHero
        eyebrow="Worship through giving"
        title={['Generosity', 'changes', 'everything.']}
        lead="Your seeds of generosity cultivate eternal impact. Choose how you'd like to sow today."
        size="short"
      />

      {/* Method blocks */}
      <section
        data-plate="dark"
        aria-label="Ways to give"
        className="relative isolate overflow-hidden bg-abyss pb-24 text-bone sm:pb-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[15%] -z-10 blur-[80px] [background-image:radial-gradient(ellipse_35%_35%_at_20%_60%,color-mix(in_srgb,var(--color-ember)_12%,transparent),transparent_70%),radial-gradient(ellipse_40%_40%_at_85%_30%,color-mix(in_srgb,var(--color-river)_45%,transparent),transparent_70%)]"
        />
        <div className={`${container} flex flex-col gap-4 lg:flex-row lg:gap-5`}>
          <MethodBlock
            index={0}
            cardKey="church"
            variants={blockVariants}
            expanded={expandedCard === 'church'}
            onExpand={setExpandedCard}
            onOpen={setActiveModal}
            image="https://images.unsplash.com/photo-1740650511388-f693ce80016c?auto=format&fit=crop&q=80&w=1200"
            imageAlt="River of God congregation in worship"
            eyebrow="Direct to River of God"
            title="Support the Mission"
            body="Your tithes and offerings fuel our local ministries, community reach, and church operations. Every seed sown makes an eternal impact."
            cta="Give to Church"
            primary
          />
          <MethodBlock
            index={1}
            cardKey="tech"
            variants={blockVariants}
            expanded={expandedCard === 'tech'}
            onExpand={setExpandedCard}
            onOpen={setActiveModal}
            image="/assets/Photos/tech_team1.png"
            imageAlt="The Alphaexplora team behind this site"
            eyebrow="Buy us Coffee"
            title="Fuel the Tech Team"
            body="Support the developers and creators behind the River of God digital experience. Keep the servers running and the code flowing."
            cta="Support Tech Team"
          />
        </div>
      </section>

      {/* How it works */}
      <section
        data-plate="light"
        aria-labelledby="give-steps-heading"
        className="relative isolate overflow-hidden bg-bone py-24 text-abyss sm:py-32"
      >
        <WaveMark
          className="pointer-events-none absolute -bottom-[6%] -left-[10%] -z-10 h-auto w-[55vw] max-w-[820px] text-abyss/[0.05]"
          strokeWidth={3}
        />
        <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              id="give-steps-heading"
              tone="light"
              eyebrow={giveOptions.church.title}
              title={
                <>
                  Three steps,
                  <br />
                  one seed.
                </>
              }
              lead={giveOptions.church.description}
            />
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button onClick={() => setActiveModal('church')} variant="solid" tone="light" size="lg" arrow>
                Show the QR
              </Button>
              <Button href={giveOptions.church.link} variant="ghost" tone="light">
                Open the form
              </Button>
            </div>
          </div>
          <ol className="border-t border-abyss/15">
            {giveOptions.church.steps.map((text, i) => (
              <Reveal
                as="li"
                key={text}
                delay={i * 80}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-6 border-b border-abyss/15 py-8 sm:grid-cols-[7rem_minmax(0,1fr)] sm:py-10"
              >
                <span className="font-shout text-[clamp(3.5rem,8vw,6rem)] font-black leading-[0.8] tabular-nums text-ember-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-whisper text-[clamp(1.25rem,2vw,1.75rem)] italic leading-snug">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && option && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="give-modal-title"
            className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.01 : 0.3 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-abyss/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : 28 }}
              transition={{ duration: reduce ? 0.01 : 0.5, ease: [0.7, 0, 0.2, 1] }}
              className="relative max-h-[92svh] w-full max-w-xl overflow-y-auto bg-abyss-2 text-bone"
            >
              <span aria-hidden="true" className="block h-[3px] w-full bg-ember" />
              <button
                type="button"
                autoFocus
                onClick={() => setActiveModal(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors duration-300 ease-current hover:border-bone hover:bg-bone hover:text-abyss"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="px-6 pt-10 pb-8 sm:px-10 sm:pb-10">
                <Eyebrow>Scan to open form</Eyebrow>
                <h2 id="give-modal-title" className="mt-4 pr-12 font-shout text-[clamp(2.25rem,7vw,3.25rem)] font-extrabold uppercase leading-[0.9]">
                  {option.title}
                </h2>
                <p className="mt-3 font-whisper text-lg italic text-bone/80">{option.description}</p>

                <QrPanel src={option.qrSrc} title={option.title} />

                <p className="mt-4 text-center">
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-bone/75 underline decoration-ember/70 underline-offset-4 transition-colors duration-300 hover:text-bone hover:decoration-sky"
                  >
                    Can&apos;t scan the QR? Click this link
                  </a>
                </p>

                <ol className="mt-8 border-t border-bone/12">
                  {option.steps.map((text, index) => (
                    <li key={text} className="flex items-baseline gap-5 border-b border-bone/12 py-4">
                      <span className="w-8 flex-none font-shout text-2xl font-bold tabular-nums text-ember">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[0.95rem] leading-relaxed text-bone/80">{text}</p>
                    </li>
                  ))}
                </ol>

                <div className="mt-8">
                  <Button onClick={() => setActiveModal(null)} variant="solid" size="lg" className="w-full">
                    I have sent my generosity seed
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * The QR itself. Neither PNG is in `public/` yet, and a broken-image icon in
 * the middle of a giving flow reads as "this church's payment page is
 * broken" — so a failed load collapses to a line of text and leaves the
 * fallback link below to do the work. QR sits on bone (scanners need the
 * contrast) with hard edges.
 */
function QrPanel({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="relative mx-auto mt-8 flex h-52 w-52 flex-col items-center justify-center gap-4 border border-dashed border-bone/25 p-6 text-center sm:h-56 sm:w-56">
        <WaveMark className="h-4 w-12 text-bone" strokeWidth={7} />
        <p className="text-sm text-bone/65">QR code not available yet — use the link below.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 flex h-52 w-52 items-center justify-center bg-bone p-3 sm:h-56 sm:w-56">
      <img
        src={src}
        alt={`${title} QR code`}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

interface MethodBlockProps {
  index: number
  cardKey: GiveKey
  variants: Variants
  expanded: boolean
  onExpand: (k: GiveKey) => void
  onOpen: (k: GiveKey) => void
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  body: string
  cta: string
  primary?: boolean
}

/**
 * One way to give. A poster block: photo under a scrim (with a textured
 * river ground if the photo fails), shout title, body, and one button. The
 * church block is `primary` — ember CTA, the page's only one. Hover/focus
 * widens the block on desktop (flex-grow transition), echoing the
 * reference's accordion without hiding the copy of the other block.
 */
function MethodBlock({
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
  primary = false,
}: MethodBlockProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <motion.article
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      onMouseEnter={() => onExpand(cardKey)}
      onFocus={() => onExpand(cardKey)}
      aria-labelledby={`give-${cardKey}-title`}
      className={`group relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden transition-[flex-grow] duration-[900ms] ease-tide motion-reduce:transition-none lg:min-h-[40rem] lg:basis-0 ${
        expanded ? 'lg:grow-[7]' : 'lg:grow-[5]'
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: primary
            ? 'linear-gradient(200deg, var(--color-river) 0%, var(--color-deep) 45%, var(--color-abyss) 100%)'
            : 'linear-gradient(160deg, var(--color-deep) 0%, var(--color-abyss) 80%)',
        }}
      >
        {!imageFailed && (
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[1200ms] ease-current group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/70 to-abyss/10" />
        <div className="absolute inset-0 bg-river/25 mix-blend-color" />
      </div>
      <WaveMark
        className={`pointer-events-none absolute -right-[20%] top-[8%] -z-10 h-auto w-[110%] transition-transform duration-[1600ms] ease-current group-hover:-translate-x-8 motion-reduce:transition-none ${
          primary ? 'text-bone/[0.12]' : 'text-bone/[0.06]'
        }`}
        strokeWidth={3}
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />

      <div className="p-6 pb-8 sm:p-10 lg:p-12">
        <p className="font-shout text-sm font-bold tabular-nums text-bone/55">
          {String(index + 1).padStart(2, '0')} / 02
        </p>
        <Eyebrow className={`mt-6 ${primary ? 'text-ember' : 'text-shallows'}`}>{eyebrow}</Eyebrow>
        <h2
          id={`give-${cardKey}-title`}
          className="mt-5 font-shout text-[clamp(3rem,6.5vw,6rem)] font-extrabold uppercase leading-[0.86]"
        >
          {title}
        </h2>
        <p className="mt-6 max-w-[44ch] text-[1rem] leading-relaxed text-bone/80">{body}</p>
        <div className="mt-10">
          <Button
            onClick={() => onOpen(cardKey)}
            variant={primary ? 'ember' : 'outline'}
            size="lg"
            arrow
          >
            {cta}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
