import { site } from '../../../shared/config/site'
import { useInView } from '../../../shared/hooks/useInView'
import { Button } from '../../../shared/components/ui/Button'
import { 
  revealBase, 
  revealDelay1, 
  revealHidden, 
  revealShown, 
  riverGlow 
} from '../../../shared/styles/tokens'

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.location.venue},${site.location.area}`,
)}`

export function ServiceTimesSection() {
  const { ref, shown } = useInView<HTMLElement>()

  const sundayServices = site.services.filter(s => s.day.toLowerCase().includes('sunday'))
  const midweekServices = site.services.filter(s => !s.day.toLowerCase().includes('sunday'))

  return (
    <section
      ref={ref}
      id="service-times"
      data-plate="dark"
      aria-labelledby="service-times-heading"
      className="bg-[#020611] text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        
        {/* ---------------- SECTION HEADER ---------------- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400 drop-shadow-sm">
              Service Times
            </span>
            <h2
              id="service-times-heading"
              className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl drop-shadow-md"
            >
              Join us this week.
            </h2>
          </div>

          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2.5 pl-5 pr-4 text-sm font-semibold text-slate-300 shadow-sm backdrop-blur-md transition-all hover:border-cyan-500/50 hover:bg-cyan-950/40 hover:text-white"
          >
            <span>{site.location.venue}, {site.location.area}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1 group-hover:bg-cyan-500 group-hover:text-black">
              →
            </span>
          </a>
        </div>

        {/* ---------------- EDITORIAL BENTO GRID ---------------- */}
        <div
          className={`mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {/* ========================================================
              SUNDAY MAIN CARD (8 cols)
              ======================================================== */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#070b0e] shadow-2xl lg:col-span-8">
            
            {/* BACKGROUND IMAGE & DEEP WATER OVERLAY */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              <img 
                src="https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=1600" 
                alt="Sunday Worship" 
                className="h-full w-full object-cover opacity-50 transition-transform duration-[2500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
              />
              {/* Overlay: Deep Navy baseline, shifts to a subtle Cyan/Teal glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020611] via-[#020611]/80 to-[#020611]/30 transition-colors duration-700 group-hover:via-cyan-950/40" />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 p-8 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Main Gathering
                </span>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-300 backdrop-blur-md">
                  Every Sunday
                </span>
              </div>

              <div className="mt-8">
                <p className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Sunday Services
                </p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
                  Multiple gatherings designed around community, worship, and God's Word. Find the schedule that works for you.
                </p>
              </div>

              {/* Time Slots Chips (Thin Editorial Grid Cells) */}
              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {sundayServices.map((service, index) => (
                  <div
                    key={index}
                    className="group/chip relative flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-900/30 hover:shadow-[0_10px_30px_-10px_rgba(34,211,238,0.2)]"
                  >
                    <p className="font-heading text-2xl font-bold tabular-nums text-white transition-colors group-hover/chip:text-cyan-300">
                      {service.time}
                    </p>
                    <span className="mt-1 inline-block text-xs font-medium text-slate-400 transition-colors group-hover/chip:text-cyan-400/80">
                      {service.label ?? service.language ?? 'Worship Service'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM FOOTER ROW */}
            <div className="relative z-10 flex flex-col gap-5 border-t border-white/10 bg-black/40 px-8 py-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
              <p className="text-xs font-medium text-slate-400">
                In-person at the Sanctuary & streamed live online
              </p>

              <Button 
                href={site.liveStreamUrl} 
                tone="dark" 
                variant="solid" 
                live
              >
                Watch Live
              </Button>
            </div>
          </div>

          {/* ========================================================
              WEDNESDAY MIDWEEK CARD (4 cols)
              ======================================================== */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#070b0e] shadow-2xl lg:col-span-4">
            
            {/* BACKGROUND IMAGE & OVERLAY */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              <img 
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1000" 
                alt="Midweek Prayer" 
                className="h-full w-full object-cover opacity-30 transition-transform duration-[2500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020611] via-[#020611]/80 to-[#020611]/30 transition-colors duration-700 group-hover:via-cyan-950/30" />
            </div>

            <div aria-hidden="true" className={`${riverGlow} opacity-40 transition-opacity duration-700 group-hover:opacity-80`} />

            {/* CONTENT */}
            <div className="relative z-10 flex h-full flex-col p-8 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Midweek Focus
                </span>
                <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-teal-300 backdrop-blur-md">
                  Wednesday
                </span>
              </div>

              <div className="mt-auto pt-16">
                <p className="font-heading text-4xl font-extrabold tabular-nums tracking-tight text-white drop-shadow-lg">
                  {midweekServices[0]?.time ?? '6:00 PM'}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-200">
                  Prayer & Fasting
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  An intentional space in the middle of the week to align in corporate prayer and consecration.
                </p>
              </div>
            </div>

            <div className="relative z-10 border-t border-white/10 bg-black/40 px-8 py-6 backdrop-blur-xl sm:px-10 lg:px-12">
              <span className="text-xs text-slate-400">
                In-person fellowship
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}