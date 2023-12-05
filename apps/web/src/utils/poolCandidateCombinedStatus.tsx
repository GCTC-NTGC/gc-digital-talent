import { defineMessage, defineMessages, MessageDescriptor } from "react-intl";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import getOrThrowError from "@gc-digital-talent/i18n/src/utils/error";

import { PoolCandidateStatus, Maybe, PoolCandidate } from "~/api/generated";

// Status that represent the combination of pool candidate status and the suspendedAt timestamp
type CombinedStatus =
  | "DRAFT"
  | "RECEIVED"
  | "UNDER_REVIEW"
  | "PENDING_SKILLS"
  | "ASSESSMENT"
  | "DATE_PASSED"
  | "SCREENED_OUT"
  | "EXPIRED"
  | "REMOVED"
  | "HIRED_CASUAL"
  | "NOT_INTERESTED"
  | "HIRED_INDETERMINATE"
  | "HIRED_TERM"
  | "READY_TO_HIRE"
  | "PAUSED"
  | "WITHDREW";

const HIRED_STATUSES: CombinedStatus[] = [
  "HIRED_CASUAL",
  "HIRED_TERM",
  "HIRED_INDETERMINATE",
];
export const isHiredCombinedStatus = (
  status: Maybe<CombinedStatus> | undefined,
): boolean => (status ? HIRED_STATUSES.includes(status) : false);
const READY_TO_HIRE_STATUSES: CombinedStatus[] = ["READY_TO_HIRE"];
export const isReadyToHireCombinedStatus = (
  status: Maybe<CombinedStatus> | undefined,
): boolean => (status ? READY_TO_HIRE_STATUSES.includes(status) : false);
const SUSPENDED_STATUSES: CombinedStatus[] = ["NOT_INTERESTED"];
export const isSuspendedCombinedStatus = (
  status: Maybe<CombinedStatus> | undefined,
): boolean => (status ? SUSPENDED_STATUSES.includes(status) : false);
const EXPIRED_STATUSES: CombinedStatus[] = ["EXPIRED"];
export const isExpiredCombinedStatus = (
  status: Maybe<CombinedStatus> | undefined,
): boolean => (status ? EXPIRED_STATUSES.includes(status) : false);
const INACTIVE_STATUSES: CombinedStatus[] = [
  "NOT_INTERESTED",
  "PAUSED",
  "WITHDREW",
];
export const isInactiveCombinedStatus = (
  status: Maybe<CombinedStatus> | undefined,
): boolean => (status ? INACTIVE_STATUSES.includes(status) : false);
const ERROR_STATUSES: CombinedStatus[] = ["REMOVED"];
export const isErrorCombinedStatus = (
  status: Maybe<CombinedStatus> | undefined,
): boolean => (status ? ERROR_STATUSES.includes(status) : false);
const HIRED_LONG_TERM_STATUSES: CombinedStatus[] = [
  "HIRED_INDETERMINATE",
  "HIRED_TERM",
];
export const isHiredLongTermCombinedStatus = (
  status: Maybe<CombinedStatus> | undefined,
): boolean => (status ? HIRED_LONG_TERM_STATUSES.includes(status) : false);

