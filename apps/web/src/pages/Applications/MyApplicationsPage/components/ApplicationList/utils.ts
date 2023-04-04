import { groupBy } from "@gc-digital-talent/helpers";

import { PoolCandidateStatus } from "~/api/generated";

import { Application } from "../../../ApplicantDashboardPage/types";

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
export const groupApplicationsByStatus = (applications: Array<Application>) => {
  return groupBy<
    ApplicationGroups,
    Application,
    (arg: Application) => ApplicationGroups
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
