import { PoolCandidateStatus } from "~/api/generated";

// eslint-disable-next-line import/prefer-default-export
export const statusSortMap: Record<PoolCandidateStatus, number> = {
  [PoolCandidateStatus.Draft]: 1,
  [PoolCandidateStatus.DraftExpired]: 2,
  [PoolCandidateStatus.NewApplication]: 3,
  [PoolCandidateStatus.ApplicationReview]: 4,
  [PoolCandidateStatus.ScreenedIn]: 5,
  [PoolCandidateStatus.UnderAssessment]: 6,
  [PoolCandidateStatus.QualifiedAvailable]: 7,
  [PoolCandidateStatus.QualifiedUnavailable]: 8,
  [PoolCandidateStatus.QualifiedWithdrew]: 9,
  [PoolCandidateStatus.PlacedCasual]: 10,
  [PoolCandidateStatus.PlacedTerm]: 11,
  [PoolCandidateStatus.PlacedIndeterminate]: 12,
  [PoolCandidateStatus.ScreenedOutApplication]: 13,
  [PoolCandidateStatus.ScreenedOutAssessment]: 14,
  [PoolCandidateStatus.Expired]: 15,
  [PoolCandidateStatus.Removed]: 16,
};
