// at the top as auto-format breaks the eslint ignore
import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import { tv } from "tailwind-variants";

import { IconType } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  AssessmentDecision,
  Maybe,
  AssessmentStep,
  ClaimVerificationResult,
  AssessmentStepTracker_CandidateFragment,
  PoolCandidateSearchInput,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  AssessmentStepTracker_PoolFragment as AssessmentStepTrackerPoolType,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { NO_DECISION, NullableDecision } from "~/utils/assessmentResults";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  ResultDecisionCounts,
  isDisqualifiedStatus,
  isRemovedStatus,
} from "~/utils/poolCandidate";
import {
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPriorityWeight,
} from "~/utils/userUtils";

import { FormValues } from "./types";

export interface CandidateAssessmentResult {
  poolCandidate: AssessmentStepTracker_CandidateFragment;
  decision: NullableDecision;
}

interface DecisionInfo {
  icon: IconType;
  name: string;
}

export const getDecisionInfo = (
  decision: Maybe<NullableDecision> | undefined,
  isApplicationStep: boolean,
  intl: IntlShape,
): DecisionInfo => {
  if (!decision || decision === NO_DECISION) {
    return {
      icon: ExclamationCircleIcon,
      name: intl.formatMessage(poolCandidateMessages.toAssess),
    };
  }

  if (decision === AssessmentDecision.Hold) {
    return {
      icon: PauseCircleIcon,
      name: intl.formatMessage(poolCandidateMessages.onHold),
    };
  }

  if (decision === AssessmentDecision.Unsuccessful) {
    return {
      icon: XCircleIcon,
      name: isApplicationStep
        ? intl.formatMessage(commonMessages.screenedOut)
        : intl.formatMessage(poolCandidateMessages.unsuccessful),
    };
  }

  return {
    icon: CheckCircleIcon,
    name: isApplicationStep
      ? intl.formatMessage(poolCandidateMessages.screenedIn)
      : intl.formatMessage(poolCandidateMessages.successful),
  };
};

export const decisionOrder: NullableDecision[] = [
  NO_DECISION,
  AssessmentDecision.Successful,
  AssessmentDecision.Hold,
  AssessmentDecision.Unsuccessful,
];

const getBookmarkValue = (result: CandidateAssessmentResult) => {
  return Number(result.poolCandidate?.isBookmarked);
};
const getDecisionValue = (decision: NullableDecision) => {
  return decisionOrder.indexOf(decision ?? NO_DECISION);
};
const getPriorityValue = (result: CandidateAssessmentResult) => {
  return Number(
    result.poolCandidate.priorityVerification ===
      ClaimVerificationResult.Accepted ||
      result.poolCandidate.priorityVerification ===
        ClaimVerificationResult.Unverified,
  );
};
const getVeteranValue = (result: CandidateAssessmentResult) => {
  return Number(
    result.poolCandidate.veteranVerification ===
      ClaimVerificationResult.Accepted ||
      result.poolCandidate.veteranVerification ===
        ClaimVerificationResult.Unverified,
  );
};
const compareLastNames = (
  resultA: CandidateAssessmentResult,
  resultB: CandidateAssessmentResult,
) => {
  const user1Name: string = resultA.poolCandidate?.user.lastName ?? "";
  const user2Name: string = resultB.poolCandidate?.user.lastName ?? "";
  return user1Name.localeCompare(user2Name);
};
const compareFirstNames = (
  resultA: CandidateAssessmentResult,
  resultB: CandidateAssessmentResult,
) => {
  const user1Name: string = resultA.poolCandidate?.user.firstName ?? "";
  const user2Name: string = resultB.poolCandidate?.user.firstName ?? "";
  return user1Name.localeCompare(user2Name);
};

/** Adds the ordinal for poolCandidates based on their sort order ignoring bookmarks
 * then resorts them with bookmarking and returns the result
 */
