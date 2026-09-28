import { PageHero } from '../../../shared/components/ui/PageHero'

/**
 * About / Who We Are — first screen. REVAMP 2026-09-25: now the shared
 * `PageHero` (masked shout title over the same photo, drift + River scrim +
 * boiling grain) so this page opens like every other inner route.
 *
 * History kept: REBUILT 2026-09-22 from the Figma "02 — Who We Are" board,
 * replacing the old count-up hero. The headline is the Figma copy. The two
 * facts in the aside (1998 founding, 477 churches & affiliates) are the
 * same confirmed facts the Founders' Story timeline below carries — the
 * hero only previews them.
 */
export function AboutHero() {
  return (
    <PageHero
      eyebrow="About · Who we are"
      title={['A family', 'that started', 'with one', 'children’s home.']}
      image="https://images.unsplash.com/photo-1760367121593-97b9a02bbd65?auto=format&fit=crop&w=1600&q=80"
      imagePosition="center 35%"
      aside={
        <dl className="grid grid-cols-2 gap-x-10 gap-y-2 border-l border-bone/15 pl-6 lg:grid-cols-1 lg:gap-y-6">
          <div>
            <dt className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Founded</dt>
            <dd className="font-shout text-5xl font-extrabold leading-none sm:text-6xl">1998</dd>
          </div>
          <div>
            <dt className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Churches &amp; affiliates</dt>
            <dd className="font-shout text-5xl font-extrabold leading-none sm:text-6xl">477</dd>
          </div>
        </dl>
      }
    />
  )
}
