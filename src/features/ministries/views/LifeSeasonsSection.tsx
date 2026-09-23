import { useState } from 'react'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Ministries, section 2 — "Life Seasons" carousel. From the Figma
 * Ministries.dc.html board: 6 age-stage cards, alternating card themes
 * (white / navy #0E2A3F / teal #1B7A70), same carousel pattern as the
 * other pages on this site (page/maxPage/STEP state).
 *
 * `card` is a literal, complete Tailwind class string per item — never
 * assembled at runtime — same JIT constraint documented throughout this
 * codebase.
 */
const VISIBLE = 4
const STEP = 272

const lifeSeasons = [
  {
    age: 'AGES 4–12',
    title: 'River Kids',
    body: 'An entry-level experience for kids — games, Bible stories, interactive learning, and lots of fun.',
    photo:
      'https://images.unsplash.com/photo-1588075592405-d3d4f0846961?auto=format&fit=crop&w=500&q=80',
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
  {
    age: 'AGES 13–19',
    title: 'River Youth',
    body: 'Helps young believers "cross over" to adulthood by elevating faith, character, and maturity.',
    photo:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=80',
    card: 'bg-[#0E2A3F] text-white',
    ageColor: 'text-[#8FD4C9]',
    bodyColor: 'text-white/70',
  },
  {
    age: 'AGES 20–30',
    title: 'Young Adults',
    body: 'Builds fellowship around career, finances, personal growth, and relationships.',
    photo:
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&q=80',
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
  {
    age: 'AGES 31–50',
    title: 'River Men & Women',
    body: 'Helps men and women mature further in their walk with Christ.',
    photo:
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=500&q=80',
    card: 'bg-[#1b7a70] text-white',
    ageColor: 'text-white',
    bodyColor: 'text-white/82',
  },
  {
    age: 'AGES 51+',
    title: 'Seasoned',
    body: 'The same maturity focus, for our seasoned believers.',
    photo:
      'https://images.unsplash.com/photo-1504004030892-d06adf9ffbcf?auto=format&fit=crop&w=500&q=80',
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
  {
    age: 'MARRIED COUPLES',
    title: 'Family Ministry',
    body: 'Helps married couples foster families consecrated to the Lord.',
    photo:
      'https://images.unsplash.com/photo-1561524891-8e08ab8569f3?auto=format&fit=crop&w=500&q=80',
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
]

export function LifeSeasonsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const [page, setPage] = useState(0)
  const maxPage = Math.max(0, lifeSeasons.length - VISIBLE)

  return (
    <section
      data-plate="dark"
      aria-labelledby="life-seasons-heading"
      className="relative bg-[#232323] text-white"
    >
      <div ref={ref} className="mx-auto max-w-[86rem] px-6 pt-14 pb-36 sm:pt-20 sm:pb-44">
        <h2
          id="life-seasons-heading"
          className="max-w-[52ch] text-balance font-heading text-2xl font-bold sm:text-3xl"
        >
          We&rsquo;ve created new ministries to encourage growth in your journey with the Lord,
          at every stage of life.
        </h2>

        <div className="relative mt-10">
          <div
            className={`overflow-hidden ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
          >
            <div
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * STEP}px)` }}
            >
              {lifeSeasons.map((stage) => (
                <div
                  key={stage.title}
                  className={`w-64 shrink-0 overflow-hidden rounded-[26px_8px_26px_8px] ${stage.card}`}
                >
                  <img
                    src={stage.photo}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-32 w-full object-cover"
                  />
                  <div className="flex flex-col gap-2.5 p-5">
                    <p className={`text-xs font-bold tracking-[0.06em] ${stage.ageColor}`}>
                      {stage.age}
                    </p>
                    <p className="font-heading text-lg font-semibold">{stage.title}</p>
                    <p className={`text-sm leading-relaxed ${stage.bodyColor}`}>{stage.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous life seasons"
            className="absolute top-1/2 left-[-22px] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-[#0B0F14] shadow-lg disabled:opacity-30 sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
            aria-label="Next life seasons"
            className="absolute top-1/2 right-[-22px] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-[#0B0F14] shadow-lg disabled:opacity-30 sm:flex"
          >
            ›
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === page ? 'w-[22px] bg-[#1b7a70]' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[80px] w-full sm:h-[110px]"
      >
        <path
          d="M0,60 C360,130 720,0 1080,65 C1260,100 1350,85 1440,65 L1440,140 L0,140 Z"
          fill="#161616"
        />
      </svg>
    </section>
  )
}
