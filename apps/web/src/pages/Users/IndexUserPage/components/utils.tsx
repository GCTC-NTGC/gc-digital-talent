import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";

import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  graphql,
  InputMaybe,
  OrderByClause,
  PositionDuration,
  RoleAssignment,
  SortOrder,
  Trashed,
  UserFilterInput,
} from "@gc-digital-talent/graphql";

import {
  durationToEnumPositionDuration,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
} from "~/utils/userUtils";

import { FormValues } from "./UserFilterDialog";
import ROLES_TO_HIDE_USERS_TABLE from "./constants";

export function rolesAccessor(
  roleAssignments: RoleAssignment[],
  intl: IntlShape,
): string | null {
  if (!roleAssignments) return null;

  const roles = roleAssignments.map((roleAssignment) => roleAssignment.role);
  const rolesFiltered = roles.filter(notEmpty);
  const rolesToDisplay = rolesFiltered
    .filter((role) => !ROLES_TO_HIDE_USERS_TABLE.includes(role.name))
    .map((role) => getLocalizedName(role.displayName, intl));
  const uniqueRolesToDisplay = uniqueItems(rolesToDisplay);

  return uniqueRolesToDisplay.join(", ");
}

export function transformUserInput(
  filterState: UserFilterInput | undefined,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): InputMaybe<UserFilterInput> | undefined {
  if (
    filterState === undefined &&
    searchBarTerm === undefined &&
    searchType === undefined
  ) {
    return undefined;
  }

  return {
    // search bar
    generalSearch: searchBarTerm && !searchType ? searchBarTerm : undefined,
    email: searchType === "email" ? searchBarTerm : undefined,
    name: searchType === "name" ? searchBarTerm : undefined,
    telephone: searchType === "phone" ? searchBarTerm : undefined,

    // from fancy filter
    applicantFilter: filterState?.applicantFilter,
    isGovEmployee: filterState?.isGovEmployee,
    isProfileComplete: filterState?.isProfileComplete,
    poolFilters: filterState?.poolFilters,
    roles: filterState?.roles,
    trashed: filterState?.trashed,
  };
}

export function transformSortStateToOrderByClause(
  sortingRule?: SortingState,
): OrderByClause | OrderByClause[] | undefined {
  const columnMap = new Map<string, string>([
    ["id", "id"],
    ["candidateName", "first_name"],
    ["email", "email"],
    ["telephone", "telephone"],
    ["preferredLang", "preferred_lang"],
    ["createdDate", "created_at"],
    ["updatedDate", "updated_at"],
  ]);

  const orderBy = sortingRule
    ?.map((rule) => {
      const columnName = columnMap.get(rule.id);
      if (!columnName) return undefined;
      return {
        column: columnName,
        order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    })
    .filter(notEmpty);

  return orderBy?.length ? orderBy : undefined;
}

export function transformFormValuesToUserFilterInput(
  data: FormValues,
): UserFilterInput {
  return {
    applicantFilter: {
      languageAbility: data.languageAbility
        ? stringToEnumLanguage(data.languageAbility)
        : undefined,
      locationPreferences: data.workRegion
        .map((region) => {
          return stringToEnumLocation(region);
        })
        .filter(notEmpty),
      operationalRequirements: data.operationalRequirement
        .map((requirement) => {
          return stringToEnumOperational(requirement);
        })
        .filter(notEmpty),
      skills: data.skills.map((skill) => {
        const skillString = skill;
        return { id: skillString };
      }),
      positionDuration: data.employmentDuration
        ? [durationToEnumPositionDuration(data.employmentDuration)].filter(
            notEmpty,
          )
        : undefined,
    },
    isGovEmployee: data.govEmployee[0] ? true : undefined,
    isProfileComplete: data.profileComplete[0] ? true : undefined,
    poolFilters: data.pools.map((pool) => {
      const poolString = pool;
      return { poolId: poolString };
    }),
    roles: data.roles,
    trashed: data.trashed[0] ? Trashed.Only : undefined,
  };
}

export function transformUserFilterInputToFormValues(
  input: UserFilterInput | undefined,
): FormValues {
  return {
    languageAbility: input?.applicantFilter?.languageAbility ?? "",
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirement:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    employmentDuration:
      input?.applicantFilter?.positionDuration &&
      input.applicantFilter.positionDuration.includes(
        PositionDuration.Temporary,
      )
        ? "TERM"
        : "INDETERMINATE",
    govEmployee: input?.isGovEmployee ? "true" : "",
    profileComplete: input?.isProfileComplete ? "true" : "",
    pools:
      input?.poolFilters
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.poolId) ?? [],
    roles: input?.roles?.filter(notEmpty) ?? [],
    trashed: input?.trashed ? "true" : "",
  };
}

