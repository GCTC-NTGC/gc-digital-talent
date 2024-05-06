import React from "react";
import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import {
  Locales,
  commonMessages,
  getCandidateSuspendedFilterStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
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
  Language,
  PoolCandidate,
  PoolCandidateStatus,
  ProvinceOrTerritory,
  SortOrder,
  AssessmentStep,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  getCandidateStatusChip,
  statusToJobPlacement,
} from "~/utils/poolCandidate";
import {
  stringToEnumCandidateExpiry,
  stringToEnumCandidateSuspended,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPoolCandidateStatus,
} from "~/utils/userUtils";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { FormValues } from "./types";
import tableMessages from "./tableMessages";
import CandidateBookmark from "../CandidateBookmark/CandidateBookmark";

export const statusCell = (
  status: PoolCandidateStatus | null | undefined,
  intl: IntlShape,
) => {
  if (!status) return null;

  if (status === PoolCandidateStatus.NewApplication) {
    return (
      <span
        data-h2-color="base(tertiary.darker)"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(getPoolCandidateStatus(status as string))}
      </span>
    );
  }
  if (
    status === PoolCandidateStatus.ApplicationReview ||
    status === PoolCandidateStatus.ScreenedIn ||
    status === PoolCandidateStatus.ScreenedOutApplication ||
    status === PoolCandidateStatus.ScreenedOutNotInterested ||
    status === PoolCandidateStatus.ScreenedOutNotResponsive ||
    status === PoolCandidateStatus.UnderAssessment ||
    status === PoolCandidateStatus.ScreenedOutAssessment
  ) {
    return (
      <span data-h2-font-weight="base(700)">
        {intl.formatMessage(getPoolCandidateStatus(status as string))}
      </span>
    );
  }
  return (
    <span>{intl.formatMessage(getPoolCandidateStatus(status as string))}</span>
  );
};

export const priorityCell = (
  priority: number | null | undefined,
  intl: IntlShape,
) => {
  if (!priority) return null;

  if (priority === 10 || priority === 20) {
    return (
      <span
        data-h2-color="base(primary.darker)"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(getPoolCandidatePriorities(priority))}
      </span>
    );
  }
  return (
    <span>{intl.formatMessage(getPoolCandidatePriorities(priority))}</span>
  );
};

export const candidateNameCell = (
  candidate: PoolCandidate,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
  const candidateName = getFullNameLabel(
    candidate.user.firstName,
    candidate.user.lastName,
    intl,
  );
  return (
    <Link href={paths.poolCandidateApplication(candidate.id)}>
      {candidateName}
    </Link>
  );
};

