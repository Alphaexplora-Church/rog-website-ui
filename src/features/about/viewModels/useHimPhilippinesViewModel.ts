import {
  himApplicationForm,
  himCoreValues,
  himCoreValuesIntroduction,
  himDpoBadge,
  himHeroImage,
  himIntroduction,
  himLeadership,
  himLogo,
  himMembershipStatement,
  himMission,
  himMotto,
  himNetworkFacts,
  himRiverOfGodConnection,
  himSecretary,
  himVision,
  statementOfFaith,
  statementOfFaithIntroduction,
} from '../data/himPhilippinesData'
import { site } from '../../../shared/config/site'

/**
 * ViewModel for `/about/him-ph` (H.I.M. Philippines).
 *
 * The Model today is the static module `himPhilippinesData` (copy taken from
 * riverofgod.ph). The view reads ONLY this hook, so when the page moves to
 * the Strapi `page` / `person` collections the fetch lands here and the view
 * doesn't change. `isLoading` / `error` are already in the return shape for
 * that reason.
 *
 * Leadership is split here, not in the view: the first two merged profiles
 * (Dr. Ché Ahn, Bp. Chito Sanchez) are the featured pair; the rest form the
 * directory. The group counts feed the section's one-line intro.
 */
export function useHimPhilippinesViewModel() {
  const featured = himLeadership.slice(0, 2)
  const directory = himLeadership.slice(2)
  const count = (pred: (groups: readonly string[]) => boolean) =>
    himLeadership.filter((l) => pred(l.groups)).length

  return {
    isLoading: false as const,
    error: null,
    brand: {
      himLogo,
      himLogoAlt: 'Harvest International Ministry Philippines',
      rogLogo: site.logo,
    },
    hero: {
      image: himHeroImage,
      introduction: himIntroduction,
      facts: himNetworkFacts,
    },
    mission: {
      motto: himMotto,
      mission: himMission,
      vision: himVision,
    },
    connection: himRiverOfGodConnection,
    leadership: {
      all: himLeadership,
      featured,
      directory,
      councilCount: count((g) => g.includes('Apostolic Council')),
      boardCount: count((g) => g.includes('Board')),
      bothCount: count((g) => g.includes('Apostolic Council') && g.includes('Board')),
    },
    coreValues: {
      introduction: himCoreValuesIntroduction,
      values: himCoreValues,
    },
    statementOfFaith: {
      introduction: statementOfFaithIntroduction,
      statements: statementOfFaith,
    },
    membership: {
      statement: himMembershipStatement,
      applicationForm: himApplicationForm,
      contact: himSecretary,
      contactEmail: 'pastorgreeko@gmail.com',
      dpoBadge: himDpoBadge,
      dpoBadgeAlt: 'National Privacy Commission DPO/DPS registration badge',
      dpoCaption:
        'National Privacy Commission DPO/DPS registration. The badge shown is valid through 15 December 2025.',
    },
  }
}
