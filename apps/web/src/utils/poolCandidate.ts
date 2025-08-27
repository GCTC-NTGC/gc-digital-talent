/**
 * This file contains utility functions for working with the Pool Candidate model generally,
 * and for interacting with Pool Candidates on the Admin side (e.g. Assessment).
 *
 * For utilities specific to the Applicant-side UI, see ./applicationUtils.ts
 */
import { IntlShape, defineMessages } from "react-intl";
import { isPast } from "date-fns/isPast";
import sortBy from "lodash/sortBy";
import { ReactNode } from "react";
import { differenceInDays } from "date-fns/differenceInDays";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { ChipProps } from "@gc-digital-talent/ui";
import {
  Maybe,
  PoolCandidate,
  PoolCandidateStatus,
  OverallAssessmentStatus,
  AssessmentResultStatus,
  ClaimVerificationResult,
  CitizenshipStatus,
  AssessmentStep,
  FinalDecision,
  LocalizedFinalDecision,
  Pool,
  PoolAreaOfSelection,
} from "@gc-digital-talent/graphql";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  QUALIFIED_STATUSES,
  DISQUALIFIED_STATUSES,
  REMOVED_STATUSES,
  TO_ASSESS_STATUSES,
  PLACED_STATUSES,
  NOT_PLACED_STATUSES,
  DRAFT_STATUSES,
  INACTIVE_STATUSES,
  SUSPENDABLE_STATUSES,
  RECORD_DECISION_STATUSES,
  REVERT_DECISION_STATUSES,
  PLACEMENT_TYPE_STATUSES,
} from "~/constants/poolCandidate";

import { NullableDecision } from "./assessmentResults";

export const isDisqualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? DISQUALIFIED_STATUSES.includes(status) : false);

export const isRemovedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? REMOVED_STATUSES.includes(status) : false);

export const isQualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? QUALIFIED_STATUSES.includes(status) : false);

export const isDraftStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? DRAFT_STATUSES.includes(status) : false);

export const isToAssessStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? TO_ASSESS_STATUSES.includes(status) : false);

export const isPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? PLACED_STATUSES.includes(status) : false);

export const isNotPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? NOT_PLACED_STATUSES.includes(status) : false);

export const isInactiveStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? INACTIVE_STATUSES.includes(status) : false);

export const isRODStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? RECORD_DECISION_STATUSES.includes(status) : false);

export const isRevertableStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean =>
  status
    ? [...REVERT_DECISION_STATUSES, ...PLACEMENT_TYPE_STATUSES].includes(status)
    : false;

export const isSuspendedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
): boolean => {
  const isSuspended = suspendedAt && new Date() > parseDateTimeUtc(suspendedAt);

  return !!(
    isSuspended && (status ? SUSPENDABLE_STATUSES.includes(status) : false)
  );
};

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

const isDisqualifiedFinalDecision = (
  status: Maybe<FinalDecision> | undefined,
): boolean => {
  return status
    ? [FinalDecision.Disqualified, FinalDecision.DisqualifiedRemoved].includes(
        status,
      )
    : false;
};

