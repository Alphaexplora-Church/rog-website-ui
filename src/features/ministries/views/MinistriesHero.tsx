import { useInView } from '../../../shared/hooks/useInView'
import { maskLineBase, maskLineHidden, maskLineShown } from '../../../shared/styles/tokens'

/**
 * Ministries — mini hero. From the Figma Ministries.dc.html board: a
 * gray-toned photo hero (distinct from About's own hero photo/gradient)
 * with a single headline, wave divider into the Life Seasons section
 * below. Same shape as AboutHero — one headline, no subhead, no CTA —
 * since this is a secondary page with real content immediately below.
 */
export function MinistriesHero() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="ministries-hero-heading"
      className="relative overflow-hidden bg-[#232323] text-white"
    >
      <img
        src="https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.85)_0%,rgba(22,22,22,0.68)_55%,rgba(35,35,35,0.5)_100%)]"
      />

      <div className="relative mx-auto max-w-[86rem] px-6 pt-40 pb-24 sm:pt-48 sm:pb-32">
        <h1
          id="ministries-hero-heading"
          className="max-w-[34ch] text-balance font-heading text-4xl leading-[1.08] font-extrabold sm:text-5xl"
        >
          <span className="block overflow-hidden pb-[0.1em]">
            <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
              This is an exciting time to join our spiritual family.
            </span>
          </span>
        </h1>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[70px] w-full sm:h-[100px]"
      >
        <path
          d="M0,55 C360,120 720,0 1080,60 C1260,90 1350,78 1440,60 L1440,120 L0,120 Z"
          fill="#232323"
        />
      </svg>
    </section>
  )
}
