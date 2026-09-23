import { ministriesBySlugs } from '../../../shared/data/ministries'
import { person } from '../../../shared/data/people'
import { TeamRosterRow, type RosterPerson } from './TeamRosterRow'

/**
 * About, section 6 — Serving Ministry Heads.
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * Jude: "make sure that the data placeholders are all the same… para pag
 * inimplement tsaka inintegrate natin yung cms, we wont encounter any
 * issue."
 *
 * ⚠ THIS ROSTER AND THE MINISTRIES TAB DISAGREED. The same six people were
 * listed here with hand-typed role labels and again on the Ministries tab
 * as `contact` strings on their ministry's card, and two of the six were
 * spelled differently in each place:
 *
 *     About (was)               Ministries tab
 *     Media & Production        Media and Production
 *     Discipleship & Connect    Discipleship
 *
 * The Ministries tab's spelling is the one on the #SAVEDTOSERVE cards on
 * riverofgod.ph, which Jude confirmed as authoritative for these ("follow
 * the details ng service ministries sa official website"), so that is what
 * this roster now shows — a visible change to two rows on this page, and
 * the correct one.
 *
 * A person's role here IS the ministry they run, so it is read from
 * `ministries.ts` rather than stored again. Their name comes from
 * `people.ts`. Neither can drift from the Ministries tab now, because
 * there is nothing left in this file for them to drift from.
 *
 * WHY SIX AND NOT EIGHT: `ministries.ts` carries eight, including River
 * Kids Teachers (Aprile Liwanag) and River Families (Nestor and Sol
 * Mendoza). Both of those two are already on this page as life stage
 * coordinators in the section below, so listing them again here would show
 * the same name twice on one page. The six below are exactly the six this
 * section has always shown. Add a slug to the array to change that.
 */
const HEAD_MINISTRIES = [
  'media-and-production',
  'creative-arts',
  'ushering',
  'worship-team',
  'discipleship',
  'cross-cultural',
]

const ministryHeads: RosterPerson[] = ministriesBySlugs(HEAD_MINISTRIES).map((m) => ({
  name: person(m.contact).name,
  roles: [m.title],
}))

export function ServingMinistryHeadsSection() {
  return (
    <TeamRosterRow
      id="serving-ministry-heads"
      heading="Serving Ministry Heads"
      people={ministryHeads}
      bg="bg-[#232323]"
    />
  )
}
