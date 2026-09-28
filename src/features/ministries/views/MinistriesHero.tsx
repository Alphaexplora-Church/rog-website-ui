import { PageHero } from '../../../shared/components/ui/PageHero'

/**
 * Ministries hero. REVAMP 2026-09-25.
 *
 * The old hero's single line ("This is an exciting time to join our
 * spiritual family.") is kept verbatim as the whisper lead under a short
 * shout title. No photo: the only candidate was a stock Unsplash frame
 * (the page's own photos are all placeholders), so the hero uses
 * PageHero's light-pool + giant wave ground instead and lets the Ages of
 * the River panels below carry the imagery.
 *
 * The aside is an index of the three bands below — a table of contents
 * that doubles as the page's shape at a glance.
 */
const index = [
  { href: '#life-seasons', label: 'Ages of the river' },
  { href: '#service-ministries', label: 'Saved to serve' },
  { href: '#body-of-christ', label: 'Body of Christ' },
]

export function MinistriesHero() {
  return (
    <PageHero
      eyebrow="Ministries"
      title={['Every age.', 'Every gift.']}
      lead="This is an exciting time to join our spiritual family."
      aside={
        <ol className="grid gap-1 border-l border-bone/15 pl-6">
          {index.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group flex items-baseline gap-4 py-1 transition-colors duration-300 hover:text-sky"
              >
                <span className="w-6 font-shout text-sm tabular-nums text-bone/45">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-shout text-3xl font-bold uppercase leading-none">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      }
    />
  )
}