export const processCell = (
  pool: Pool,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
  const poolName = getFullPoolTitleLabel(intl, pool);
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

export const candidacyStatusAccessor = (
  suspendedAt: string | null | undefined,
  intl: IntlShape,
) => {
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

  if (suspendedAt) {
    const parsedSuspendedTime = parseDateTimeUtc(suspendedAt);
    const currentTime = new Date();
    return intl.formatMessage(
      getCandidateSuspendedFilterStatus(
        getSuspendedStatus(parsedSuspendedTime, currentTime),
      ),
    );
  }

  return intl.formatMessage(
    getCandidateSuspendedFilterStatus(CandidateSuspendedFilter.Active),
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

// callbacks extracted to separate function to stabilize memoized component
export const preferredLanguageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {intl.formatMessage(
      language ? getLanguage(language) : commonMessages.notFound,
    )}
  </span>
);

export const currentLocationAccessor = (
  city: string | null | undefined,
  province: ProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  `${city || intl.formatMessage(commonMessages.notFound)}, ${intl.formatMessage(
    province
      ? getProvinceOrTerritory(province as string)
      : commonMessages.notFound,
  )}`;

export const finalDecisionCell = (
  intl: IntlShape,
  poolCandidate: PoolCandidate,
  poolAssessmentSteps: AssessmentStep[],
) => {
  const { color, label } = getCandidateStatusChip(
    poolCandidate,
    unpackMaybes(poolAssessmentSteps),
    intl,
  );
  return <Chip color={color}>{label}</Chip>;
};

export const jobPlacementCell = (
  intl: IntlShape,
  status?: Maybe<PoolCandidateStatus>,
) => {
  return <span>{intl.formatMessage(statusToJobPlacement(status))}</span>;
};

export const bookmarkCell = (candidate: PoolCandidate) => {
  return <CandidateBookmark candidate={candidate} size="lg" />;
};

export const bookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    data-h2-width="base(x1)"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

// row(s) are becoming selected or deselected
// if row is null then toggle all rows on the page simultaneously
type RowSelectedEvent<T> = {
  row?: T;
  setSelected: boolean;
};

// pass in the event and setSelectedRows will be called with the right set of rows
export function handleRowSelectedChange<T>(
  allRows: T[],
  selectedRows: T[],
  setSelectedRows: (rows: T[]) => void,
  { row, setSelected }: RowSelectedEvent<T>,
): void {
  if (row && setSelected) {
    // row is provided, add row to selected list
    setSelectedRows([...selectedRows, row]);
  }
  if (row && !setSelected) {
    // row is provided, remove row from selected list
    setSelectedRows(selectedRows.filter((r) => r !== row));
  }
  if (!row && setSelected) {
    // row not provided, add all rows to selected list
    setSelectedRows([...allRows]);
  }
  if (!row && !setSelected) {
    // row not provided, remove all rows from selected list
    setSelectedRows([]);
  }
}

export function transformSortStateToOrderByClause(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
): QueryPoolCandidatesPaginatedOrderByRelationOrderByClause {
  const columnMap = new Map<string, string>([
    ["dateReceived", "submitted_at"],
    ["candidacyStatus", "suspended_at"],
    ["finalDecision", "status"],
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
  ]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  console.log(sortingRule);

  if (
    sortingRule &&
    ["dateReceived", "candidacyStatus", "status", "notes"].includes(
      sortingRule.id,
    )
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: columnName,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
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
    console.log("is skill count");
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
): QueryPoolCandidatesPaginatedOrderByRelationOrderByClause[] {
  const hasProcess = sortingRules?.find((rule) => rule.id === "process");
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
          stream
          classification {
            id
            name {
              en
              fr
            }
            group
            level
          }
        }
        pool {
          id
          essentialSkills {
            id
            key
            name {
              en
              fr
            }
            category
          }
          nonessentialSkills {
            id
            key
            name {
              en
              fr
            }
            category
          }
        }
        user {
          id
          email
          firstName
          lastName
          telephone
          preferredLang
          preferredLanguageForInterview
          preferredLanguageForExam
          lookingForEnglish
          lookingForFrench
          lookingForBilingual
          firstOfficialLanguage
          secondLanguageExamCompleted
          secondLanguageExamValidity
          comprehensionLevel
          writtenLevel
          verbalLevel
          estimatedLanguageAbility
          isGovEmployee
          govEmployeeType
          hasPriorityEntitlement
          priorityNumber
          priorityWeight
          locationPreferences
          locationExemptions
          positionDuration
          acceptedOperationalRequirements
          isWoman
          indigenousCommunities
          indigenousDeclarationSignature
          isVisibleMinority
          hasDisability
          citizenship
          armedForcesStatus
          currentCity
          currentProvince
          topTechnicalSkillsRanking {
            id
            user {
              id
            }
            skill {
              id
              key
              category
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
              category
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
              category
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
              category
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
              category
              experienceSkillRecord {
                details
              }
            }
            ... on AwardExperience {
              title
              issuedBy
              awardedDate
              awardedTo
              awardedScope
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
              type
              status
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
        educationRequirementOption
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
            category
            experienceSkillRecord {
              details
            }
          }
          ... on AwardExperience {
            title
            issuedBy
            awardedDate
            awardedTo
            awardedScope
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
            type
            status
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
        status
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
      input?.applicantFilter?.qualifiedClassifications
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
      qualifiedClassifications: data.classifications.map((classification) => {
        const splitString = classification.split("-");
        return { group: splitString[0], level: Number(splitString[1]) };
      }),
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
    priorityWeight: data.priorityWeight.map((priority) => {
      return Number(priority);
    }),
    expiryStatus: data.expiryStatus
      ? stringToEnumCandidateExpiry(data.expiryStatus)
      : undefined,
    suspendedStatus: data.suspendedStatus
      ? stringToEnumCandidateSuspended(data.suspendedStatus)
      : undefined,
    isGovEmployee: data.govEmployee ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
    publishingGroups: data.publishingGroups as PublishingGroup[],
  };
}
