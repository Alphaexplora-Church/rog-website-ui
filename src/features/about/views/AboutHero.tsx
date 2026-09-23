import { useInView } from '../../../shared/hooks/useInView'
import { maskLineBase, maskLineHidden, maskLineShown } from '../../../shared/styles/tokens'

/**
 * About / Who We Are — mini hero. REBUILT 2026-09-22 from the Figma design
 * (artifact 3680dbd7-…, board "02 — Who We Are") to replace the old
 * count-up hero. Much shorter than Home's hero on purpose — this is a
 * secondary page, so the design gives it one headline over a real photo,
 * not a full 100svh stage.
 *
 * The old count-up ("477" churches) doc-comment logic is gone with it —
 * the Figma design doesn't carry that fact on this page at all. It still
 * lives as a milestone card in FoundersStorySection's timeline below
 * ("TODAY / 477 churches & affiliates"), just not as hero-level emphasis.
 */
export function AboutHero() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden bg-[#161616] text-white"
    >
      <img
        src="https://images.unsplash.com/photo-1760367121593-97b9a02bbd65?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.85)_0%,rgba(22,22,22,0.68)_60%,rgba(35,35,35,0.5)_100%)]"
      />

      <div className="relative mx-auto max-w-[86rem] px-6 pt-40 pb-24 sm:pt-48 sm:pb-32">
        <h1
          id="about-hero-heading"
          className="max-w-[32ch] text-balance font-heading text-4xl leading-[1.08] font-extrabold sm:text-5xl"
        >
          <span className="block overflow-hidden pb-[0.1em]">
            <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
              A family that started with one children&rsquo;s home.
            </span>
          </span>
        </h1>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[80px] w-full sm:h-[110px]"
      >
        <path
          d="M0,60 C360,130 720,0 1080,65 C1260,98 1350,84 1440,65 L1440,130 L0,130 Z"
          fill="#161616"
        />
      </svg>
    </section>
  )
}