// if changing below, also check `FinalDecision.php` enum
export const isQualifiedFinalDecision = (
  status: Maybe<FinalDecision> | undefined,
): boolean => {
  return status
    ? [
        FinalDecision.Qualified,
        FinalDecision.QualifiedExpired,
        FinalDecision.QualifiedPlaced,
        FinalDecision.QualifiedRemoved,
      ].includes(status)
    : false;
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

export type ResultDecisionCounts = Record<NullableDecision, number>;

// too generic to narrow
export const getOrderedSteps = (assessmentSteps: AssessmentStep[]) =>
  sortBy(assessmentSteps, (step) => step.sortOrder);

const getFinalDecisionChipColor = (
  finalDecision?: Maybe<FinalDecision>,
): ChipProps["color"] => {
  switch (finalDecision) {
    case FinalDecision.ToAssess:
      return "warning";
    case FinalDecision.Disqualified:
    case FinalDecision.DisqualifiedPending:
      return "error";
    case FinalDecision.Removed:
    case FinalDecision.DisqualifiedRemoved:
    case FinalDecision.QualifiedRemoved:
    case FinalDecision.QualifiedExpired:
    case FinalDecision.ToAssessRemoved:
      return "black";
    case FinalDecision.Qualified:
    case FinalDecision.QualifiedPlaced:
    case FinalDecision.QualifiedPending:
      return "success";
    default:
      return "black";
  }
};

/**
 * The inAssessment statuses have extra business logic for deciding how to present the status chip,
 * since the candidate may or may not be ready for a final decision.
 */
const computeInAssessmentStatusChip = (
  assessmentStep: Maybe<number> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
): StatusChip => {
  if (!assessmentStatus?.overallAssessmentStatus) {
    // This escape hatch mostly applies to Pools created before Record of Decision.
    return {
      label: intl.formatMessage(poolCandidateMessages.toAssess),
      color: "warning",
    };
  }

  if (
    assessmentStatus?.overallAssessmentStatus ===
    OverallAssessmentStatus.Disqualified
  ) {
    return {
      label:
        intl.formatMessage(poolCandidateMessages.disqualified) +
        intl.formatMessage(commonMessages.dividingColon) +
        intl.formatMessage(poolCandidateMessages.pendingDecision),
      color: "error",
    };
  }

  const currentStep =
    typeof assessmentStep === "undefined" ? 1 : assessmentStep;

  // currentStep of null means that the candidate has passed all steps and is tentatively qualified!
  if (currentStep === null) {
    return {
      label:
        intl.formatMessage(poolCandidateMessages.qualified) +
        intl.formatMessage(commonMessages.dividingColon) +
        intl.formatMessage(poolCandidateMessages.pendingDecision),
      color: "success",
    };
  }

  return {
    label:
      intl.formatMessage(poolCandidateMessages.toAssess) +
      intl.formatMessage(commonMessages.dividingColon) +
      intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
        stepNumber: currentStep,
      }),
    color: "warning",
  };
};

/** Application statuses */
export const applicationStatus = {
  EXPIRED: "EXPIRED",
  DRAFT: "DRAFT",
  RECEIVED: "RECEIVED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPLICATION_REVIEWED: "APPLICATION_REVIEWED",
  UNDER_ASSESSMENT: "UNDER_ASSESSMENT",
  UNSUCCESSFUL: "UNSUCCESSFUL",
  SUCCESSFUL: "SUCCESSFUL",
} as const;

type ApplicationStatus =
  (typeof applicationStatus)[keyof typeof applicationStatus];

/** Qualified recruitment statuses */
export const qualifiedRecruitmentStatus = {
  HIRED: "HIRED",
  NOT_INTERESTED: "NOT_INTERESTED",
  OPEN_TO_JOBS: "OPEN_TO_JOBS",
} as const;

type QualifiedRecruitmentStatus =
  (typeof qualifiedRecruitmentStatus)[keyof typeof qualifiedRecruitmentStatus];

interface StatusChip {
  color?: ChipProps["color"];
  label: ReactNode;
}

export interface StatusChipWithDescription extends StatusChip {
  description?: ReactNode;
  value: ApplicationStatus | QualifiedRecruitmentStatus;
}

/**
 * Returns a status chip for displaying to assessors. Contains more specific information about
 * assessment progress than that shown to applicants.
 */
export const getCandidateStatusChip = (
  finalDecision: Maybe<LocalizedFinalDecision> | undefined,
  assessmentStep: Maybe<number> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
): StatusChip => {
  if (
    finalDecision?.value === FinalDecision.ToAssess ||
    !finalDecision?.value
  ) {
    return computeInAssessmentStatusChip(
      assessmentStep,
      assessmentStatus,
      intl,
    );
  }

  return {
    label: getLocalizedName(finalDecision?.label, intl),
    color: getFinalDecisionChipColor(finalDecision?.value),
  };
};

/* Applicant facing statuses */

const applicationStatusLabels = defineMessages({
  EXPIRED: {
    defaultMessage: "Expired",
    id: "GIC6EK",
    description: "Expired status",
  },
  DRAFT: {
    defaultMessage: "Draft",
    id: "QDjfw4",
    description: "Status label for a draft application",
  },
  RECEIVED: {
    defaultMessage: "Received",
    id: "IH+bPG",
    description: "Status label for a submitted (but not reviewed) application",
  },
  UNDER_REVIEW: {
    defaultMessage: "Under review",
    id: "l2xs1C",
    description: "Status label for an application under review",
  },
  APPLICATION_REVIEWED: {
    defaultMessage: "Application reviewed",
    id: "AawFeJ",
    description: "Status label for a reviewed application awaiting assessment",
  },
  UNDER_ASSESSMENT: {
    defaultMessage: "Under assessment",
    id: "heFiZt",
    description: "Status label for an application under assessment",
  },
  UNSUCCESSFUL: {
    defaultMessage: "Unsuccessful",
    id: "TIAla1",
    description:
      "Message displayed when candidate has not passed an assessment step",
  },
  SUCCESSFUL: {
    defaultMessage: "Qualified in process",
    id: "kolwAf",
    description: "Status label for a qualified application",
  },
});

