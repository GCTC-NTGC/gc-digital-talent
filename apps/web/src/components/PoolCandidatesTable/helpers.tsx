import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import {
  Locales,
  commonMessages,
  getLocalizedName,
  MaybeLocalizedEnums,
  getLocalizedEnumStringByValue,
} from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Link, Chip, Spoiler } from "@gc-digital-talent/ui";
import {
  graphql,
  CandidateExpiryFilter,
  PoolStream,
  PublishingGroup,
  Maybe,
  Pool,
  PoolCandidatePoolNameOrderByInput,
  OrderByRelationWithColumnAggregateFunction,
  PoolCandidateSearchInput,
  QueryPoolCandidatesPaginatedOrderByRelationOrderByClause,
  QueryPoolCandidatesPaginatedOrderByUserColumn,
  CandidateSuspendedFilter,
  PoolCandidate,
  SortOrder,
  FragmentType,
  AssessmentResultStatus,
  LocalizedProvinceOrTerritory,
  QueryPoolCandidatesPaginatedOrderByPoolColumn,
  PriorityWeight,
  Classification,
  LocalizedFinalDecision,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import { getCandidateStatusChip } from "~/utils/poolCandidate";
import {
  stringToEnumCandidateExpiry,
  stringToEnumCandidateSuspended,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPoolCandidateStatus,
  stringToEnumPriorityWeight,
} from "~/utils/userUtils";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { FormValues } from "./types";
import tableMessages from "./tableMessages";
import CandidateBookmark, {
  PoolCandidate_BookmarkFragment,
} from "../CandidateBookmark/CandidateBookmark";

export const priorityCell = (
  priorityWeight: number | null | undefined,
  priorities: MaybeLocalizedEnums | undefined,
  intl: IntlShape,
) => {
  let priority: PriorityWeight | null = null;
  switch (priorityWeight) {
    case 10:
      priority = PriorityWeight.PriorityEntitlement;
      break;
    case 20:
      priority = PriorityWeight.Veteran;
      break;
    case 30:
      priority = PriorityWeight.CitizenOrPermanentResident;
      break;
    default:
    // null
  }

  if (!priority) return null;

  const label = getLocalizedEnumStringByValue(priority, priorities, intl);

  if (priorityWeight === 10 || priorityWeight === 20) {
    return (
      <span
        data-h2-color="base(primary.darker)"
        data-h2-font-weight="base(700)"
      >
        {label}
      </span>
    );
  }
  return <span>{label}</span>;
};

export const candidateNameCell = (
  candidate: PoolCandidate,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  tableCandidateIds?: string[],
) => {
  const candidateName = getFullNameLabel(
    candidate.user.firstName,
    candidate.user.lastName,
    intl,
  );
  return (
    <Link
      href={paths.poolCandidateApplication(candidate.id)}
      state={{ candidateIds: tableCandidateIds, stepName: null }}
    >
      {candidateName}
    </Link>
  );
};

export const processCell = (
  pool: Pick<Pool, "id" | "stream" | "name" | "publishingGroup"> & {
    classification?: Maybe<Pick<Classification, "group" | "level">>;
  },
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
  const poolName = getFullPoolTitleLabel(intl, {
    stream: pool.stream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });
  return (
    <Link
      href={paths.poolView(pool.id)}
      aria-label={
        intl.formatMessage(processMessages.process) +
        intl.formatMessage(commonMessages.dividingColon) +
        poolName
      }
    >
      {poolName}
    </Link>
  );
};

// suspended_at is a time, must output ACTIVE or SUSPENDED strings for column viewing and sorting
const getSuspendedStatus = (
  suspendedTime: Date,
  currentTime: Date,
): CandidateSuspendedFilter => {
  if (suspendedTime >= currentTime) {
    return CandidateSuspendedFilter.Active;
  }
  return CandidateSuspendedFilter.Suspended;
};

export const candidacyStatusAccessor = (
  suspendedAt: string | null | undefined,
  suspendedStatusStrings: MaybeLocalizedEnums | undefined,
  intl: IntlShape,
) => {
  if (suspendedAt) {
    const parsedSuspendedTime = parseDateTimeUtc(suspendedAt);
    const currentTime = new Date();
    const suspendedStatus = getSuspendedStatus(
      parsedSuspendedTime,
      currentTime,
    );
    return getLocalizedEnumStringByValue(
      suspendedStatus,
      suspendedStatusStrings,
      intl,
    );
  }

  return getLocalizedEnumStringByValue(
    CandidateSuspendedFilter.Active,
    suspendedStatusStrings,
    intl,
  );
};

export const notesCell = (candidate: PoolCandidate, intl: IntlShape) =>
  candidate?.notes ? (
    <Spoiler
      text={candidate.notes}
      linkSuffix={intl.formatMessage(
        {
          defaultMessage: "notes for {name}",
          id: "CZbb7c",
          description:
            "Link text suffix to read more notes for a pool candidate",
        },
        {
          name: getFullNameLabel(
            candidate.user.firstName,
            candidate.user.lastName,
            intl,
          ),
        },
      )}
    />
  ) : null;

export const currentLocationAccessor = (
  city: string | null | undefined,
  province: LocalizedProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  `${city || intl.formatMessage(commonMessages.notFound)}, ${getLocalizedName(province?.label, intl)}`;

export const finalDecisionCell = (
  finalDecision: Maybe<LocalizedFinalDecision> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
) => {
  const { color, label } = getCandidateStatusChip(
    finalDecision,
    assessmentStatus,
    intl,
  );
  return <Chip color={color}>{label}</Chip>;
};

export const bookmarkCell = (
  candidate: FragmentType<typeof PoolCandidate_BookmarkFragment>,
) => {
  return <CandidateBookmark candidateQuery={candidate} size="lg" />;
};

export const bookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    data-h2-width="base(x1)"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

function transformSortStateToOrderByClause(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
): QueryPoolCandidatesPaginatedOrderByRelationOrderByClause {
  const columnMap = new Map<string, string>([
    ["dateReceived", "submitted_at"],
    ["candidacyStatus", "suspended_at"],
    ["finalDecision", "computed_final_decision_weight"],
    ["jobPlacement", "status"],
    ["candidateName", "FIRST_NAME"],
    ["email", "EMAIL"],
    ["preferredLang", "PREFERRED_LANG"],
    ["currentLocation", "CURRENT_CITY"],
    ["skillCount", "skill_count"],
    ["priority", "PRIORITY_WEIGHT"],
    ["status", "status_weight"],
    ["notes", "notes"],
    ["skillCount", "skillCount"],
    ["processNumber", "PROCESS_NUMBER"],
  ]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  if (
    sortingRule &&
    [
      "dateReceived",
      "candidacyStatus",
      "status",
      "notes",
      "finalDecision",
    ].includes(sortingRule.id)
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: columnName,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }

  if (sortingRule && ["processNumber"].includes(sortingRule.id)) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      pool: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column: columnName as QueryPoolCandidatesPaginatedOrderByPoolColumn,
      },
    };
  }

  if (
    sortingRule &&
    [
      "candidateName",
      "email",
      "preferredLang",
      "currentLocation",
      "priority",
    ].includes(sortingRule.id)
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column: columnName as QueryPoolCandidatesPaginatedOrderByUserColumn,
      },
    };
  }

  if (
    sortingRule &&
    sortingRule.id === "skillCount" &&
    filterState?.applicantFilter?.skills &&
    filterState.applicantFilter.skills.length > 0
  ) {
    return {
      column: "skill_count",
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }
  // input cannot be optional for QueryPoolCandidatesPaginatedOrderByRelationOrderByClause
  // default final sort is column candidateName,

  return {
    column: undefined,
    order: SortOrder.Asc,
    user: {
      aggregate: OrderByRelationWithColumnAggregateFunction.Max,
      column: "FIRST_NAME" as QueryPoolCandidatesPaginatedOrderByUserColumn,
    },
  };
}

