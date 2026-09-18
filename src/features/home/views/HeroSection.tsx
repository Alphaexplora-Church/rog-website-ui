import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { navActions } from '../../../shared/config/navigation'
import { site } from '../../../shared/config/site'
import { Button } from '../../../shared/components/ui/Button'
import {
  ease,
  heroMarkFadeBase,
  heroMarkFadeHidden,
  heroMarkFadeShown,
  heroRevealBase,
  heroRevealDelay1,
  heroRevealHidden,
  heroRevealShown,
} from '../../../shared/styles/tokens'

/**
 * Home hero — river + stage lighting, in colour.
 * Refined with ROG Branding: Deep Blue / Navy Base + Cyan Accents.
 */
export function HeroSection() {
  const [entered, setEntered] = useState(false)

  /* Fire on the frame after mount so the entry transition actually plays
     instead of being collapsed into the initial paint. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section
      data-plate="dark"
      aria-labelledby="hero-motto"
      className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#020611] px-6 pb-8 pt-[6.5rem] text-center text-white [isolation:isolate]"
    >
      {/* ---------------------------------------------------- AMBIENCE
          River-flow mesh → stage-light beams → grain → vignette. All
          decorative, aria-hidden. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        
        {/* Mesh — Deep Navy and Cyan pools blurred into a drifting fluid flow */}
        <motion.span
          className="absolute -inset-[20%] blur-[70px]
            [background-image:radial-gradient(circle_at_50%_24%,rgb(6_182_212/0.15),transparent_45%),radial-gradient(ellipse_65%_50%_at_50%_65%,rgb(14_165_233/0.25),transparent_70%),radial-gradient(ellipse_45%_40%_at_20%_40%,rgb(30_58_138/0.4),transparent_60%),radial-gradient(ellipse_55%_45%_at_80%_30%,rgb(17_24_39/0.8),transparent_75%),radial-gradient(circle_at_50%_50%,rgb(8_145_178/0.12),transparent_50%)]"
          animate={{ x: ['-2%', '3%', '-1.5%'], y: ['-1%', '3%', '2%'], scale: [1, 1.05, 1.02] }}
          transition={{ duration: 25, ease, repeat: Infinity, repeatType: 'mirror' }}
        />

        {/* Stage-light beams — Cyan and Sky-tinted light sweeps */}
        <span className="absolute inset-0 opacity-60 mix-blend-screen">
          <motion.span
            className="absolute -top-[20%] left-[12%] h-[140%] w-[32vw] origin-top blur-[50px]
              [background-image:linear-gradient(180deg,rgb(34_211_238/0.12)_0%,rgb(14_165_233/0.05)_45%,transparent_90%)]"
            animate={{ rotate: [-8, 8] }}
            transition={{ duration: 14, ease, repeat: Infinity, repeatType: 'mirror' }}
          />
          <motion.span
            className="absolute -top-[20%] left-[45%] h-[140%] w-[32vw] origin-top blur-[50px]
              [background-image:linear-gradient(180deg,rgb(56_189_248/0.12)_0%,rgb(2_132_199/0.04)_55%,transparent_90%)]"
            animate={{ rotate: [-5, 7] }}
            transition={{ duration: 18, ease, repeat: Infinity, repeatType: 'mirror', delay: 1 }}
          />
          <motion.span
            className="absolute -top-[20%] right-[12%] h-[140%] w-[32vw] origin-top blur-[50px]
              [background-image:linear-gradient(180deg,rgb(34_211_238/0.15)_0%,rgb(8_145_178/0.05)_50%,transparent_90%)]"
            animate={{ rotate: [-7, 5] }}
            transition={{ duration: 16, ease, repeat: Infinity, repeatType: 'mirror', delay: 0.5 }}
          />
        </span>

        {/* Grain — very light film texture to make the lighting feel physical */}
        <span
          className="absolute -inset-[50%] opacity-[0.04] mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />

        {/* Vignette — deep navy edge fade to focus the center */}
        <span
          className="absolute inset-0
            [background-image:radial-gradient(circle_at_center,transparent_30%,#020611_95%)]"
        />
      </div>

      {/* ------------------------------------------------------ CONTENT */}
      <div className="relative z-10 flex min-h-0 flex-col items-center text-center">
        
        {/* LOGO */}
        <div className="mb-6 flex justify-center">
          <img
            src={site.logo.src}
            alt={site.logo.alt}
            className={`h-auto w-[min(65vw,52vh,38rem)] drop-shadow-[0_20px_50px_rgba(6,182,212,0.25)] ${heroMarkFadeBase} ${entered ? heroMarkFadeShown : heroMarkFadeHidden}`}
            style={{ mixBlendMode: 'screen' }}
            width={640}
            height={640}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* MOTTO */}
        <h1
          id="hero-motto"
          className="text-base font-light tracking-[0.25em] text-slate-300 uppercase sm:text-lg lg:text-xl drop-shadow-md"
        >
          <span>We come alive </span>
          <span className="mt-1 block sm:mt-0 sm:inline">
            in the{' '}
            <motion.em
              className="bg-gradient-to-r from-white via-cyan-300 to-sky-400 bg-[length:200%_100%]
                bg-clip-text font-medium text-transparent not-italic drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              animate={{ backgroundPositionX: ['200%', '-100%'] }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
            >
              River.
            </motion.em>
          </span>
        </h1>

        {/* CTAs */}
        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 ${heroRevealBase} ${heroRevealDelay1} ${entered ? heroRevealShown : heroRevealHidden}`}
        >
          <Button
            to={navActions.planAVisit.to}
            variant="solid"
            tone="dark"
            size="md"
            className="shadow-[0_15px_35px_-10px_rgba(34,211,238,0.35)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.5)]"
          >
            Plan a Visit
          </Button>
          
          <Button
            to="/sermons"
            variant="outline"
            tone="dark"
            size="md"
            className="border-white/20 text-slate-200 transition-all hover:border-cyan-400/50 hover:bg-cyan-950/30 hover:text-white hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)]"
          >
            Watch Latest Service
          </Button>
        </div>
      </div>
    </section>
  )
}