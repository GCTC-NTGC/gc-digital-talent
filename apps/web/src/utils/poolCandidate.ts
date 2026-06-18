/**
 * This file contains utility functions for working with the Pool Candidate model generally,
 * and for interacting with Pool Candidates on the Admin side (e.g. Assessment).
 *
 * For utilities specific to the Applicant-side UI, see ./applicationUtils.ts
 */
import type { IntlShape } from "react-intl";
import { defineMessages } from "react-intl";
import sortBy from "lodash/sortBy";
import type { ReactNode } from "react";
import { differenceInDays } from "date-fns/differenceInDays";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages, ENUM_SORT_ORDER } from "@gc-digital-talent/i18n";
import type { ChipProps } from "@gc-digital-talent/ui";
import type {
  AssessmentStep,
  Pool,
  ScreeningStage,
  AssessmentStepType,
  LocalizedCandidateStatus,
  LocalizedCandidateInterest,
  LocalizedApplicationStatus,
} from "@gc-digital-talent/graphql";
import {
  CandidateStatus,
  CandidateInterest,
  ApplicationStatus,
} from "@gc-digital-talent/graphql";

import { LEGACY_ASSESSMENT_STEP_TYPES } from "~/constants/poolCandidate";

export const isLegacyAssessmentStepType = (
  type?: AssessmentStepType | null,
): boolean => {
  return !!(type ? LEGACY_ASSESSMENT_STEP_TYPES.includes(type) : false);
};

// too generic to narrow
export const getOrderedSteps = (assessmentSteps: AssessmentStep[]) =>
  sortBy(assessmentSteps, (step) => step.sortOrder);

const applicationStatusColourMap = new Map<
  ApplicationStatus,
  ChipProps["color"]
>([
  [ApplicationStatus.ToAssess, "warning"],
  [ApplicationStatus.Disqualified, "error"],
  [ApplicationStatus.Qualified, "success"],
]);

const getApplicationStatusChipColor = (
  status?: ApplicationStatus | null,
): ChipProps["color"] => {
  if (!status) return "gray";
  return applicationStatusColourMap.get(status) ?? "gray";
};

interface StatusChip {
  color?: ChipProps["color"];
  label: ReactNode;
}

/**
 * Returns a status chip for displaying to assessors. Contains more specific information about
 * assessment progress than that shown to applicants.
 */
export const getApplicationStatusChip = (
  status: LocalizedApplicationStatus | null | undefined,
  intl: IntlShape,
): StatusChip => {
  return {
    label:
      status?.label.localized ??
      intl.formatMessage(commonMessages.notAvailable),
    color: getApplicationStatusChipColor(status?.value),
  };
};

/* Applicant facing statuses */

export const applicationStatusLabels = defineMessages({
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
    defaultMessage: "Advanced to assessment",
    id: "Ho4kfT",
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

export const applicationStatusDescriptions = defineMessages({
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
      "Your application was unsuccessful. For job opportunities internal to the Government of Canada, you may request an informal conversation about this decision. To proceed with this, please reach out to the department or recruitment team responsible for advertising the job at <link>{contactEmail}</link>.",
    id: "oN9syr",
    description:
      "Status description for a disqualified application to an employee-only pool",
  },
  REMOVED: {
    defaultMessage:
      "You’ve been removed from this process. If you have questions, please reach out to the department or recruitment team responsible for advertising the job.",
    id: "wqcWdN",
    description:
      "Status description for an application that was removed from a pool",
  },
  WITHDREW: {
    defaultMessage:
      "You’ve indicated that you’re not interested in continuing with this process. You will not be considered qualified in this process, and you will receive no further communication. If this is an error, you have one week to reach out to our support team from the time this status is assigned.",
    id: "BUz+Ml",
    description:
      "Status description for an application that was withdrawn from a pool",
  },
  NOT_RESPONSIVE: {
    defaultMessage:
      "You’ve been removed from this recruitment process because you didn't respond by a set deadline when you were contacted. You’ve now missed the time window to proceed with this process. If you didn’t intend to withdraw from this process, we encourage you to review your contact information to ensure that it’s up to date for future applications to other processes.",
    id: "BTY2jZ",
    description:
      "Status description for an application that was removed from a pool due to unresponsiveness from the applicant",
  },
  INELIGIBLE: {
    defaultMessage:
      "This process is restricted to applicants that meet certain criteria. For example, this process may be restricted to government employees, certain departments, or people with government jobs in specific classifications or levels. Based on your profile and application, you do not meet the requirements to apply to this process. Your application will not be considered.",
    id: "wjyoQN",
    description:
      "Status description for an application that was removed from a pool due to due the applicant being ineligible",
  },
  SUCCESSFUL: {
    defaultMessage:
      "You've applied for a role, you've been assessed, and you've been deemed qualified for this role. There may be other candidates who have also applied for this position and are now at the same step in the process as you. If a hiring manager has an opportunity for you, you may be approached with an employment offer.",
    id: "7e88Z0",
    description: "Status description for a qualified application",
  },
});

export const qualifiedRecruitmentStatusDescriptions = defineMessages({
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
 * Determines if the application is expired, or within 3 days of the pool closing when the application is a draft.
 * @param closingDate
 * @param status
 * @returns
 */
export const deadlineToApply = (
  closingDate: Pool["closingDate"],
  status?: CandidateStatus | null,
): boolean => {
  const lessThanThreeDaysTillClosingDate = closingDate
    ? differenceInDays(parseDateTimeUtc(closingDate), Date.now()) < 3
    : null;

  return (
    (status === CandidateStatus.Draft && lessThanThreeDaysTillClosingDate) ||
    status === CandidateStatus.Expired
  );
};

export const getScreeningStageIndex = (
  screeningStage?: ScreeningStage | null,
) => {
  if (!screeningStage) return null;

  const index = ENUM_SORT_ORDER.SCREENING_STAGE.indexOf(screeningStage);

  if (index < 0) return null;

  return index + 1;
};

export const candidateStatusColorMap = new Map<
  CandidateStatus,
  ChipProps["color"]
>([
  [CandidateStatus.Draft, "gray"],
  [CandidateStatus.Expired, "gray"],
  [CandidateStatus.Unsuccessful, "gray"],

  [CandidateStatus.Received, "secondary"],
  [CandidateStatus.UnderReview, "secondary"],
  [CandidateStatus.ApplicationReviewed, "secondary"],
  [CandidateStatus.UnderAssessment, "secondary"],

  [CandidateStatus.Qualified, "success"],

  [CandidateStatus.Withdrew, "error"],
  [CandidateStatus.NotResponsive, "error"],
  [CandidateStatus.Ineligible, "error"],
  [CandidateStatus.Removed, "error"],
]);

export const candidateStatusChip = (
  status?: LocalizedCandidateStatus | null,
): StatusChip | null => {
  if (!status?.label.localized) return null;

  return {
    color: candidateStatusColorMap.get(status.value) ?? "gray",
    label: status.label.localized,
  };
};

export const candidateInterestColorMap = new Map<
  CandidateInterest,
  ChipProps["color"]
>([
  [CandidateInterest.NotInterested, "secondary"],
  [CandidateInterest.OpenToJobs, "secondary"],
  [CandidateInterest.Hired, "success"],
  [CandidateInterest.Expired, "gray"],
]);

export const candidateInterestChip = (
  interest?: LocalizedCandidateInterest | null,
): StatusChip | null => {
  if (!interest?.label?.localized || !interest.value) return null;

  return {
    color: candidateInterestColorMap.get(interest.value) ?? "secondary",
    label: interest.label.localized,
  };
};