export function getSortOrder(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
  doNotUseBookmark?: boolean,
  currentPool?: Maybe<Pick<Pool, "id">>,
): QueryPoolCandidatesPaginatedOrderByRelationOrderByClause[] {
  const hasProcess = sortingRules?.find((rule) => rule.id === "process");

  // handle sort in orderByClaimVerification
  if (!!sortingRules?.find((rule) => rule.id === "priority") && !!currentPool) {
    return [];
  }

  return [
    ...(doNotUseBookmark
      ? []
      : [{ column: "is_bookmarked", order: SortOrder.Desc }]),
    // Do not apply other filters if we are sorting by process
    ...(!hasProcess
      ? [transformSortStateToOrderByClause(sortingRules, filterState)]
      : []),
  ];
}

export function getClaimVerificationSort(
  sortingState?: SortingState,
  currentPool?: Maybe<Pick<Pool, "id">>,
): Maybe<SortOrder> | undefined {
  if (!!currentPool && !!sortingState?.find((rule) => rule.id === "priority")) {
    // sort only triggers off category sort and current pool -> then no sorting is done in getSortOrder
    const sortOrder = sortingState.find((rule) => rule.id === "priority");
    if (sortOrder) {
      return sortOrder.desc ? SortOrder.Desc : SortOrder.Asc;
    }
  }

  return undefined;
}

export function getPoolNameSort(
  sortingRules?: SortingState,
  locale?: Locales,
): PoolCandidatePoolNameOrderByInput | undefined {
  const sortingRule = sortingRules?.find((rule) => rule.id === "process");

  if (!sortingRule) return undefined;

  return {
    locale: locale ?? "en",
    order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
  };
}