export const UsersTable_SelectUsersQuery = graphql(/* GraphQL */ `
  query UsersTable_SelectUsers($ids: [ID]!) {
    applicants(includeIds: $ids) {
      id
      email
      firstName
      lastName
      telephone
      preferredLang {
        value
        label {
          en
          fr
        }
      }
      preferredLanguageForInterview {
        value
        label {
          en
          fr
        }
      }
      preferredLanguageForExam {
        value
        label {
          en
          fr
        }
      }
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      firstOfficialLanguage {
        value
        label {
          en
          fr
        }
      }
      secondLanguageExamCompleted
      secondLanguageExamValidity
      comprehensionLevel {
        value
        label {
          en
          fr
        }
      }
      writtenLevel {
        value
        label {
          en
          fr
        }
      }
      verbalLevel {
        value
        label {
          en
          fr
        }
      }
      estimatedLanguageAbility {
        value
        label {
          en
          fr
        }
      }
      isGovEmployee
      govEmployeeType {
        value
        label {
          en
          fr
        }
      }
      hasPriorityEntitlement
      priorityNumber
      locationPreferences {
        value
        label {
          en
          fr
        }
      }
      locationExemptions
      positionDuration
      acceptedOperationalRequirements {
        value
        label {
          en
          fr
        }
      }
      isWoman
      indigenousCommunities {
        value
        label {
          en
          fr
        }
      }
      indigenousDeclarationSignature
      isVisibleMinority
      hasDisability
      citizenship {
        value
        label {
          en
          fr
        }
      }
      armedForcesStatus {
        value
        label {
          en
          fr
        }
      }
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      experiences {
        id
        __typename
        user {
          id
          email
        }
        details
        skills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          keywords {
            en
            fr
          }
          category {
            value
            label {
              en
              fr
            }
          }
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo {
            value
            label {
              en
              fr
            }
          }
          awardedScope {
            value
            label {
              en
              fr
            }
          }
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type {
            value
            label {
              en
              fr
            }
          }
          status {
            value
            label {
              en
              fr
            }
          }
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
      poolCandidates {
        status {
          value
          label {
            en
            fr
          }
        }
        expiryDate
        user {
          id
        }
        pool {
          id
          name {
            en
            fr
          }
          stream {
            value
            label {
              en
              fr
            }
          }
          classification {
            id
            group
            level
          }
        }
        id
      }
      topTechnicalSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category {
            value
            label {
              en
              fr
            }
          }
          name {
            en
            fr
          }
        }
        skillLevel
        topSkillsRank
        improveSkillsRank
      }
      topBehaviouralSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category {
            value
            label {
              en
              fr
            }
          }
          name {
            en
            fr
          }
        }
        skillLevel
        topSkillsRank
        improveSkillsRank
      }
      improveTechnicalSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category {
            value
            label {
              en
              fr
            }
          }
          name {
            en
            fr
          }
        }
        skillLevel
        topSkillsRank
        improveSkillsRank
      }
      improveBehaviouralSkillsRanking {
        id
        user {
          id
        }
        skill {
          id
          key
          category {
            value
            label {
              en
              fr
            }
          }
          name {
            en
            fr
          }
        }
        skillLevel
        topSkillsRank
        improveSkillsRank
      }
    }
  }
`);
