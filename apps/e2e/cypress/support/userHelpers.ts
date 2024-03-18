import {
  ArmedForcesStatus,
  CitizenshipStatus,
  ProvinceOrTerritory,
  WorkRegion,
  OperationalRequirement,
  PositionDuration,
  Skill,
  GenericJobTitle,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

type CreateApplicationArgs = {
  email: string;
  sub: string;
  skill: Skill;
  genericJobTitle: GenericJobTitle;
  userAlias: string;
};

export function createApplicant({
  email,
  sub,
  skill,
  userAlias,
}: CreateApplicationArgs) {
  cy.createUser({
    email: email ? `cypress.user.${Date.now().valueOf()}@example.org` : null,
    sub: sub ? `cypress.sub.${Date.now().valueOf()}` : null,
    currentProvince: ProvinceOrTerritory.Ontario,
    currentCity: "Test City",
    telephone: "+10123456789",
    armedForcesStatus: ArmedForcesStatus.NonCaf,
    citizenship: CitizenshipStatus.Citizen,
    lookingForEnglish: true,
    isGovEmployee: false,
    isWoman: true,
    hasPriorityEntitlement: false,
    hasDiploma: true,
    locationPreferences: [WorkRegion.Ontario],
    acceptedOperationalRequirements: [
      OperationalRequirement.OvertimeOccasional,
    ],
    positionDuration: [PositionDuration.Permanent],
    personalExperiences: {
      create: [
        {
          description: "Test Experience Description",
          details: "A Cypress test personal experience",
          skills: {
            sync: [
              {
                details: `Test Skill ${skill.name.en}`,
                id: skill.id,
              },
            ],
          },
          startDate: FAR_PAST_DATE,
          title: "Test Experience",
        },
      ],
    },
  }).as(userAlias);
}

export function addRolesToUser(userId: string, roles: string[], team?: string) {
  cy.getRoles().then(($roles) => {
    const roleIds = $roles
      .filter((role) => roles.includes(role.name))
      .map((role) => role.id);
    cy.updateUserRoles({
      userId,
      roleAssignmentsInput: {
        attach: {
          roles: roleIds,
          team,
        },
      },
    });
  });
}
