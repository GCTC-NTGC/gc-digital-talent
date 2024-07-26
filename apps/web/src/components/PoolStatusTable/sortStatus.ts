import { SortingFnOption } from "@tanstack/react-table";

import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import { PoolStatusTablePoolCandidate } from "./types";

const sortOrder = [
  PoolCandidateStatus.PlacedIndeterminate,
  PoolCandidateStatus.PlacedTerm,
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedTentative,
  PoolCandidateStatus.QualifiedAvailable,
  PoolCandidateStatus.QualifiedUnavailable,
  PoolCandidateStatus.QualifiedWithdrew,
  PoolCandidateStatus.UnderAssessment,
  PoolCandidateStatus.ScreenedIn,
  PoolCandidateStatus.ScreenedOutAssessment,
  PoolCandidateStatus.ScreenedOutNotInterested,
  PoolCandidateStatus.ScreenedOutNotResponsive,
  PoolCandidateStatus.ScreenedOutApplication,
  PoolCandidateStatus.ApplicationReview,
  PoolCandidateStatus.NewApplication,
  PoolCandidateStatus.Removed,
  PoolCandidateStatus.Draft,
  PoolCandidateStatus.DraftExpired,
  PoolCandidateStatus.Expired,
];

// eslint-disable-next-line import/prefer-default-export
const sortStatus: SortingFnOption<PoolStatusTablePoolCandidate> = (
  { original: a },
  { original: b },
) => {
  const aPosition = sortOrder.indexOf(
    a.status?.value ?? PoolCandidateStatus.Expired, // if status undefined fallback to treating as last status in ordering
  );
  const bPosition = sortOrder.indexOf(
    b.status?.value ?? PoolCandidateStatus.Expired,
  );
  if (aPosition >= 0 && bPosition >= 0)
    return (
      sortOrder.indexOf(a.status?.value ?? PoolCandidateStatus.Expired) -
      sortOrder.indexOf(b.status?.value ?? PoolCandidateStatus.Expired)
    );
  if (aPosition >= 0 && bPosition < 0) return -1;
  if (aPosition < 0 && bPosition >= 0) return 1;
  return 0;
};

export default sortStatus;
