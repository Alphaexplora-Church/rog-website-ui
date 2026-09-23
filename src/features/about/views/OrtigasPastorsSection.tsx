import { TeamRosterRow, type RosterPerson } from './TeamRosterRow'

/**
 * About, section 5 — River of God Ortigas Pastors. UPDATED 2026-09-22:
 * riverofgod.ph's own roster for this section is Tin Corpus, Abigail
 * Sanchez-Flores, Rodel Buban, Khristine Lacsina and Jethro Mendoza (Mark
 * Libunao belongs to the Apostolic Team section instead — he's now listed
 * there with his real titles).
 *
 * ⚠ ROLE TITLES STILL PLACEHOLDER. The pasted source text for this
 * specific roster came through with names and role lines separated (a
 * scrape artifact), and the role-to-person pairing isn't reliably
 * recoverable from it — attributing the wrong ministry title to a named
 * pastor is worse than leaving this generic, so all five stay labeled
 * "River of God Ortigas" pending Jude confirming the exact mapping.
 */
const ortigasPastors: RosterPerson[] = [
  { name: 'Pastor Tin Corpus', roles: ['River of God Ortigas'] },
  { name: 'Pastor Abigail Sanchez-Flores', roles: ['River of God Ortigas'] },
  { name: 'Pastor Rodel Buban', roles: ['River of God Ortigas'] },
  { name: 'Pastor Khristine Lacsina', roles: ['River of God Ortigas'] },
  { name: 'Pastor Jethro Mendoza', roles: ['River of God Ortigas'] },
]

export function OrtigasPastorsSection() {
  return (
    <TeamRosterRow
      id="ortigas-pastors"
      heading="River of God Ortigas Pastors"
      people={ortigasPastors}
      bg="bg-[#161616]"
    />
  )
}
