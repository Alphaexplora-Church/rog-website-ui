import { TeamRosterRow, type RosterPerson } from './TeamRosterRow'

/**
 * About, section 6 — Serving Ministry Heads. UPDATED 2026-09-22 (three
 * passes now): first pass confirmed this roster as 6 separate people
 * (Carissa Traigo and Nica Moreno are two people with two distinct roles,
 * not one combined card). Second pass corrected two names against the
 * Service Ministries volunteer-recruitment page on riverofgod.ph, which
 * Jude confirmed as authoritative for these two ("follow the details ng
 * service ministries sa official website"): Creative Arts contact is
 * Jieyan Antonio (was Angelyn Antonio), Worship Team contact is Olga
 * Lomuntad (was Olga Fortuno). Third pass, after Jude shared the
 * Discipleship and Cross Cultural #SAVEDTOSERVE cards: corrected spelling
 * "Carrissa" → "Carissa" Traigo (one r, per the official card), and
 * "Veronica Moreno" → "Nica Moreno" for Cross Cultural (the official card
 * names the contact "Nica Moreno" — almost certainly the same person,
 * Nica being a common nickname for Veronica, but the card's own spelling
 * is what's used here per Jude's standing instruction to follow the
 * official site).
 */
const ministryHeads: RosterPerson[] = [
  { name: 'Joy Mallari', roles: ['Media & Production'] },
  { name: 'Jieyan Antonio', roles: ['Creative Arts'] },
  { name: 'Erika Garcia', roles: ['Ushering'] },
  { name: 'Olga Lomuntad', roles: ['Worship Team'] },
  { name: 'Carissa Traigo', roles: ['Discipleship & Connect'] },
  { name: 'Nica Moreno', roles: ['Cross Cultural'] },
]

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
