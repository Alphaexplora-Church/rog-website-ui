import {
  activate12Aims,
  activate12Invitation,
  activateConferences,
  activateContact,
  activateDefinition,
  findActivateConference,
} from '../../../shared/data/activate'

/**
 * ViewModels for the Activate pages. Static for now (shared/data/activate.ts);
 * same return contract as the other feature ViewModels so the views don't
 * change shape when this starts reading a CMS collection.
 */
export function useActivate12ViewModel() {
  const current = findActivateConference('activate-12')!
  return {
    conference: current,
    definition: activateDefinition,
    aims: activate12Aims,
    invitation: activate12Invitation,
    contact: activateContact,
    past: activateConferences.filter((c) => c.slug !== 'activate-12'),
    isLoading: false,
    error: null as Error | null,
  }
}

export function useActivatePastViewModel(slug: 'activate-11' | 'activate-10') {
  const conference = findActivateConference(slug)!
  return {
    conference,
    previous: findActivateConference(conference.previous),
    current: findActivateConference('activate-12')!,
    contact: activateContact,
    isLoading: false,
    error: null as Error | null,
  }
}
