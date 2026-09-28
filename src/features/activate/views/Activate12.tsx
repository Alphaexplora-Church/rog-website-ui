import { useEffect, useState } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container, heroRevealBase, heroRevealDelay1, heroRevealHidden, heroRevealShown } from '../../../shared/styles/tokens'
import { useActivate12ViewModel } from '../viewModels/useActivateViewModel'
import { ContactSection, PastCard, VideoFacade } from './ActivateParts'

/**
 * `/activate12` — Activate 12: Consuming Fire. NEW 2026-09-28.
 *
 * Content from the old riverofgod.ph Activate 12 page Jude sent: the
 * "Consuming Fire" key art, the recap video, "What is Activate?" and its
 * four aims, the invitation, contacts, and the two landing pages for the
 * previous conferences (Activate 11 — Come Holy Spirit 2, Activate 10).
 *
 * Design: the site's system (abyss / bone plates, shout + whisper type,
 * grain, one ember CTA) carrying the conference's own fire. The key art IS
 * the hero — its lettering is ROG's brand artwork, so it's shown whole, not
 * re-typeset; the real h1 is visually hidden behind it. Ember, the site's
 * horizon-amber accent, is already the fire's colour, so the page reads as
 * both "this site" and "this conference" without a new palette.
 *
 *   1. Key art (full-bleed, a narrower crop on phones so the lettering fits)
 *   2. Recap video (click-to-load)
 *   3. What is Activate? — the one-line definition as a whisper statement
 *   4. Four aims — numbered rows, photo + text, alternating sides
 *   5. Invitation — on a fire ground
 *   6. Past conferences (bone plate) — the two landing-page "buttons"
 *   7. Where to reach us
 */
