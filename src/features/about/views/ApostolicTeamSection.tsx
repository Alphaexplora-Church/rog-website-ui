import { peopleBySlugs } from '../../../shared/data/people'
import { TeamRosterRow } from './TeamRosterRow'

/**
 * About, section 4 — Apostolic Team. Five people, each with their full set
 * of titles from riverofgod.ph (confirmed 2026-09-22, replacing the single
 * generic role per person the Figma placeholder copy carried).
 *
 * SINGLE-SOURCED 2026-09-23. The names and titles used to be typed out
 * here; two of these five — Bishop Chito and Pastor Rachel — were also
 * typed out in FoundersSection and again in LeadershipBiosSection, three
 * records for two people with three different titles between them. All of
 * it now comes from `shared/data/people.ts`. This file decides only WHO
 * appears in this roster and in what order.
 */
const apostolicTeam = peopleBySlugs([
  'chito-sanchez',
  'rachel-sanchez',
  'greeko-villanueva',
  'roselyn-arcelo',
  'mark-libunao',
])

export function ApostolicTeamSection() {
  return (
    <TeamRosterRow
      id="apostolic-team"
      heading="Apostolic Team"
      people={apostolicTeam}
      bg="bg-[#232323]"
    />
  )
}
