import { discipleshipAcknowledgement, discipleshipStages } from '../../../shared/data/discipleship'

/**
 * ViewModel for `/discipleship`. Static for now (shared/data/discipleship.ts);
 * same return contract as the other feature ViewModels so the views don't
 * change shape when this starts reading a CMS collection.
 */
export function useDiscipleshipViewModel() {
  return {
    stages: discipleshipStages,
    acknowledgement: discipleshipAcknowledgement,
    isLoading: false,
    error: null as Error | null,
  }
}
