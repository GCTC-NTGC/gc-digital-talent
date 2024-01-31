import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import sortBy from "lodash/sortBy";

import { IconType } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentResult,
  Maybe,
  PoolSkillType,
  AssessmentStep,
  AssessmentStepType,
  AssessmentResultType,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import { NO_DECISION, NullableDecision } from "~/utils/assessmentResults";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

export type CandidateAssessmentResult = {
  poolCandidate: PoolCandidate;
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
        "data-h2-color": "base(warning)",
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
        ? intl.formatMessage(poolCandidateMessages.screenedOut)
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

export type ResultDecisionCounts = Record<NullableDecision, number>;

export const sumDecisionTypes = (results: NullableDecision[]) => {
  const stepAccumulation: ResultDecisionCounts = {
    [NO_DECISION]: 0,
    [AssessmentDecision.Hold]: 0,
    [AssessmentDecision.Successful]: 0,
    [AssessmentDecision.Unsuccessful]: 0,
  };

  return results.reduce((accumulator: ResultDecisionCounts, result) => {
    return {
      ...accumulator,
      [result]: accumulator[result] + 1,
    };
  }, stepAccumulation);
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
  return Number(result.poolCandidate?.user.hasPriorityEntitlement);
};
const getVeteranValue = (result: CandidateAssessmentResult) => {
  return Number(
    result.poolCandidate?.user.armedForcesStatus === ArmedForcesStatus.Veteran,
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

const getResultsDecision = (
  step: AssessmentStep,
  results?: AssessmentResult[],
): NullableDecision => {
  if (!results) return NO_DECISION;
  let hasFailure: boolean = false;
  let hasOnHold: boolean = false;
  let hasToAssess: boolean = false;

  const stepResults = results.filter((result) => {
    return result.assessmentStep?.id === step.id;
  });

  if (stepResults.length === 0) {
    hasToAssess = true;
  }

  const requiredSkillAssessments = step.poolSkills?.filter(
    (poolSkill) => poolSkill?.type === PoolSkillType.Essential,
  );

  requiredSkillAssessments?.forEach((skillAssessment) => {
    const assessmentResults = stepResults.filter((result) => {
      return result.poolSkill?.id === skillAssessment?.id;
    });

    if (assessmentResults.length === 0) {
      hasToAssess = true;
      return;
    }

    assessmentResults.forEach((assessmentResult) => {
      switch (assessmentResult.assessmentDecision) {
        case null:
          hasToAssess = true;
          break;
        case AssessmentDecision.Hold:
          hasOnHold = true;
          break;
        case AssessmentDecision.Unsuccessful:
          hasFailure = true;
          break;
        default:
      }
    });
  });

  // Check for Education requirement if this is an ApplicationScreening step
  if (step.type === AssessmentStepType.ApplicationScreening) {
    const educationResults = stepResults.filter(
      (result) =>
        result.assessmentResultType === AssessmentResultType.Education,
    );
    if (educationResults.length === 0) {
      hasToAssess = true;
    }
    educationResults.forEach((result) => {
      // Any "to assess" should be marked
      if (result.assessmentDecision === null) {
        hasToAssess = true;
      }
      switch (result.assessmentDecision) {
        case null:
          hasToAssess = true;
          break;
        case AssessmentDecision.Hold:
          hasOnHold = true;
          break;
        case AssessmentDecision.Unsuccessful:
          hasFailure = true;
          break;
        default:
      }
    });
  }

  if (hasFailure) {
    return AssessmentDecision.Unsuccessful;
  }
  if (hasToAssess) {
    return NO_DECISION;
  }
  if (hasOnHold) {
    return AssessmentDecision.Hold;
  }

  return AssessmentDecision.Successful;
};

type PoolCandidateId = string;
type AssessmentStepId = string;

export const determineCandidateStatusPerStep = (
  poolCandidates: PoolCandidate[],
  steps: AssessmentStep[],
): Map<PoolCandidateId, Map<AssessmentStepId, NullableDecision>> => {
  return poolCandidates.reduce((candidateToResults, candidate) => {
    const assessmentToResult = steps.reduce((map, step) => {
      return map.set(
        step.id,
        getResultsDecision(step, unpackMaybes(candidate.assessmentResults)),
      );
    }, new Map<AssessmentStepId, NullableDecision>());
    candidateToResults.set(candidate.id, assessmentToResult);
    return candidateToResults;
  }, new Map<PoolCandidateId, Map<AssessmentStepId, NullableDecision>>());
};

/**
 * Returns the "current step" a candidate should appear at in the assessment tracker.
 * A candidate should appear in all columns less than or equal to its current step.
 * A value of null means that a candidate has passed all steps.
 * @param assessmentToResult
 * @param assessmentOrdering
 * @returns
 */
const determineCurrentStep = (
  assessmentToResult: Map<AssessmentStepId, NullableDecision>,
  assessmentOrdering: string[],
): number | null => {
  for (let index = 0; index < assessmentOrdering.length; index += 1) {
    const assessmentStepId = assessmentOrdering[index];
    const result = assessmentToResult.get(assessmentStepId);
    if (result === AssessmentDecision.Unsuccessful || result === NO_DECISION) {
      return index;
    }
  }
  return null;
};

export const determineCurrentStepPerCandidate = (
  candidateToResults: Map<
    PoolCandidateId,
    Map<AssessmentStepId, NullableDecision>
  >,
  assessmentSteps: AssessmentStep[],
): Map<PoolCandidateId, number | null> => {
  const orderedStepIds = assessmentSteps
    .sort((stepA, stepB) => {
      return (stepA.sortOrder ?? Number.MAX_SAFE_INTEGER) >
        (stepB.sortOrder ?? Number.MAX_SAFE_INTEGER)
        ? 1
        : -1;
    })
    .map((step) => step.id);

  const candidateToCurrentStep = new Map<PoolCandidateId, number | null>();
  candidateToResults.forEach((assessmentToResult, candidateId) => {
    candidateToCurrentStep.set(
      candidateId,
      determineCurrentStep(assessmentToResult, orderedStepIds),
    );
  });
  return candidateToCurrentStep;
};

export const getDecisionCountForEachStep = (
  assessmentSteps: AssessmentStep[],
  candidateToResults: Map<
    PoolCandidateId,
    Map<AssessmentStepId, NullableDecision>
  >,
  candidateToCurrentStep: Map<PoolCandidateId, number | null>,
): Map<AssessmentStepId, ResultDecisionCounts> => {
  const orderedSteps = sortBy(assessmentSteps, (step) => step.sortOrder);
  const decisionCountMap = new Map<AssessmentStepId, ResultDecisionCounts>();
  for (let index = 0; index < orderedSteps.length; index += 1) {
    const stepId = orderedSteps[index].id;
    const poolCandidateIds = Array.from(candidateToCurrentStep.keys());
    const decisionsForCurrentStep = poolCandidateIds
      .filter((candidateId) => {
        // A candidate's result should be counted for its current step and any previous steps
        // A null step indicates the candidate has successfully passed all assessment steps and should be counted in all of them
        const candidateStep = candidateToCurrentStep.get(candidateId) ?? null;
        return candidateStep === null || candidateStep >= index;
      })
      // For all the filtered-in candidates, get their result for this step and put them together in an array.
      .reduce(
        (decisions: Array<NullableDecision | undefined>, candidateId) => [
          ...decisions,
          candidateToResults.get(candidateId)?.get(stepId),
        ],
        [],
      )
      .filter(notEmpty);
    decisionCountMap.set(stepId, sumDecisionTypes(decisionsForCurrentStep));
  }
  return decisionCountMap;
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
        (id) => {
          const currentStep = candidateCurrentSteps.get(id);
          if (typeof currentStep === "undefined") return false;
          return currentStep === null || currentStep >= index;
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
  [AssessmentDecision.Successful]: true,
  [AssessmentDecision.Hold]: true,
  [AssessmentDecision.Unsuccessful]: true,
};

const statusIsAvailable = (filter?: boolean) => {
  return typeof filter !== "undefined" && filter;
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
            .join(" ");
          if (!fullName.includes(filters.query)) {
            return false;
          }
        }

        let available: boolean = true;
        switch (decision) {
          case NO_DECISION:
            available = statusIsAvailable(filters[NO_DECISION]);
            break;
          case AssessmentDecision.Hold:
            available = statusIsAvailable(filters[AssessmentDecision.Hold]);
            break;
          case AssessmentDecision.Successful:
            available = statusIsAvailable(
              filters[AssessmentDecision.Successful],
            );
            break;
          case AssessmentDecision.Unsuccessful:
            available = statusIsAvailable(
              filters[AssessmentDecision.Unsuccessful],
            );
            break;
          default:
            break;
        }

        return available;
      },
    );

    return {
      ...step,
      results: filteredResults,
    };
  });
};