const applicationStatusDescriptions = defineMessages({
  EXPIRED: {
    defaultMessage: "The deadline for this opportunity has passed.",
    id: "CeKPRS",
    description:
      "Status description for a draft application to an expired poster",
  },
  DRAFT: {
    defaultMessage:
      "A draft application has been started but not submitted. You can continue working on your draft and submit it any time before the application deadline. You won't be able to edit your application once it's submitted.",
    id: "QQyMxc",
    description: "Status description for a draft application",
  },
  RECEIVED: {
    defaultMessage:
      "Your application has been submitted and is awaiting review. You can't edit your application anymore.",
    id: "l0EXuk",
    description:
      "Status description for a submitted (but not reviewed) application",
  },
  UNDER_REVIEW: {
    defaultMessage: "We're currently reviewing your application.",
    id: "ptrg8W",
    description: "Status description for an application under review",
  },
  APPLICATION_REVIEWED: {
    defaultMessage:
      "Your application has passed the first step in the review process. This means you've been approved to proceed to the next phase of assessment. However, we're unable to provide a timeline because of the volume of applications and other factors.",
    id: "yx06ue",
    description:
      "Status description for a reviewed application awaiting assessment",
  },
  UNDER_ASSESSMENT: {
    defaultMessage:
      "Your application has passed the first step in the review process. You're now at the stage when additional testing is being conducted. Depending on the process, this may involve several steps of evaluation such as interviews, exams, and reference checks.",
    id: "cZJski",
    description: "Status description for an application under assessment",
  },
  UNSUCCESSFUL_PUBLIC: {
    defaultMessage:
      "Your application was unsuccessful. Due to the high volume of applications, we're unable to provide specific feedback on why your application was rejected. The two most common reasons people receive this result are a lack of details in the initial application related to skills demonstration or a failure to pass a technical assessment.",
    id: "Ct7EHx",
    description:
      "Status description for a disqualified application to a public pool",
  },
  UNSUCCESSFUL_EMPLOYEE: {
    defaultMessage:
      "Your application was unsuccessful. For job opportunities internal to the Government of Canada, you may request an informal conversation about this decision. To proceed with this, please reach out to the department or recruitment team responsible for advertising the job.",
    id: "8lxSJM",
    description:
      "Status description for a disqualified application to an employee-only pool",
  },
  SUCCESSFUL: {
    defaultMessage:
      "You've applied for a role, you've been assessed, and you've been deemed qualified for this role. There may be other candidates who have also applied for this position and are now at the same step in the process as you. If a hiring manager has an opportunity for you, you may be approached with an employment offer.",
    id: "7e88Z0",
    description: "Status description for a qualified application",
  },
});

/**
 * Returns a status chip for displaying to applicants. General information about application status.
 */
