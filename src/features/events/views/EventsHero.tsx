import { PageHero } from '../../../shared/components/ui/PageHero'

/**
 * Events, section 1 — the page's poster. REVAMP 2026-09-25: rebuilt on the
 * shared `PageHero` (drift + River scrim + boiling grain) so /events reads
 * as part of one system. Copy is unchanged — "Gather with us, on Sundays
 * and every day in between." — split into a shout title and a whisper lead.
 * The aside jumps straight to the two things a visitor came for.
 */
export function EventsHero() {
  return (
    <PageHero
      eyebrow="Events"
      title={['Gather', 'with us,']}
      lead="on Sundays and every day in between."
      image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80"
      size="short"
      aside={
        <nav aria-label="On this page" className="grid gap-1 border-l border-bone/15 pl-6">
          {[
            { href: '#events-weekly-heading', n: '01', label: 'Every week' },
            { href: '#events-upcoming-heading', n: '02', label: "What's on" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group flex items-baseline gap-4 py-1 transition-colors duration-300 hover:text-ember"
            >
              <span className="w-6 font-shout text-sm tabular-nums text-bone/55">{l.n}</span>
              <span className="font-shout text-3xl font-bold uppercase leading-none">{l.label}</span>
            </a>
          ))}
        </nav>
      }
    />
  )
}