export const PoolCandidatesTable_SelectPoolCandidatesQuery = graphql(
  /* GraphQL */ `
    query PoolCandidatesTable_SelectPoolCandidates($ids: [ID]!) {
      poolCandidates(includeIds: $ids) {
        id
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
            name {
              en
              fr
            }
            group
            level
          }
          poolSkills {
            skill {
              id
              key
              name {
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
            }
          }
        }
        user {
          ...ProfileDocument
          id
          email
          firstName
          lastName
          telephone
          priority {
            value
            label {
              en
              fr
            }
          }
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
          priorityWeight
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
          currentCity
          currentProvince {
            value
            label {
              en
              fr
            }
          }
          topTechnicalSkillsRanking {
            id
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
        }
        educationRequirementOption {
          value
          label {
            en
            fr
          }
        }
        educationRequirementExperiences {
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
        generalQuestionResponses {
          id
          answer
          generalQuestion {
            id
            question {
              en
              fr
            }
          }
        }
        expiryDate
        status {
          value
          label {
            en
            fr
          }
        }
        submittedAt
        notes
        archivedAt
      }
    }
  `,
);
export function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
): FormValues {
  return {
    publishingGroups: input?.publishingGroups?.filter(notEmpty) ?? [],
    classifications:
      input?.appliedClassifications
        ?.filter(notEmpty)
        .map((c) => `${c.group}-${c.level}`) ?? [],
    stream: input?.applicantFilter?.qualifiedStreams?.filter(notEmpty) ?? [],
    languageAbility: input?.applicantFilter?.languageAbility ?? "",
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirement:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    equity: input?.applicantFilter?.equity
      ? [
          ...(input.applicantFilter.equity.hasDisability
            ? ["hasDisability"]
            : []),
          ...(input.applicantFilter.equity.isIndigenous
            ? ["isIndigenous"]
            : []),
          ...(input.applicantFilter.equity.isVisibleMinority
            ? ["isVisibleMinority"]
            : []),
          ...(input.applicantFilter.equity.isWoman ? ["isWoman"] : []),
        ]
      : [],
    pools:
      input?.applicantFilter?.pools
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.id) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    priorityWeight: input?.priorityWeight?.map((pw) => String(pw)) ?? [],
    poolCandidateStatus: input?.poolCandidateStatus?.filter(notEmpty) ?? [],
    expiryStatus: input?.expiryStatus
      ? input.expiryStatus
      : CandidateExpiryFilter.Active,
    suspendedStatus: input?.suspendedStatus
      ? input.suspendedStatus
      : CandidateSuspendedFilter.Active,
    govEmployee: input?.isGovEmployee ? "true" : "",
  };
}

export function transformFormValuesToFilterState(
  data: FormValues,
): PoolCandidateSearchInput {
  return {
    applicantFilter: {
      languageAbility: data.languageAbility
        ? stringToEnumLanguage(data.languageAbility)
        : undefined,
      qualifiedStreams: data.stream as PoolStream[],
      operationalRequirements: data.operationalRequirement
        .map((requirement) => {
          return stringToEnumOperational(requirement);
        })
        .filter(notEmpty),
      locationPreferences: data.workRegion
        .map((region) => {
          return stringToEnumLocation(region);
        })
        .filter(notEmpty),
      equity: {
        ...(data.equity.includes("isWoman") && { isWoman: true }),
        ...(data.equity.includes("hasDisability") && { hasDisability: true }),
        ...(data.equity.includes("isIndigenous") && { isIndigenous: true }),
        ...(data.equity.includes("isVisibleMinority") && {
          isVisibleMinority: true,
        }),
      },
      pools: data.pools.map((id) => {
        return { id };
      }),
      skills: data.skills.map((id) => {
        return { id };
      }),
    },
    poolCandidateStatus: data.poolCandidateStatus
      .map((status) => {
        return stringToEnumPoolCandidateStatus(status);
      })
      .filter(notEmpty),
    priorityWeight: data.priorityWeight
      .map((priorityWeight) => {
        return stringToEnumPriorityWeight(priorityWeight);
      })
      .filter(notEmpty),
    expiryStatus: data.expiryStatus
      ? stringToEnumCandidateExpiry(data.expiryStatus)
      : undefined,
    suspendedStatus: data.suspendedStatus
      ? stringToEnumCandidateSuspended(data.suspendedStatus)
      : undefined,
    isGovEmployee: data.govEmployee ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
    publishingGroups: data.publishingGroups as PublishingGroup[],
    appliedClassifications: data.classifications.map((classification) => {
      const splitString = classification.split("-");
      return { group: splitString[0], level: Number(splitString[1]) };
    }),
  };
}