export const getApplicationStatusChip = (
  submittedAt: PoolCandidate["submittedAt"],
  closingDate: Pool["closingDate"],
  removedAt: PoolCandidate["removedAt"],
  finalDecisionAt: PoolCandidate["finalDecisionAt"],
  finalDecision: Maybe<FinalDecision> | undefined,
  areaOfSelection: Maybe<PoolAreaOfSelection> | undefined,
  assessmentStep: Maybe<number> | undefined,
  assessmentStatus: PoolCandidate["assessmentStatus"],
  screeningQuestionsCount: Pool["screeningQuestionsCount"],
  intl: IntlShape,
): StatusChipWithDescription => {
  // Draft applications
  if (!submittedAt) {
    if (closingDate && isPast(parseDateTimeUtc(closingDate))) {
      return {
        color: "black",
        label: intl.formatMessage(applicationStatusLabels.EXPIRED),
        description: intl.formatMessage(applicationStatusDescriptions.EXPIRED),
        value: applicationStatus.EXPIRED,
      };
    } else {
      return {
        color: "primary",
        label: intl.formatMessage(applicationStatusLabels.DRAFT),
        description: intl.formatMessage(applicationStatusDescriptions.DRAFT),
        value: applicationStatus.DRAFT,
      };
    }
  }

  // Disqualified applications
  if (
    removedAt ||
    (finalDecisionAt && isDisqualifiedFinalDecision(finalDecision))
  ) {
    if (areaOfSelection === PoolAreaOfSelection.Employees) {
      return {
        color: "black",
        label: intl.formatMessage(applicationStatusLabels.UNSUCCESSFUL),
        description: intl.formatMessage(
          applicationStatusDescriptions.UNSUCCESSFUL_EMPLOYEE,
        ),
        value: applicationStatus.UNSUCCESSFUL,
      };
    } else {
      return {
        color: "black",
        label: intl.formatMessage(applicationStatusLabels.UNSUCCESSFUL),
        description: intl.formatMessage(
          applicationStatusDescriptions.UNSUCCESSFUL_PUBLIC,
        ),
        value: applicationStatus.UNSUCCESSFUL,
      };
    }
  }

  // Qualified applications
  if (finalDecisionAt && isQualifiedFinalDecision(finalDecision)) {
    return {
      color: "success",
      label: intl.formatMessage(applicationStatusLabels.SUCCESSFUL),
      description: intl.formatMessage(applicationStatusDescriptions.SUCCESSFUL),
      value: applicationStatus.SUCCESSFUL,
    };
  }

  // Fully assessed but final decision not yet made
  if (
    assessmentStatus?.overallAssessmentStatus ===
    OverallAssessmentStatus.Qualified
  ) {
    return {
      color: "secondary",
      label: intl.formatMessage(applicationStatusLabels.UNDER_ASSESSMENT),
      description: intl.formatMessage(
        applicationStatusDescriptions.UNDER_ASSESSMENT,
      ),
      value: applicationStatus.UNDER_ASSESSMENT,
    };
  }

  // Partially assessed applications
  const currentStep = assessmentStep ?? 0;
  const numberOfScreeningSteps =
    screeningQuestionsCount && screeningQuestionsCount > 0 ? 2 : 1;
  const numberOfStepStatuses =
    assessmentStatus?.assessmentStepStatuses?.length ?? 0;

  if (currentStep <= numberOfScreeningSteps && numberOfStepStatuses > 0) {
    return {
      color: "secondary",
      label: intl.formatMessage(applicationStatusLabels.UNDER_REVIEW),
      description: intl.formatMessage(
        applicationStatusDescriptions.UNDER_REVIEW,
      ),
      value: applicationStatus.UNDER_REVIEW,
    };
  }
  if (currentStep > numberOfScreeningSteps) {
    if (numberOfStepStatuses <= numberOfScreeningSteps) {
      return {
        color: "secondary",
        label: intl.formatMessage(applicationStatusLabels.APPLICATION_REVIEWED),
        description: intl.formatMessage(
          applicationStatusDescriptions.APPLICATION_REVIEWED,
        ),
        value: applicationStatus.APPLICATION_REVIEWED,
      };
    } else {
      return {
        color: "secondary",
        label: intl.formatMessage(applicationStatusLabels.UNDER_ASSESSMENT),
        description: intl.formatMessage(
          applicationStatusDescriptions.UNDER_ASSESSMENT,
        ),
        value: applicationStatus.UNDER_ASSESSMENT,
      };
    }
  }

  return {
    color: "secondary",
    label: intl.formatMessage(applicationStatusLabels.RECEIVED),
    description: intl.formatMessage(applicationStatusDescriptions.RECEIVED),
    value: applicationStatus.RECEIVED,
  };
};

const qualifiedRecruitmentStatusLabels = defineMessages({
  OPEN_TO_JOBS: {
    defaultMessage: "Open to job offers",
    id: "p4kAoz",
    description: "Status label for a qualified application open for hiring",
  },
  NOT_INTERESTED: {
    defaultMessage: "Not interested",
    id: "3QGPJe",
    description:
      "Status label for a qualified application the candidate has marked not interested",
  },
  HIRED: {
    defaultMessage: "Hired",
    id: "IJL2jN",
    description: "Status label for a qualified application that has been hired",
  },
});

