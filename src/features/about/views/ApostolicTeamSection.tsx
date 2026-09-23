import { TeamRosterRow, type RosterPerson } from './TeamRosterRow'

/**
 * About, section 4 — Apostolic Team. UPDATED 2026-09-22 with the real
 * roster and role titles Jude pasted from riverofgod.ph (previously a
 * single generic role per person from the Figma placeholder copy) — now
 * 5 people, each with their full set of titles.
 */
const apostolicTeam: RosterPerson[] = [
  {
    name: 'Bishop Augusto "Chito" Sanchez Jr.',
    roles: [
      'Overseer of River of God Churches and Affiliates',
      'Commission Head, PCEC Transformation & Revival Commission',
      'Convenor, Philippine Council of Evangelical Bishops',
      'National Director, Harvest International Ministry – Philippines',
    ],
  },
  {
    name: 'Pastor Rachel Sanchez',
    roles: [
      'Senior Pastor of River of God Ortigas',
      'Founder, Jesus Loves the Little Children Foundation',
      'Directress, Riversprings School',
      'Overseer, ROG Supernatural Institute',
    ],
  },
  {
    name: 'Pastor Greeko Villanueva',
    roles: [
      'Discipleship and Connect Pastor',
      'ROG Daughter Churches & Affiliates Coordinator',
      'River Families and Seasoned Overseer',
    ],
  },
  {
    name: 'Pastor Roselyn Arcelo',
    roles: ['Administration Pastor', 'Pastoral Care & Counseling', 'River Women Overseer'],
  },
  {
    name: 'Pastor Mark Libunao',
    roles: [
      'Personal Assistant to Bp. Chito Sanchez',
      'Creative Arts & River Men Overseer',
      'Dean, River Biblical Supernatural Institute',
    ],
  },
]

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
