import { peopleBySlugs } from '../../../shared/data/people'
import { TeamRosterRow } from './TeamRosterRow'

/**
 * About, section 5 — River of God Ortigas Pastors. riverofgod.ph's own
 * roster for this section is Tin Corpus, Abigail Sanchez-Flores, Rodel
 * Buban, Khristine Lacsina and Jethro Mendoza (Mark Libunao belongs to the
 * Apostolic Team section instead, and is listed there with his real titles).
 *
 * SINGLE-SOURCED 2026-09-23 — names now come from
 * `shared/data/people.ts`; this file only decides who is in this roster.
 *
 * ⚠ ROLE TITLES STILL PLACEHOLDER. All five read "River of God Ortigas"
 * because the pasted source came through with names and role lines
 * separated and the pairing is not reliably recoverable — attributing the
 * wrong ministry to a named pastor is worse than staying generic. The flag
 * now lives on the records themselves in `people.ts`, next to the values it
 * applies to.
 */
const ortigasPastors = peopleBySlugs([
  'tin-corpus',
  'abigail-sanchez-flores',
  'rodel-buban',
  'khristine-lacsina',
  'jethro-mendoza',
])

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
