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

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Color } from "@gc-digital-talent/ui";
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
  SCREENED_OUT_STATUSES,
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

export const isScreenedOutStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? SCREENED_OUT_STATUSES.includes(status) : false);

export const isInactiveStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? INACTIVE_STATUSES.includes(status) : false);

export const isSuspendedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
): boolean => {
  const isSuspended = suspendedAt && new Date() > parseDateTimeUtc(suspendedAt);

  return !!(isSuspended && status === PoolCandidateStatus.QualifiedAvailable);
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

export const isDisqualifiedFinalDecision = (
  status: Maybe<FinalDecision> | undefined,
): boolean => {
  return status
    ? [
        FinalDecision.Disqualified,
        FinalDecision.DisqualifiedPending,
        FinalDecision.DisqualifiedRemoved,
      ].includes(status)
    : false;
};

export const isQualifiedFinalDecision = (
  status: Maybe<FinalDecision> | undefined,
): boolean => {
  return status
    ? [
        FinalDecision.Qualified,
        FinalDecision.QualifiedExpired,
        FinalDecision.QualifiedPending,
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
): Color => {
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
      return "white";
  }
};

/**
 * The inAssessment statuses have extra business logic for deciding how to present the status chip,
 * since the candidate may or may not be ready for a final decision.
 */
const computeInAssessmentStatusChip = (
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
    typeof assessmentStatus?.currentStep === "undefined"
      ? 1
      : assessmentStatus.currentStep;

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
      intl.formatMessage(
        {
          defaultMessage: "Step {currentStep}",
          id: "RiGj9w",
          description: "Label for the candidates current assessment step",
        },
        {
          currentStep,
        },
      ),
    color: "warning",
  };
};

interface StatusChip {
  color: Color;
  label: ReactNode;
}

/**
 * Returns a status chip for displaying to assessors. Contains more specific information about
 * assessment progress than that shown to applicants.
 */
export const getCandidateStatusChip = (
  finalDecision: Maybe<LocalizedFinalDecision> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
): StatusChip => {
  if (
    finalDecision?.value === FinalDecision.ToAssess ||
    !finalDecision?.value
  ) {
    return computeInAssessmentStatusChip(assessmentStatus, intl);
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
  PENDING_ASSESSMENT: {
    defaultMessage: "Pending assessment",
    id: "wHnlD+",
    description: "Status label for a reviewed application awaiting assessment",
  },
  UNDER_ASSESSMENT: {
    defaultMessage: "Under assessment",
    id: "heFiZt",
    description: "Status label for an application under assessment",
  },
  UNSUCCESSFUL: {
    defaultMessage: "Unsuccessful",
    id: "PcyEiH",
    description: "Status label for a disqualified application",
  },
  SUCCESSFUL: {
    defaultMessage: "Successful",
    id: "ma/D52",
    description: "Status label for a qualified application",
  },
});

const applicationStatusDescriptions = defineMessages({
  EXPIRED: {
    defaultMessage: "The deadline to apply for this opportunity has passed.",
    id: "0Zl+om",
    description:
      "Status description for a draft application to an expired poster",
  },
  DRAFT: {
    defaultMessage:
      "A draft application has been started but not submitted. You can continue a draft and submit it any time before the application deadline.",
    id: "ryJuIZ",
    description: "Status description for a draft application",
  },
  RECEIVED: {
    defaultMessage:
      "Your application has been successfully submitted and is awaiting review. We'll notify you when HR staff begin the review process.",
    id: "pD/j43",
    description:
      "Status description for a submitted (but not reviewed) application",
  },
  UNDER_REVIEW: {
    defaultMessage:
      "Your application is actively being reviewed by HR staff. We'll notify you when next steps are required.",
    id: "fNmDzT",
    description: "Status description for an application under review",
  },
  PENDING_ASSESSMENT: {
    defaultMessage:
      "Your application was successfully screened in and you are now queued for further assessment. Depending on the volume of applications received, there may be a delay of up to several months before HR staff will reach out with next steps.",
    id: "Lp5bvi",
    description:
      "Status description for a reviewed application awaiting assessment",
  },
  UNDER_ASSESSMENT: {
    defaultMessage:
      "Your application was successfully screened in and merit criteria are now being assessed. You will be contacted directly about each required assessment. We will also notify you when your application status changes based on the results.",
    id: "Six9YX",
    description: "Status description for an application under assessment",
  },
  UNSUCCESSFUL_PUBLIC: {
    defaultMessage:
      "Unfortunately, your application was unsuccessful. Due to the high volume of applications, we're unable to provide specific feedback why an application was rejected.",
    id: "Fa30+B",
    description:
      "Status description for a disqualified application to a public pool",
  },
  UNSUCCESSFUL_EMPLOYEE: {
    defaultMessage:
      "Unfortunately your application was unsuccessful. For opportunities internal to the Government of Canada, you may request an informal conversation about this decision. If you'd like to discuss this application, please reach out to the functional community.",
    id: "l3ZVez",
    description:
      "Status description for a disqualified application to an employee-only pool",
  },
  SUCCESSFUL: {
    defaultMessage:
      "Your application has been approved and you've passed the required assessments. Depending on the type of process you applied to, HR staff or potential hiring managers will be in touch with next steps.",
    id: "DMcW46",
    description: "Status description for a qualified application",
  },
});

