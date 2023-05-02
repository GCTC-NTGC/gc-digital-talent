import { WorkRegion } from "@gc-digital-talent/web/src/api/generated";

export function createSearchRequest({
  classificationId,
  departmentId,
  poolId,
  searchRequestAlias,
}) {
  cy.createPoolCandidateSearchRequest({
    fullName: "Cypress Test",
    email: "cypress@test.com",
    department: {
      connect: departmentId,
    },
    jobTitle: "Cypress Tester",
    additionalComments: "Cypress additional comments",
    applicantFilter: {
      create: {
        hasDiploma: true,
        locationPreferences: [WorkRegion.Ontario],
        expectedClassifications: {
          sync: [classificationId],
        },
        pools: {
          sync: [poolId],
        },
      },
    },
  }).as(searchRequestAlias);
}