export const sortResultsAndAddOrdinal = (
  results: CandidateAssessmentResult[],
): (CandidateAssessmentResult & { ordinal: number })[] => {
  // Do the first sort to determine order without bookmarking
  const firstSortResults = results.sort((resultA, resultB) => {
    return (
      getDecisionValue(resultA.decision) - getDecisionValue(resultB.decision) ||
      getPriorityValue(resultB) - getPriorityValue(resultA) ||
      getVeteranValue(resultB) - getVeteranValue(resultA) ||
      compareLastNames(resultA, resultB) ||
      compareFirstNames(resultA, resultB)
    );
  });

  // Iterate through the results adding an ordinal based on index
  const resultsWithOrdinal = firstSortResults.map((result, index) => {
    return {
      ...result,
      ordinal: index + 1,
    };
  });

  // Resort the results - this time using bookmarks as well
  return resultsWithOrdinal.sort((resultA, resultB) => {
    return (
      getBookmarkValue(resultB) - getBookmarkValue(resultA) ||
      getDecisionValue(resultA.decision) - getDecisionValue(resultB.decision) ||
      getPriorityValue(resultB) - getPriorityValue(resultA) ||
      getVeteranValue(resultB) - getVeteranValue(resultA) ||
      compareLastNames(resultA, resultB) ||
      compareFirstNames(resultA, resultB)
    );
  });
};

const filterCandidatesByDecision = (
  results: CandidateAssessmentResult[],
  assessmentDecision: NullableDecision | null,
) => {
  return results.filter((result) => result.decision === assessmentDecision);
};

// define the type for an assessment step nested in the fragment
const stepTrackerFragmentSteps: AssessmentStepTrackerPoolType["assessmentSteps"] =
  [];
// eslint-disable-next-line no-underscore-dangle
const _unpackedSteps = unpackMaybes(stepTrackerFragmentSteps);
type StepTrackerFragmentStepType = (typeof _unpackedSteps)[number];

interface StepWithGroupedCandidates {
  step: StepTrackerFragmentStepType;
  resultCounts?: ResultDecisionCounts;
  results: CandidateAssessmentResult[];
}

export const groupPoolCandidatesByStep = (
  steps: AssessmentStepTrackerPoolType["assessmentSteps"],
  candidates: Omit<PoolCandidate, "pool">[],
): StepWithGroupedCandidates[] => {
  const stepsUnpacked = unpackMaybes(steps);
  const orderedSteps = sortBy(stepsUnpacked, (step) => step.sortOrder);

  const stepsWithGroupedCandidates: StepWithGroupedCandidates[] =
    orderedSteps.map((step, index) => {
      const stepCandidates = candidates
        .filter((candidate) => {
          return candidate.assessmentStatus?.currentStep
            ? index + 1 <= candidate.assessmentStatus?.currentStep
            : true; // Null step indicates user passed all steps
        })
        .map((candidate) => {
          const stepDecision =
            candidate.assessmentStatus?.assessmentStepStatuses?.find(
              (decision) => decision?.step === step.id,
            );

          return {
            poolCandidate: candidate,
            decision: (stepDecision?.decision ??
              NO_DECISION) as NullableDecision,
          };
        });

      return {
        step: {
          id: step.id,
          type: step.type,
          title: step.title,
          sortOrder: step.sortOrder,
        },
        results: stepCandidates,
        resultCounts: {
          [NO_DECISION]: filterCandidatesByDecision(stepCandidates, NO_DECISION)
            .length,
          [AssessmentDecision.Hold]: filterCandidatesByDecision(
            stepCandidates,
            AssessmentDecision.Hold,
          ).length,
          [AssessmentDecision.Successful]: filterCandidatesByDecision(
            stepCandidates,
            AssessmentDecision.Successful,
          ).length,
          [AssessmentDecision.Unsuccessful]: filterCandidatesByDecision(
            stepCandidates,
            AssessmentDecision.Unsuccessful,
          ).length,
        },
      };
    });

  return stepsWithGroupedCandidates;
};

export interface ResultFilters {
  query: string;
  [NO_DECISION]: boolean;
  [AssessmentDecision.Successful]: boolean;
  [AssessmentDecision.Hold]: boolean;
  [AssessmentDecision.Unsuccessful]: boolean;
}

export const defaultFilters: ResultFilters = {
  query: "",
  [NO_DECISION]: true,
  [AssessmentDecision.Successful]: false,
  [AssessmentDecision.Hold]: false,
  [AssessmentDecision.Unsuccessful]: false,
};