export default function Activate12() {
  const { conference, definition, aims, invitation, contact, past } = useActivate12ViewModel()
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <>
      {/* 1 · Key art */}
      <section data-plate="dark" aria-labelledby="activate-title" className="relative isolate overflow-hidden bg-abyss text-bone">
        <h1 id="activate-title" className="sr-only">
          {conference.name}: {conference.theme}
        </h1>
        <div className="pt-20 md:pt-0">
        <div className="relative aspect-[1205/705] w-full md:aspect-auto md:h-[min(88svh,56vw)] md:min-h-[34rem]">
          <picture>
            <source media="(min-width: 768px)" srcSet="/assets/rog/activate/a12-hero.webp" />
            <img
              src="/assets/rog/activate/a12-hero-narrow.webp"
              alt=""
              fetchPriority="high"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-[opacity,transform] duration-[1600ms] ease-current motion-reduce:transition-none ${on ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
            />
          </picture>
          {/* Seat the art into the page: dark at the top for the nav, fade to abyss below. */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-abyss/70 to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-abyss to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute -inset-[10%] animate-boil bg-[url('/assets/rog/grain.png')] bg-[length:180px] opacity-[0.14] mix-blend-overlay motion-reduce:animate-none" />
        </div>
        </div>
        <div className={`${container} relative -mt-10 pb-14 sm:-mt-16 sm:pb-20`}>
          <div
            className={`flex flex-col gap-6 border-t border-bone/15 pt-6 sm:flex-row sm:items-end sm:justify-between ${heroRevealBase} ${heroRevealDelay1} ${on ? heroRevealShown : heroRevealHidden}`}
          >
            <div>
              <Eyebrow className="text-ember">PCEC Transformation &amp; Revival · River of God</Eyebrow>
              <p className="mt-3 max-w-[40ch] font-whisper text-[clamp(1.2rem,1.8vw,1.5rem)] italic leading-snug text-bone/85">
                The twelfth Activate conference — to be consumed by the fire of the Holy Spirit.
              </p>
            </div>
            <p className="font-shout text-[clamp(1.75rem,3vw,2.5rem)] font-bold uppercase leading-none tabular-nums text-sand">
              {invitation.date}
            </p>
          </div>
        </div>
      </section>

      {/* 2 · Recap */}
      <section data-plate="dark" aria-labelledby="activate-recap-heading" className="relative bg-abyss pb-24 text-bone sm:pb-32">
        <div className={container}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="activate-recap-heading" eyebrow="The recap" title={<>Relive<br />the fire.</>} />
            <p className="max-w-[36ch] text-bone/70">Highlights from Activate 12, by PCEC Transformation &amp; Revival.</p>
          </div>
          <Reveal className="mt-12">
            <VideoFacade videoId={conference.videoId} title={conference.videoTitle} />
          </Reveal>
        </div>
      </section>

      {/* 3 · What is Activate? */}
      <section
        data-plate="dark"
        aria-labelledby="activate-what-heading"
        className="relative isolate overflow-hidden bg-abyss py-28 text-bone sm:py-40"
      >
        <img
          src="/assets/rog/activate/a12-fire.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover opacity-60 md:w-2/3"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-abyss via-abyss/85 to-abyss/20" />
        <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
        <div className={container}>
          <Eyebrow className="text-ember">What is Activate?</Eyebrow>
          <h2
            id="activate-what-heading"
            className="mt-5 font-shout text-[clamp(3.5rem,10vw,9.5rem)] font-extrabold uppercase leading-[0.84]"
          >
            Be consumed.
          </h2>
          <Reveal className="mt-10 sm:mt-14 lg:ml-[33%]">
            <p className="max-w-[28ch] font-whisper text-[clamp(1.9rem,3.8vw,3.4rem)] italic leading-[1.14] text-balance">
              &ldquo;{definition}&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4 · Aims */}
      <section data-plate="dark" aria-labelledby="activate-aims-heading" className="relative bg-abyss py-24 text-bone sm:py-32">
        <div className={container}>
          <SectionHead
            id="activate-aims-heading"
            eyebrow="Why we gather"
            title={<>Four aims,<br />one fire.</>}
          />
          <ol className="mt-16 grid gap-20 sm:mt-24 sm:gap-28">
            {aims.map((aim, i) => (
              <Reveal
                as="li"
                key={aim.text}
                className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16 lg:gap-24"
              >
                <div className={`grain relative aspect-[16/9] overflow-hidden bg-deep ${i % 2 ? 'md:order-2' : ''}`}>
                  {aim.image ? (
                    <img
                      src={aim.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                  <span aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-bone/10" />
                </div>
                <div className={i % 2 ? 'md:order-1' : ''}>
                  <p className="flex items-center gap-4 font-shout text-[clamp(3.5rem,6vw,5.5rem)] font-extrabold leading-none tabular-nums text-ember">
                    {String(i + 1).padStart(2, '0')}
                    <span aria-hidden="true" className="h-px flex-1 bg-bone/15" />
                  </p>
                  <p className="mt-6 max-w-[30ch] font-whisper text-[clamp(1.4rem,2.3vw,2.1rem)] italic leading-[1.3] text-bone">
                    {aim.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 · Invitation */}
      <section
        data-plate="dark"
        aria-labelledby="activate-invite-heading"
        className="relative isolate overflow-hidden bg-abyss py-28 text-bone sm:py-40"
      >
        <img
          src="/assets/rog/activate/a12-fire.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full scale-x-[-1] object-cover opacity-90"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss via-abyss/45 to-abyss/10" />
        <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
        <div className={`${container} text-center`}>
          <Reveal>
            <p className="font-whisper text-[clamp(1.4rem,2.4vw,2.2rem)] italic text-bone/90">{invitation.lead}</p>
            <h2
              id="activate-invite-heading"
              className="mx-auto mt-6 max-w-[14ch] font-shout text-[clamp(3.25rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.86] text-balance"
            >
              Be activated.
            </h2>
            <p className="mx-auto mt-8 max-w-[40ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-bone/85">
              {invitation.body}
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Button href={contact.facebook} variant="ember" size="lg" arrow>
                Follow PCEC Transformation &amp; Revival
              </Button>
              <Button href="#activate-contact-heading" variant="outline" size="lg">
                Where to reach us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 · Past conferences */}
      <section data-plate="light" aria-labelledby="activate-past-heading" className="relative bg-bone py-24 text-abyss sm:py-32">
        <div className={container}>
          <SectionHead
            id="activate-past-heading"
            tone="light"
            eyebrow="Before Activate 12"
            title={<>Past<br />conferences.</>}
            lead="Every Activate has its own landing page — the video, the speakers and what that year was about."
          />
          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {past.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 80} className="h-full">
                <PastCard conference={c} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 · Contact */}
      <ContactSection contact={contact} />
    </>
  )
}
