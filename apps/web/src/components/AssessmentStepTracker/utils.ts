import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import sortBy from "lodash/sortBy";

import { IconType } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  AssessmentDecision,
  Maybe,
  AssessmentStep,
  ClaimVerificationResult,
  AssessmentStepTracker_CandidateFragment,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getAssessmentStepType,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import { NO_DECISION, NullableDecision } from "~/utils/assessmentResults";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  ResultDecisionCounts,
  determineCandidateStatusPerStep,
  determineCurrentStepPerCandidate,
  getDecisionCountForEachStep,
  isDisqualifiedStatus,
  isRemovedStatus,
} from "~/utils/poolCandidate";

export type CandidateAssessmentResult = {
  poolCandidate: AssessmentStepTracker_CandidateFragment;
  decision: NullableDecision;
};

type DecisionInfo = {
  colorStyle: Record<string, string>;
  icon: IconType;
  name: string;
};

export const getDecisionInfo = (
  decision: Maybe<NullableDecision> | undefined,
  isApplicationStep: boolean,
  intl: IntlShape,
): DecisionInfo => {
  if (!decision || decision === NO_DECISION) {
    return {
      icon: ExclamationCircleIcon,
      colorStyle: {
        "data-h2-color": "base(warning)",
      },
      name: intl.formatMessage(poolCandidateMessages.toAssess),
    };
  }

  if (decision === AssessmentDecision.Hold) {
    return {
      icon: PauseCircleIcon,
      colorStyle: {
        "data-h2-color": "base(secondary)",
      },
      name: intl.formatMessage(poolCandidateMessages.onHold),
    };
  }

  if (decision === AssessmentDecision.Unsuccessful) {
    return {
      icon: XCircleIcon,
      colorStyle: {
        "data-h2-color": "base(error)",
      },
      name: isApplicationStep
        ? intl.formatMessage(commonMessages.screenedOut)
        : intl.formatMessage(poolCandidateMessages.unsuccessful),
    };
  }

  return {
    icon: CheckCircleIcon,
    colorStyle: {
      "data-h2-color": "base(success)",
    },
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
  const user1Name: string = resultA.poolCandidate?.user.lastName || "";
  const user2Name: string = resultB.poolCandidate?.user.lastName || "";
  return user1Name.localeCompare(user2Name);
};
const compareFirstNames = (
  resultA: CandidateAssessmentResult,
  resultB: CandidateAssessmentResult,
) => {
  const user1Name: string = resultA.poolCandidate?.user.firstName || "";
  const user2Name: string = resultB.poolCandidate?.user.firstName || "";
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

type StepWithGroupedCandidates = {
  step: AssessmentStep;
  resultCounts?: ResultDecisionCounts;
  results: CandidateAssessmentResult[];
};

export const groupPoolCandidatesByStep = (
  steps: AssessmentStep[],
  candidates: PoolCandidate[],
): StepWithGroupedCandidates[] => {
  const orderedSteps = sortBy(steps, (step) => step.sortOrder);
  const candidateResults = determineCandidateStatusPerStep(
    candidates,
    orderedSteps,
  );
  const candidateCurrentSteps = determineCurrentStepPerCandidate(
    candidateResults,
    steps,
  );
  const stepCounts = getDecisionCountForEachStep(
    steps,
    candidateResults,
    candidateCurrentSteps,
  );

  const stepsWithGroupedCandidates: StepWithGroupedCandidates[] =
    orderedSteps.map((step, index) => {
      const resultCounts = stepCounts.get(step.id);

      const stepCandidates = Array.from(candidateResults.keys()).filter(
        (candidateId) => {
          const currentStep = candidateCurrentSteps.get(candidateId);
          if (typeof currentStep === "undefined") return false;
          return (
            currentStep === null ||
            currentStep >= index ||
            candidateResults.get(candidateId)?.get(step.id) !== NO_DECISION
          );
        },
      );

      const results: CandidateAssessmentResult[] = stepCandidates
        .map((id) => {
          const poolCandidate = candidates.find(
            (candidate) => candidate.id === id,
          );
          const decisions = candidateResults.get(id);
          return poolCandidate
            ? {
                poolCandidate,
                decision: decisions?.get(step.id) ?? NO_DECISION,
              }
            : undefined;
        })
        .filter(notEmpty);

      return {
        step,
        resultCounts,
        results,
      };
    });

  return stepsWithGroupedCandidates;
};

export type ResultFilters = {
  query: string;
  [NO_DECISION]: boolean;
  [AssessmentDecision.Successful]: boolean;
  [AssessmentDecision.Hold]: boolean;
  [AssessmentDecision.Unsuccessful]: boolean;
};

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
  candidates: PoolCandidate[],
): PoolCandidate[] => {
  const filteredResult = candidates.filter(
    (candidate) =>
      !(
        (isDisqualifiedStatus(candidate.status) ||
          isRemovedStatus(candidate.status)) &&
        (candidate.assessmentResults ? candidate.assessmentResults : [])
          .length === 0
      ),
  );
  return filteredResult;
};

export const generateStepName = (
  step: AssessmentStep,
  intl: IntlShape,
): string => {
  // check if title exists in LocalizedString object, then return empty string if not for a truthy check
  const titleLocalized = getLocalizedName(step.title, intl, true);
  if (titleLocalized) {
    return titleLocalized;
  }
  if (step.type) {
    return intl.formatMessage(getAssessmentStepType(step.type));
  }
  return intl.formatMessage(commonMessages.notAvailable);
};
