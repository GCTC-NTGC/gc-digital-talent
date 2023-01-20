import { PoolCandidateStatus } from "../../../api/generated";

export type BorderMapKey = "cta" | "dt-primary" | "dt-secondary" | "dt-gray";

export const borderMap: Record<BorderMapKey, Record<string, string>> = {
  cta: {
    "data-h2-border-left": "base(x1 solid dt-accent)",
  },
  "dt-primary": {
    "data-h2-border-left": "base(x1 solid dt-primary)",
  },
  "dt-secondary": {
    "data-h2-border-left": "base(x1 solid dt-secondary)",
  },
  "dt-gray": {
    "data-h2-border-left": "base(x1 solid dt-gray)",
  },
};

export const borderKeyMap: Record<PoolCandidateStatus, BorderMapKey> = {
  // Gold
  [PoolCandidateStatus.Draft]: "cta",
  [PoolCandidateStatus.DraftExpired]: "cta",
  // Purple
  [PoolCandidateStatus.NewApplication]: "dt-primary",
  [PoolCandidateStatus.ApplicationReview]: "dt-primary",
  [PoolCandidateStatus.ScreenedIn]: "dt-primary",
  [PoolCandidateStatus.UnderAssessment]: "dt-primary",
  // Navy
  [PoolCandidateStatus.QualifiedAvailable]: "dt-secondary",
  [PoolCandidateStatus.QualifiedUnavailable]: "dt-secondary",
  [PoolCandidateStatus.QualifiedWithdrew]: "dt-secondary",
  [PoolCandidateStatus.PlacedCasual]: "dt-secondary",
  [PoolCandidateStatus.PlacedTerm]: "dt-secondary",
  [PoolCandidateStatus.PlacedIndeterminate]: "dt-secondary",
  // Gray
  [PoolCandidateStatus.ScreenedOutApplication]: "dt-gray",
  [PoolCandidateStatus.ScreenedOutAssessment]: "dt-gray",
  [PoolCandidateStatus.Expired]: "dt-gray",
  [PoolCandidateStatus.Removed]: "dt-gray",
};

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