const qualifiedRecruitmentStatusDescriptions = defineMessages({
  OPEN_TO_JOBS: {
    defaultMessage:
      "You're currently interested in receiving job opportunities related to this recruitment process. You can change this status at the end of this dialog.",
    id: "ml+1LK",
    description:
      "Status description for a qualified application open for hiring",
  },
  NOT_INTERESTED: {
    defaultMessage:
      "You've indicated that you aren't interested in receiving job opportunities related to this recruitment process. You can change this status at the end of this dialog.",
    id: "7toBNM",
    description:
      "Status description for a qualified application the candidate has marked not interested",
  },
  HIRED: {
    defaultMessage:
      "You've accepted a job thanks to this recruitment process. You'll no longer receive job opportunities related to this process.",
    id: "FN037Z",
    description:
      "Status description for a qualified application that has been hired",
  },
});

/**
 * Returns a status chip for displaying to applicants. Status for current interest/validity
 * in new opportunities for a QUALIFIED application.
 */
export const getQualifiedRecruitmentStatusChip = (
  suspendedAt: PoolCandidate["suspendedAt"],
  placedAt: PoolCandidate["placedAt"],
  status: PoolCandidateStatus | null,
  intl: IntlShape,
): StatusChipWithDescription => {
  // placed casual is an exception
  if (placedAt && status !== PoolCandidateStatus.PlacedCasual) {
    return {
      color: "secondary",
      label: intl.formatMessage(qualifiedRecruitmentStatusLabels.HIRED),
      description: intl.formatMessage(
        qualifiedRecruitmentStatusDescriptions.HIRED,
      ),
      value: qualifiedRecruitmentStatus.HIRED,
    };
  }

  if (suspendedAt) {
    return {
      color: "secondary",
      label: intl.formatMessage(
        qualifiedRecruitmentStatusLabels.NOT_INTERESTED,
      ),
      description: intl.formatMessage(
        qualifiedRecruitmentStatusDescriptions.NOT_INTERESTED,
      ),
      value: qualifiedRecruitmentStatus.NOT_INTERESTED,
    };
  }

  return {
    color: "success",
    label: intl.formatMessage(qualifiedRecruitmentStatusLabels.OPEN_TO_JOBS),
    description: intl.formatMessage(
      qualifiedRecruitmentStatusDescriptions.OPEN_TO_JOBS,
    ),
    value: qualifiedRecruitmentStatus.OPEN_TO_JOBS,
  };
};

export const priorityWeightAfterVerification = (
  priorityWeight: number,
  priorityVerification: ClaimVerificationResult | null | undefined,
  veteranVerification: ClaimVerificationResult | null | undefined,
  citizenshipStatus: CitizenshipStatus | null | undefined,
): number => {
  // Priority
  if (
    priorityWeight === 10 &&
    (priorityVerification === ClaimVerificationResult.Accepted ||
      priorityVerification === ClaimVerificationResult.Unverified)
  ) {
    return 10;
  }

  // Veteran
  if (
    priorityWeight === 20 &&
    (veteranVerification === ClaimVerificationResult.Accepted ||
      veteranVerification === ClaimVerificationResult.Unverified)
  ) {
    return 20;
  }

  // Citizen
  if (priorityWeight === 30) {
    return 30;
  }

  // Cascade down from priority to veteran
  if (
    priorityWeight === 10 &&
    (veteranVerification === ClaimVerificationResult.Accepted ||
      veteranVerification === ClaimVerificationResult.Unverified)
  ) {
    return 20;
  }

  // Cascade down from priority to citizen as veteran didn't apply above
  if (
    priorityWeight === 10 &&
    (citizenshipStatus === CitizenshipStatus.Citizen ||
      citizenshipStatus === CitizenshipStatus.PermanentResident)
  ) {
    return 30;
  }

  // Cascade down from veteran to citizen
  if (
    priorityWeight === 20 &&
    (citizenshipStatus === CitizenshipStatus.Citizen ||
      citizenshipStatus === CitizenshipStatus.PermanentResident)
  ) {
    return 30;
  }

  // final fallback - last (Other)
  return 40;
};

/**
 * Determines if the application is expired, or within 3 days of the pool closing when the application is a draft.
 * @param closingDate
 * @param status
 * @returns
 */
export const deadlineToApply = (
  closingDate: Pool["closingDate"],
  status: StatusChipWithDescription["value"],
): boolean => {
  const lessThanThreeDaysTillClosingDate = closingDate
    ? differenceInDays(parseDateTimeUtc(closingDate), Date.now()) < 3
    : null;

  return (
    (status === applicationStatus.DRAFT && lessThanThreeDaysTillClosingDate) ||
    status === applicationStatus.EXPIRED
  );
};
