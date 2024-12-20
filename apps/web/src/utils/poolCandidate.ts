/**
 * This file contains utility functions for working with the Pool Candidate model generally,
 * and for interacting with Pool Candidates on the Admin side (e.g. Assessment).
 *
 * For utilities specific to the Applicant-side UI, see ./applicationUtils.ts
 */
import { IntlShape, MessageDescriptor, defineMessages } from "react-intl";
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

// Map combined statuses to their labels
const combinedStatusLabels = defineMessages({
  DRAFT: {
    defaultMessage: "Continue draft",
    id: "pf3KKo",
    description: "Link text to continue a application draft",
  },
  RECEIVED: {
    defaultMessage: "Application received",
    id: "4TmwRU",
    description: "Status for an application that has been submitted",
  },
  UNDER_REVIEW: {
    defaultMessage: "Application under review",
    id: "aagbij",
    description: "Status for an application that is being reviewed",
  },
  PENDING_SKILLS: {
    defaultMessage: "Application pending assessment",
    id: "UZWLKn",
    description: "Status for an application that is having skills reviewed",
  },
  ASSESSMENT: {
    defaultMessage: "Application pending assessment",
    id: "9Pxjw5",
    description:
      "Status for an application that where applicant is being assessed",
  },
  DATE_PASSED: {
    defaultMessage: "Submission date passed",
    id: "13fSK+",
    description:
      "Status for an application that where the recruitment has expired",
  },
  EXPIRED: {
    defaultMessage: "Expired",
    id: "GIC6EK",
    description: "Expired status",
  },
  HIRED_CASUAL: {
    defaultMessage: "Hired (Casual)",
    id: "0YZeO0",
    description:
      "Status for an application that has been hired with a casual contract",
  },
  NOT_INTERESTED: {
    defaultMessage: "Not interested",
    id: "c+6rQB",
    description: "Status for when the user has suspended an application",
  },
  HIRED_INDETERMINATE: {
    defaultMessage: "Hired (Indeterminate)",
    id: "/Sobod",
    description:
      "Status for an application that has been hired with an indeterminate contract",
  },
  HIRED_TERM: {
    defaultMessage: "Hired (Term)",
    id: "VplMpm",
    description:
      "Status for an application that has been hired with a term contract",
  },
  READY_TO_HIRE: {
    defaultMessage: "Ready to hire",
    id: "9gpVCX",
    description: "Status for an application where user user is ready to hire",
  },
  PAUSED: {
    defaultMessage: "Paused",
    id: "KA/hfo",
    description:
      "Status for an application to an advertisement that is unavailable",
  },
  WITHDREW: {
    defaultMessage: "Withdrew",
    id: "C+hP/v",
    description: "Status for an application that has been withdrawn",
  },
  REMOVED: commonMessages.removed,
  SCREENED_OUT: commonMessages.screenedOut,
});

// Map pool candidate statuses to their regular combined statuses
const statusMap = new Map<PoolCandidateStatus, MessageDescriptor>([
  [PoolCandidateStatus.Draft, combinedStatusLabels.DRAFT],
  [PoolCandidateStatus.NewApplication, combinedStatusLabels.RECEIVED],
  [PoolCandidateStatus.ApplicationReview, combinedStatusLabels.UNDER_REVIEW],
  [PoolCandidateStatus.ScreenedIn, combinedStatusLabels.PENDING_SKILLS],
  [PoolCandidateStatus.UnderAssessment, combinedStatusLabels.ASSESSMENT],
  [PoolCandidateStatus.DraftExpired, combinedStatusLabels.DATE_PASSED],
  [
    PoolCandidateStatus.ScreenedOutApplication,
    combinedStatusLabels.SCREENED_OUT,
  ],
  [
    PoolCandidateStatus.ScreenedOutAssessment,
    combinedStatusLabels.SCREENED_OUT,
  ],
  [PoolCandidateStatus.ScreenedOutNotInterested, combinedStatusLabels.REMOVED],
  [PoolCandidateStatus.ScreenedOutNotResponsive, combinedStatusLabels.REMOVED],
  [PoolCandidateStatus.QualifiedAvailable, combinedStatusLabels.READY_TO_HIRE],
  [PoolCandidateStatus.QualifiedUnavailable, combinedStatusLabels.PAUSED],
  [PoolCandidateStatus.QualifiedWithdrew, combinedStatusLabels.WITHDREW],
  [PoolCandidateStatus.PlacedTentative, combinedStatusLabels.READY_TO_HIRE],
  [PoolCandidateStatus.PlacedCasual, combinedStatusLabels.HIRED_CASUAL],
  [PoolCandidateStatus.PlacedTerm, combinedStatusLabels.HIRED_TERM],
  [
    PoolCandidateStatus.PlacedIndeterminate,
    combinedStatusLabels.HIRED_INDETERMINATE,
  ],
  [PoolCandidateStatus.Expired, combinedStatusLabels.EXPIRED],
  [PoolCandidateStatus.Removed, combinedStatusLabels.REMOVED],
]);

