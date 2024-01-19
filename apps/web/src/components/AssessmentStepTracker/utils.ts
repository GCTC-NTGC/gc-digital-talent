import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";

import { IconType } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  Maybe,
  PoolSkillType,
  AssessmentStep,
  Pool,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { NO_DECISION, NullableDecision } from "~/utils/assessmentResults";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

export type CandidateAssessmentResult = {
  poolCandidate: PoolCandidate;
  decision: NullableDecision;
  results: AssessmentResult[];
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
      name: intl.formatMessage({
        defaultMessage: "On hold",
        id: "qA8+f5",
        description:
          "Message displayed when candidate was unsuccessful but put on hold",
      }),
    };
  }

  if (decision === AssessmentDecision.Unsuccessful) {
    return {
      icon: XCircleIcon,
      colorStyle: {
        "data-h2-color": "base(error)",
      },
      name: isApplicationStep
        ? intl.formatMessage({
            defaultMessage: "Screened out",
            id: "3xCX4b",
            description:
              "Message displayed when candidate has been screened out at a specific assessment step",
          })
        : intl.formatMessage({
            defaultMessage: "Unsuccessful",
            id: "TIAla1",
            description:
              "Message displayed when candidate has not passed an assessment step",
          }),
    };
  }

  return {
    icon: CheckCircleIcon,
    colorStyle: {
      "data-h2-color": "base(success)",
    },
    name: isApplicationStep
      ? intl.formatMessage({
          defaultMessage: "Screened in",
          id: "3W/NbE",
          description:
            "Message displayed when candidate has been screened in at a specific assessment step",
        })
      : intl.formatMessage({
          defaultMessage: "Successful",
          id: "Whq2Xl",
          description:
            "Message displayed when candidate has successfully passed an assessment step",
        }),
  };
};

export type ResultDecisionCounts = Record<NullableDecision, number>;

export const getResultDecisionCount = (
  results: CandidateAssessmentResult[],
) => {
  const stepAccumulation: ResultDecisionCounts = {
    noDecision: 0,
    [AssessmentDecision.Hold]: 0,
    [AssessmentDecision.Successful]: 0,
    [AssessmentDecision.Unsuccessful]: 0,
  };

  return results.reduce(
    (
      accumulator: ResultDecisionCounts,
      assessmentResult: CandidateAssessmentResult,
    ) => {
      const decision: NullableDecision =
        assessmentResult.decision ?? NO_DECISION;
      return {
        ...accumulator,
        [decision]: accumulator[decision] + 1,
      };
    },
    stepAccumulation,
  );
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

  // Could be an education requirement that is not an essential skill
  stepResults.forEach((result) => {
    // Any "to assess" should be marked
    if (result.assessmentDecision === null) {
      hasToAssess = true;
    }

    if (result.assessmentResultType === AssessmentResultType.Education) {
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
    }
  });

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

type AssessmentMap = Map<string, CandidateAssessmentResult>;

type GroupedStep = {
  step: AssessmentStep;
  assessments: AssessmentMap;
};

type GroupedSteps = Map<string | undefined, GroupedStep>;

export const groupPoolCandidatesByStep = (pool: Pool) => {
  const poolCandidates = pool.poolCandidates?.filter(notEmpty) ?? [];
  const steps = pool.assessmentSteps?.filter(notEmpty) ?? [];

  // Build a map for all poolCandidates on step 1
  const allCandidatesMap: AssessmentMap = new Map();
  poolCandidates.forEach((poolCandidate) => {
    allCandidatesMap.set(poolCandidate.id, {
      poolCandidate,
      decision: NO_DECISION,
      results: [],
    });
  });

  // Setup the base map for steps with assessments for candidates
  const stepMap: GroupedSteps = new Map();
  steps
    .sort((stepA, stepB) => {
      return (stepA.sortOrder ?? Number.MAX_SAFE_INTEGER) >
        (stepB.sortOrder ?? Number.MAX_SAFE_INTEGER)
        ? 1
        : -1;
    })
    .forEach((step, index) => {
      stepMap.set(step.id, {
        step,
        // Step one should show all candidates regardless of results existing
        assessments: index === 0 ? allCandidatesMap : new Map(),
      });
    });

  poolCandidates.forEach((poolCandidate) => {
    const assessments = poolCandidate.assessmentResults?.filter(notEmpty);

    assessments?.forEach((result) => {
      if (!result) return;

      const resultStep = stepMap.get(result?.assessmentStep?.id);
      if (resultStep) {
        const stepCandidateAssessments = resultStep.assessments.get(
          poolCandidate.id,
        );
        resultStep.assessments.set(poolCandidate.id, {
          poolCandidate,
          decision: NO_DECISION, // We don't know the decision until all results have been determined
          results: stepCandidateAssessments?.results
            ? [...stepCandidateAssessments.results, result]
            : [result],
        });
      }
    });
  });

  // Determine the decision for each assessment now that we have all the results
  let previousStep: GroupedStep | undefined;
  stepMap.forEach((step) => {
    // If a previous step exists, check for pool candidates with no results yet
    // and set them as "to assess" if they passed previous step
    if (previousStep) {
      poolCandidates
        .filter((poolCandidate) => {
          return !step.assessments.has(poolCandidate.id);
        })
        .forEach((poolCandidate) => {
          const previousAssessment = previousStep?.assessments.get(
            poolCandidate.id,
          );
          if (
            previousAssessment?.decision === AssessmentDecision.Hold ||
            previousAssessment?.decision === AssessmentDecision.Successful
          ) {
            step.assessments.set(poolCandidate.id, {
              poolCandidate,
              decision: NO_DECISION,
              results: [],
            });
          }
        });
    }
    step?.assessments.forEach((assessment) => {
      let decision: NullableDecision = NO_DECISION;
      if (assessment.results.length > 0) {
        decision = getResultsDecision(step.step, assessment.results);
      }

      step.assessments.set(assessment.poolCandidate.id, {
        ...assessment,
        decision,
      });
    });

    previousStep = step;
  });

  return stepMap;
};
