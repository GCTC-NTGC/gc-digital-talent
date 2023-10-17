import { SortingFnOption } from "@tanstack/react-table";

import { PoolCandidate, PoolCandidateStatus } from "@gc-digital-talent/graphql";

const sortOrder = [
  PoolCandidateStatus.PlacedIndeterminate,
  PoolCandidateStatus.PlacedTerm,
  PoolCandidateStatus.PlacedCasual,
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
const sortStatus: SortingFnOption<PoolCandidate> = (
  { original: a },
  { original: b },
) => {
  const aPosition = sortOrder.indexOf(
    a.status ?? PoolCandidateStatus.Expired, // if status undefined fallback to treating as last status in ordering
  );
  const bPosition = sortOrder.indexOf(b.status ?? PoolCandidateStatus.Expired);
  if (aPosition >= 0 && bPosition >= 0)
    return (
      sortOrder.indexOf(a.status ?? PoolCandidateStatus.Expired) -
      sortOrder.indexOf(b.status ?? PoolCandidateStatus.Expired)
    );
  if (aPosition >= 0 && bPosition < 0) return -1;
  if (aPosition < 0 && bPosition >= 0) return 1;
  return 0;
};

export default sortStatus;
