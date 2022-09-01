import { Maybe, PoolCandidateStatus } from "../../api/generated";

export const isDraft = (status: Maybe<PoolCandidateStatus>): boolean => {
  return status
    ? [PoolCandidateStatus.Draft, PoolCandidateStatus.DraftExpired].includes(
        status,
      )
    : false;
};

export const canBeArchived = (status: Maybe<PoolCandidateStatus>): boolean => {
  return status
    ? [
        PoolCandidateStatus.Expired,
        PoolCandidateStatus.ScreenedOutApplication,
        PoolCandidateStatus.ScreenedOutAssessment,
      ].includes(status)
    : false;
};
