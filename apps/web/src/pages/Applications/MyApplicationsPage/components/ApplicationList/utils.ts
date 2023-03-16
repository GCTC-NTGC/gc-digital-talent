import { groupBy } from "@gc-digital-talent/helpers";

import { PoolCandidate, PoolCandidateStatus } from "~/api/generated";

type ApplicationGroups = "drafts" | "submitted" | "historical";

const submittedStatuses = [
  PoolCandidateStatus.NewApplication,
  PoolCandidateStatus.ApplicationReview,
  PoolCandidateStatus.QualifiedAvailable,
  PoolCandidateStatus.UnderAssessment,
];

/**
 * Group applications by status
 *
 * @param applications Applications to group
 * @returns Dictionary<PoolCandidate[]>;
 */
// eslint-disable-next-line import/prefer-default-export
export const groupApplicationsByStatus = (
  applications: Array<PoolCandidate>,
) => {
  return groupBy<
    ApplicationGroups,
    PoolCandidate,
    (arg: PoolCandidate) => ApplicationGroups
  >(applications, (application) => {
    if (application.status === PoolCandidateStatus.Draft) {
      return "drafts";
    }
    if (application.status && submittedStatuses.includes(application.status)) {
      return "submitted";
    }

    return "historical";
  });
};