export interface StatusChipWithDescription extends StatusChip {
  description?: ReactNode;
}

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
  assessmentStatus: PoolCandidate["assessmentStatus"],
  screeningQuestions: Pool["screeningQuestions"],
  intl: IntlShape,
): StatusChipWithDescription => {
  // Draft applications
  if (!submittedAt) {
    if (closingDate && isPast(parseDateTimeUtc(closingDate))) {
      return {
        color: "black",
        label: intl.formatMessage(applicationStatusLabels.EXPIRED),
        description: intl.formatMessage(applicationStatusDescriptions.EXPIRED),
      };
    } else {
      return {
        color: "primary",
        label: intl.formatMessage(applicationStatusLabels.DRAFT),
        description: intl.formatMessage(applicationStatusDescriptions.DRAFT),
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
      };
    } else {
      return {
        color: "black",
        label: intl.formatMessage(applicationStatusLabels.UNSUCCESSFUL),
        description: intl.formatMessage(
          applicationStatusDescriptions.UNSUCCESSFUL_PUBLIC,
        ),
      };
    }
  }

  // Qualified applications
  if (finalDecisionAt && isQualifiedFinalDecision(finalDecision)) {
    return {
      color: "success",
      label: intl.formatMessage(applicationStatusLabels.SUCCESSFUL),
      description: intl.formatMessage(applicationStatusDescriptions.SUCCESSFUL),
    };
  }

  // Partially assessed applications
  const currentStep = assessmentStatus?.currentStep
    ? assessmentStatus?.currentStep
    : 0;
  const numberOfScreeningSteps =
    screeningQuestions && screeningQuestions?.length > 0 ? 2 : 1;
  const numberOfStepStatuses =
    assessmentStatus?.assessmentStepStatuses?.length ?? 0;

  if (currentStep <= numberOfScreeningSteps && numberOfStepStatuses > 0) {
    return {
      color: "secondary",
      label: intl.formatMessage(applicationStatusLabels.UNDER_REVIEW),
      description: intl.formatMessage(
        applicationStatusDescriptions.UNDER_REVIEW,
      ),
    };
  }
  if (currentStep > numberOfScreeningSteps) {
    if (numberOfStepStatuses <= numberOfScreeningSteps) {
      return {
        color: "secondary",
        label: intl.formatMessage(applicationStatusLabels.PENDING_ASSESSMENT),
        description: intl.formatMessage(
          applicationStatusDescriptions.PENDING_ASSESSMENT,
        ),
      };
    } else {
      return {
        color: "secondary",
        label: intl.formatMessage(applicationStatusLabels.UNDER_ASSESSMENT),
        description: intl.formatMessage(
          applicationStatusDescriptions.UNDER_ASSESSMENT,
        ),
      };
    }
  }

  return {
    color: "secondary",
    label: intl.formatMessage(applicationStatusLabels.RECEIVED),
    description: intl.formatMessage(applicationStatusDescriptions.RECEIVED),
  };
};

const qualifiedRecruitmentStatusLabels = defineMessages({
  OPEN_TO_JOBS: {
    defaultMessage: "Open to jobs",
    id: "Jprv7e",
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
  intl: IntlShape,
): StatusChipWithDescription => {
  if (placedAt) {
    return {
      color: "secondary",
      label: intl.formatMessage(qualifiedRecruitmentStatusLabels.HIRED),
      description: intl.formatMessage(
        qualifiedRecruitmentStatusDescriptions.HIRED,
      ),
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
    };
  }

  return {
    color: "success",
    label: intl.formatMessage(qualifiedRecruitmentStatusLabels.OPEN_TO_JOBS),
    description: intl.formatMessage(
      qualifiedRecruitmentStatusDescriptions.OPEN_TO_JOBS,
    ),
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
