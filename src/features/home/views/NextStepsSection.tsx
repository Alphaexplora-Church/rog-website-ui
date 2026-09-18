import { Button } from '../../../shared/components/ui/Button'
import { navActions } from '../../../shared/config/navigation'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown, riverGlow } from '../../../shared/styles/tokens'

/**
 * Home, section 7 (last, pre-footer) — "Next Steps." NOT in Doc 8's
 * original plan by this name; closest overlap is Doc 8 §9's "Grow" folded
 * into the closing Story & Scale section, and Give was deliberately made a
 * nav-only action ("Give became a nav item rather than a homepage section",
 * Doc 8 §3 footnotes). Jude's 2026-09-16 revision reinstates a Give panel
 * here specifically, paired with community — that's a real scope change
 * from what Doc 8 recorded, not an oversight; flagging it so the docs and
 * the code don't quietly disagree.
 *
 * "Online Giving" links to `navActions.give.to` (`/give`) — the existing
 * nav route, not a new one. "Join a Life Group" has no dedicated route yet;
 * `/discipleship` ("Find your next step") is the closest real match already
 * in navigation.ts, so it's reused here rather than inventing `/groups`.
 * Revisit once Life Groups has its own page.
 *
 * Two columns sharing one hairline divider — same `bg-line` + `gap-px`
 * construction as ServiceTimesSection and MinistriesGrid, now a third use,
 * which is what makes it a house pattern rather than a one-off.
 *
 * Carries a `.river-glow` (index.css) behind the two panels, and both
 * panel icons take the same plain navy-blue colour, instead of the flat
 * ink-muted grey — the same restrained colour-past-the-hero move as
 * WelcomeBanner and MinistriesGrid.
 *
 * ICON TREATMENT: same solid-tint rounded-square tile as MinistriesGrid,
 * instead of the thin-ring circle Jude flagged as "looks very AI"
 * (2026-09-16). A wave-squiggle mark under the tile was tried in the same
 * pass and pulled right after per Jude's follow-up — just the tile now.
 *
 * ⚠ PLACEHOLDER PHOTOS — each panel also carries a keyword-matched photo
 * (loremflickr.com) above its icon per Jude's "para may buhay" follow-up.
 * Icons keep their existing colour; the photos are new, not a replacement.
 * Same production caveat as WelcomeBanner's — swap before launch.
 */
export function NextStepsSection() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="next-steps-heading"
      className="relative overflow-hidden bg-black text-white"
    >
      <div aria-hidden="true" className={riverGlow} />

      <div className="relative z-10 mx-auto max-w-[86rem] px-6 py-24 sm:py-32">
        <h2 id="next-steps-heading" className="sr-only">
          Next steps
        </h2>

        <div
          className={`grid gap-px overflow-hidden rounded-2xl bg-[#262626] ring-1 ring-[#262626] sm:grid-cols-2 ${revealBase} ${shown ? revealShown : revealHidden}`}
        >
          <div className="flex flex-col gap-5 bg-[#0d0d0d] p-10 sm:p-14">
            <div className="-mx-10 -mt-10 overflow-hidden sm:-mx-14 sm:-mt-14">
              <img
                src="https://loremflickr.com/600/340/smallgroup,community?lock=31"
                alt=""
                aria-hidden="true"
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            </div>

            <span
              aria-hidden="true"
              className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="8.5" cy="8.5" r="2.75" />
                <circle cx="16" cy="9.5" r="2.25" />
                <path d="M3.5 19.5c0-3 2.2-5.3 5-5.3s5 2.3 5 5.3M14 19.5c0-2.2 1.4-4 3.5-4.6 1.7.4 3 1.9 3 4.1" />
              </svg>
            </span>
            <div>
              <h3 className="font-heading text-2xl font-bold">Join a Life Group</h3>
              <p className="mt-3 text-[#a6a6a6]">
                Faith grows best in community. Find a group near you and do this life together.
              </p>
            </div>
            <Button
              to="/discipleship"
              variant="outline"
              tone="dark"
              size="md"
              className="mt-2 self-start"
            >
              Find a Group
            </Button>
          </div>

          <div className="flex flex-col gap-5 bg-[#0d0d0d] p-10 sm:p-14">
            <div className="-mx-10 -mt-10 overflow-hidden sm:-mx-14 sm:-mt-14">
              <img
                src="https://loremflickr.com/600/340/givinghands,generosity?lock=32"
                alt=""
                aria-hidden="true"
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            </div>

            <span
              aria-hidden="true"
              className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <rect x="3.5" y="6" width="17" height="12.5" rx="2" />
                <path d="M3.5 10.5h17M7 15h4" />
              </svg>
            </span>
            <div>
              <h3 className="font-heading text-2xl font-bold">Online Giving</h3>
              <p className="mt-3 text-[#a6a6a6]">
                Give securely, wherever you are. Every gift moves the mission forward.
              </p>
            </div>
            <Button
              to={navActions.give.to}
              variant="solid"
              tone="dark"
              size="md"
              className="mt-2 self-start"
            >
              Give Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