// Map pool candidate statuses to their suspended combined statuses
const suspendedStatusMap = new Map<PoolCandidateStatus, MessageDescriptor>([
  [PoolCandidateStatus.QualifiedAvailable, combinedStatusLabels.NOT_INTERESTED],
]);

/**
 * Derived a combined status from the pool candidate status and the suspendedAt timestamp
 *
 * @param status  pool candidate status
 * @param suspendedAt  The timestamp for the user to suspend the pool candidate.  If suspended the label may be different.
 * @returns MessageDescriptor | null    Returns the derived status label
 */
export const derivedStatusLabel = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
): MessageDescriptor | null => {
  if (!status) return null;
  const isSuspended = suspendedAt && new Date() > parseDateTimeUtc(suspendedAt);

  const combinedStatus =
    isSuspended && suspendedStatusMap.has(status)
      ? suspendedStatusMap.get(status) // special suspended label
      : statusMap.get(status); // regular label

  return combinedStatus ?? null;
};

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
  const poolHasScreeningQuestions = screeningQuestions
    ? screeningQuestions?.length > 0
    : false;
  if (currentStep === 2 && poolHasScreeningQuestions) {
    return {
      color: "secondary",
      label: intl.formatMessage(applicationStatusLabels.UNDER_REVIEW),
      description: intl.formatMessage(
        applicationStatusDescriptions.UNDER_REVIEW,
      ),
    };
  }
  if (
    (currentStep === 3 && poolHasScreeningQuestions) ||
    (currentStep === 2 && !poolHasScreeningQuestions)
  ) {
    return {
      color: "secondary",
      label: intl.formatMessage(applicationStatusLabels.PENDING_ASSESSMENT),
      description: intl.formatMessage(
        applicationStatusDescriptions.PENDING_ASSESSMENT,
      ),
    };
  }
  if (
    (currentStep > 3 && poolHasScreeningQuestions) ||
    (currentStep > 2 && !poolHasScreeningQuestions)
  ) {
    return {
      color: "secondary",
      label: intl.formatMessage(applicationStatusLabels.UNDER_ASSESSMENT),
      description: intl.formatMessage(
        applicationStatusDescriptions.UNDER_ASSESSMENT,
      ),
    };
  }
  return {
    color: "secondary",
    label: intl.formatMessage(applicationStatusLabels.RECEIVED),
    description: intl.formatMessage(applicationStatusDescriptions.RECEIVED),
  };
};

/**
 * Returns a status chip for displaying to applicants. Status for current interest/validity
 * in new opportunities for a qualified application.
 */
export const getQualifiedRecruitmentStatusChip = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
  intl: IntlShape,
): StatusChipWithDescription => {
  const statusLabelMessage = derivedStatusLabel(status, suspendedAt);
  const label = statusLabelMessage
    ? intl.formatMessage(statusLabelMessage)
    : "";

  if (isNotPlacedStatus(status)) {
    return {
      color: "success",
      label,
    };
  }
  if (isPlacedStatus(status)) {
    return {
      color: "secondary",
      label,
    };
  }
  if (status === PoolCandidateStatus.Expired || isScreenedOutStatus(status)) {
    return {
      color: "black",
      label,
    };
  }
  if (isInactiveStatus(status)) {
    return {
      color: "warning",
      label,
    };
  }
  return {
    color: "primary",
    label,
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
