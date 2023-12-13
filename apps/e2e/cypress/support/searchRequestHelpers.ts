import { PoolCandidateSearchRequestReason } from "@gc-digital-talent/web/src/api/generated";
import {
  PoolCandidateSearchPositionType,
  WorkRegion,
} from "@gc-digital-talent/web/src/api/generated";

type CreateSearchRequestArgs = {
  classificationId: string;
  departmentId: string;
  poolId: string;
  searchRequestAlias: string;
};

export function createSearchRequest({
  classificationId,
  departmentId,
  poolId,
  searchRequestAlias,
}: CreateSearchRequestArgs) {
  cy.createPoolCandidateSearchRequest({
    fullName: "Cypress Test",
    email: "cypress@test.com",
    department: {
      connect: departmentId,
    },
    jobTitle: "Cypress Tester",
    managerJobTitle: "",
    positionType: PoolCandidateSearchPositionType.IndividualContributor,
    additionalComments: "Cypress additional comments",
    reason: PoolCandidateSearchRequestReason.GeneralInterest,
    applicantFilter: {
      create: {
        locationPreferences: [WorkRegion.Ontario],
        pools: {
          sync: [poolId],
        },
      },
    },
  }).as(searchRequestAlias);
}
