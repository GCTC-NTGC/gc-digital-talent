import { IntlShape } from "react-intl";
import isPast from "date-fns/isPast";
import React from "react";
import sortBy from "lodash/sortBy";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";

import {
  formatDate,
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import {
  commonMessages,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { Color, IconType } from "@gc-digital-talent/ui";
import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  AssessmentStep,
  AssessmentStepType,
  PoolCandidate,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import { Maybe, PoolCandidateStatus, PublishingGroup } from "~/api/generated";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  QUALIFIED_STATUSES,
  DISQUALIFIED_STATUSES,
  REMOVED_STATUSES,
  TO_ASSESS_STATUSES,
  PLACED_STATUSES,
  NOT_PLACED_STATUSES,
} from "~/constants/poolCandidate";

import { isOngoingPublishingGroup } from "./poolUtils";
import { NO_DECISION, NullableDecision } from "./assessmentResults";

export const isDisqualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? DISQUALIFIED_STATUSES.includes(status) : false);

export const isRemovedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? REMOVED_STATUSES.includes(status) : false);

export const isQualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? QUALIFIED_STATUSES.includes(status) : false);

export const isToAssessStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? TO_ASSESS_STATUSES.includes(status) : false);

export const isPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? PLACED_STATUSES.includes(status) : false);

export const isNotPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? NOT_PLACED_STATUSES.includes(status) : false);

export const getRecruitmentType = (
  publishingGroup: Maybe<PublishingGroup> | undefined,
  intl: IntlShape,
) =>
  isOngoingPublishingGroup(publishingGroup)
    ? intl.formatMessage(poolCandidateMessages.ongoingRecruitment)
    : intl.formatMessage(poolCandidateMessages.targetedRecruitment);

export const isDraft = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => {
  return status === PoolCandidateStatus.Draft;
};

export const isExpired = (
  status: Maybe<PoolCandidateStatus> | undefined,
  expirationDate: Maybe<string> | undefined,
): boolean => {
  if (status === PoolCandidateStatus.Expired) {
    return true;
  }
  return expirationDate ? isPast(parseDateTimeUtc(expirationDate)) : false;
};

export const formatClosingDate = (
  closingDate: Maybe<string>,
  intl: IntlShape,
): string => {
  return closingDate
    ? relativeClosingDate({
        closingDate: parseDateTimeUtc(closingDate),
        intl,
      })
    : "";
};

export const formatSubmittedAt = (
  submittedAt: Maybe<string>,
  intl: IntlShape,
): string => {
  return submittedAt
    ? formatDate({
        date: parseDateTimeUtc(submittedAt),
        formatString: "PPP p",
        intl,
      })
    : "";
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

export type ResultDecisionCounts = Record<NullableDecision, number>;
export type PoolCandidateId = string;
export type AssessmentStepId = string;

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

export const getOrderedSteps = (assessmentSteps: AssessmentStep[]) =>
  sortBy(assessmentSteps, (step) => step.sortOrder);

export const getDecisionCountForEachStep = (
  assessmentSteps: AssessmentStep[],
  candidateToResults: Map<
    PoolCandidateId,
    Map<AssessmentStepId, NullableDecision>
  >,
  candidateToCurrentStep: Map<PoolCandidateId, number | null>,
): Map<AssessmentStepId, ResultDecisionCounts> => {
  const orderedSteps = getOrderedSteps(assessmentSteps);
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

export const getFinalDecisionPillColor = (
  status?: Maybe<PoolCandidateStatus>,
): Color => {
  if (isToAssessStatus(status)) {
    return "warning";
  }

  if (isDisqualifiedStatus(status)) {
    return "error";
  }

  if (isRemovedStatus(status)) {
    return "black";
  }

  if (isQualifiedStatus(status)) {
    return "success";
  }

  return "white";
};

export const statusToFinalDecision = (status?: Maybe<PoolCandidateStatus>) => {
  if (isToAssessStatus(status)) {
    return poolCandidateMessages.toAssess;
  }

  if (isDisqualifiedStatus(status)) {
    return poolCandidateMessages.disqualified;
  }

  if (isRemovedStatus(status)) {
    return poolCandidateMessages.removed;
  }

  if (isQualifiedStatus(status)) {
    return poolCandidateMessages.qualified;
  }

  return commonMessages.notAvailable;
};

export const statusToJobPlacement = (status?: Maybe<PoolCandidateStatus>) => {
  if (status) {
    if (isNotPlacedStatus(status)) {
      return poolCandidateMessages.notPlaced;
    }

    if (isPlacedStatus(status)) {
      return getPoolCandidateStatus(status);
    }
  }

  return commonMessages.notAvailable;
};

type StatusPill = {
  color: Color;
  label: React.ReactNode;
  icon?: IconType;
};

export const getCandidateStatusPill = (
  candidate: PoolCandidate,
  steps: AssessmentStep[],
  intl: IntlShape,
): StatusPill => {
  const isToAssess = isToAssessStatus(candidate.status);
  let suffix = "";
  let icon;

  if (isToAssess) {
    const orderedSteps = sortBy(steps, (step) => step.sortOrder);
    const candidateResults = determineCandidateStatusPerStep(
      [candidate],
      orderedSteps,
    );
    const candidateCurrentSteps = determineCurrentStepPerCandidate(
      candidateResults,
      steps,
    );
    const currentStep = candidateCurrentSteps.get(candidate.id) ?? 0;

    icon = ExclamationTriangleIcon;
    suffix =
      intl.formatMessage(commonMessages.dividingColon) +
      intl.formatMessage(
        {
          defaultMessage: "Step {currentStep}",
          id: "RiGj9w",
          description: "Label for the candidates current assessment step",
        },
        {
          currentStep: currentStep + 1,
        },
      );
  }

  return {
    label: intl.formatMessage(statusToFinalDecision(candidate.status)) + suffix,
    color: getFinalDecisionPillColor(candidate.status),
    icon,
  };
};