export const filterResults = (
  filters: ResultFilters,
  steps: StepWithGroupedCandidates[],
): StepWithGroupedCandidates[] => {
  return steps.map((step) => {
    const filteredResults = step.results.filter(
      ({ poolCandidate: { user }, decision }) => {
        if (filters.query) {
          const fullName = [user.firstName, user.lastName]
            .filter(notEmpty)
            .join(" ")
            .toLowerCase();
          if (!fullName.includes(filters.query.toLowerCase())) {
            return false;
          }
        }

        return filters[decision];
      },
    );

    return {
      ...step,
      results: filteredResults,
    };
  });
};

// filter out candidates who are disqualified AND have an empty assessment results collection
export const filterAlreadyDisqualified = (
  candidates: Omit<PoolCandidate, "pool">[],
): Omit<PoolCandidate, "pool">[] => {
  const filteredResult = candidates.filter(
    (candidate) =>
      !(
        (isDisqualifiedStatus(candidate.status?.value) ||
          isRemovedStatus(candidate.status?.value)) &&
        (candidate.assessmentResults ?? []).length === 0
      ),
  );
  return filteredResult;
};

export const generateStepName = (
  step: Pick<AssessmentStep, "type" | "title">,
  intl: IntlShape,
): string => {
  // check if title exists in LocalizedString object, then return empty string if not for a truthy check
  const titleLocalized = getLocalizedName(step.title, intl, true);
  if (titleLocalized) {
    return titleLocalized;
  }
  if (step.type) {
    return getLocalizedName(step.type.label, intl);
  }
  return intl.formatMessage(commonMessages.notAvailable);
};

export function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
  poolId: string,
): FormValues {
  return {
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
    govEmployee: input?.isGovEmployee ? "true" : "",
    languageAbility: input?.applicantFilter?.languageAbility ?? "",
    operationalRequirements:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    pools: [poolId],
    priorityWeight: input?.priorityWeight?.map((pw) => String(pw)) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
  };
}

export function transformFormValuesToFilterState(
  data: FormValues,
  poolId: string,
): PoolCandidateSearchInput {
  return {
    applicantFilter: {
      equity: !isEmpty(data.equity)
        ? {
            ...(data.equity.includes("isWoman") && { isWoman: true }),
            ...(data.equity.includes("hasDisability") && {
              hasDisability: true,
            }),
            ...(data.equity.includes("isIndigenous") && { isIndigenous: true }),
            ...(data.equity.includes("isVisibleMinority") && {
              isVisibleMinority: true,
            }),
          }
        : undefined,
      languageAbility: !isEmpty(data.languageAbility)
        ? stringToEnumLanguage(data.languageAbility)
        : undefined,
      locationPreferences: !isEmpty(data.workRegion)
        ? data.workRegion
            .map((region) => {
              return stringToEnumLocation(region);
            })
            .filter(notEmpty)
        : undefined,
      operationalRequirements: !isEmpty(data.operationalRequirements)
        ? data.operationalRequirements
            .map((requirement) => {
              return stringToEnumOperational(requirement);
            })
            .filter(notEmpty)
        : undefined,
      pools: [{ id: poolId }],
      skills: !isEmpty(data.skills)
        ? data.skills.map((id) => {
            return { id };
          })
        : undefined,
    },
    isGovEmployee: data.govEmployee ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
    priorityWeight: !isEmpty(data.priorityWeight)
      ? data.priorityWeight
          .map((priorityWeight) => {
            return stringToEnumPriorityWeight(priorityWeight);
          })
          .filter(notEmpty)
      : undefined,
    expiryStatus: CandidateExpiryFilter.Active, // add default filters
    suspendedStatus: CandidateSuspendedFilter.Active,
  };
}

export const decisionIcon = tv({
  base: "size-4 text-warning",
  variants: {
    decision: {
      [NO_DECISION]: "text-warning",
      [AssessmentDecision.Hold]: "text-primary",
      [AssessmentDecision.Unsuccessful]: "text-error",
      [AssessmentDecision.Successful]: "text-success",
    },
  },
});