// Map combined statuses to their labels
const combinedStatusLabels = defineMessages<CombinedStatus>({
  DRAFT: defineMessage({
    defaultMessage: "Continue draft",
    id: "pf3KKo",
    description: "Link text to continue a application draft",
  }),
  RECEIVED: defineMessage({
    defaultMessage: "Application received",
    id: "4TmwRU",
    description: "Status for an application that has been submitted",
  }),
  UNDER_REVIEW: defineMessage({
    defaultMessage: "Application under review",
    id: "aagbij",
    description: "Status for an application that is being reviewed",
  }),
  PENDING_SKILLS: defineMessage({
    defaultMessage: "Application pending assessment",
    id: "UZWLKn",
    description: "Status for an application that is having skills reviewed",
  }),
  ASSESSMENT: defineMessage({
    defaultMessage: "Application pending assessment",
    id: "9Pxjw5",
    description:
      "Status for an application that where applicant is being assessed",
  }),
  DATE_PASSED: defineMessage({
    defaultMessage: "Submission date passed",
    id: "13fSK+",
    description:
      "Status for an application that where the recruitment has expired",
  }),
  SCREENED_OUT: defineMessage({
    defaultMessage: "Screened out",
    id: "njJCTd",
    description:
      "Status for an application that has been screened out of eligibility",
  }),
  EXPIRED: defineMessage({
    defaultMessage: "Expired",
    id: "GIC6EK",
    description: "Expired status",
  }),

  REMOVED: defineMessage({
    defaultMessage: "Removed",
    id: "vTyr7O",
    description:
      "Status for an application that has been removed from the recruitment",
  }),
  HIRED_CASUAL: defineMessage({
    defaultMessage: "Hired (Casual)",
    id: "0YZeO0",
    description:
      "Status for an application that has been hired with a casual contract",
  }),
  NOT_INTERESTED: defineMessage({
    defaultMessage: "Not interested",
    id: "c+6rQB",
    description: "Status for when the user has suspended an application",
  }),
  HIRED_INDETERMINATE: defineMessage({
    defaultMessage: "Hired (Indeterminate)",
    id: "/Sobod",
    description:
      "Status for an application that has been hired with an indeterminate contract",
  }),
  HIRED_TERM: defineMessage({
    defaultMessage: "Hired (Term)",
    id: "VplMpm",
    description:
      "Status for an application that has been hired with a term contract",
  }),
  READY_TO_HIRE: defineMessage({
    defaultMessage: "Ready to hire",
    id: "9gpVCX",
    description: "Status for an application where user user is ready to hire",
  }),
  PAUSED: defineMessage({
    defaultMessage: "Paused",
    id: "KA/hfo",
    description:
      "Status for an application to an advertisement that is unavailable",
  }),
  WITHDREW: defineMessage({
    defaultMessage: "Withdrew",
    id: "C+hP/v",
    description: "Status for an application that has been withdrawn",
  }),
});

// Map pool candidate statuses to their regular combined statuses
const statusMap = new Map<PoolCandidateStatus, CombinedStatus>([
  [PoolCandidateStatus.Draft, "DRAFT"],
  [PoolCandidateStatus.NewApplication, "RECEIVED"],
  [PoolCandidateStatus.ApplicationReview, "UNDER_REVIEW"],
  [PoolCandidateStatus.ScreenedIn, "PENDING_SKILLS"],
  [PoolCandidateStatus.UnderAssessment, "ASSESSMENT"],
  [PoolCandidateStatus.DraftExpired, "DATE_PASSED"],
  [PoolCandidateStatus.ScreenedOutApplication, "SCREENED_OUT"],
  [PoolCandidateStatus.ScreenedOutAssessment, "SCREENED_OUT"],
  [PoolCandidateStatus.ScreenedOutNotInterested, "SCREENED_OUT"],
  [PoolCandidateStatus.ScreenedOutNotResponsive, "SCREENED_OUT"],
  [PoolCandidateStatus.QualifiedAvailable, "READY_TO_HIRE"],
  [PoolCandidateStatus.QualifiedUnavailable, "PAUSED"],
  [PoolCandidateStatus.QualifiedWithdrew, "WITHDREW"],
  [PoolCandidateStatus.PlacedCasual, "HIRED_CASUAL"],
  [PoolCandidateStatus.PlacedTerm, "HIRED_TERM"],
  [PoolCandidateStatus.PlacedIndeterminate, "HIRED_INDETERMINATE"],
  [PoolCandidateStatus.Expired, "EXPIRED"],
  [PoolCandidateStatus.Removed, "REMOVED"],
]);

// Map pool candidate statuses to their suspended combined statuses
const suspendedStatusMap = new Map<PoolCandidateStatus, CombinedStatus>([
  [PoolCandidateStatus.QualifiedAvailable, "NOT_INTERESTED"],
]);

/**
 * Derived a combined status from the pool candidate status and the suspendedAt timestamp
 *
 * @param status  pool candidate status
 * @param suspendedAt  The timestamp for the user to suspend the pool candidate.  If suspended the label may be different.
 * @returns Maybe<CombinedStatus>    Returns the combined status or null
 */
export const deriveCombinedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
): Maybe<CombinedStatus> | undefined => {
  if (!status) return null;
  const isSuspended = suspendedAt && new Date() > parseDateTimeUtc(suspendedAt);

  const combinedStatus =
    isSuspended && suspendedStatusMap.has(status)
      ? suspendedStatusMap.get(status) // special suspended label
      : statusMap.get(status); // regular label

  return combinedStatus;
};

export const getCombinedStatusLabel = (
  statusLabelKey: keyof typeof combinedStatusLabels,
): MessageDescriptor =>
  getOrThrowError(
    combinedStatusLabels,
    statusLabelKey,
    `Invalid statusLabelKey '${statusLabelKey}'`,
  );
