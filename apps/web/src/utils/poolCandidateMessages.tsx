import { defineMessage, defineMessages, MessageDescriptor } from "react-intl";
import {
  PoolCandidateStatus,
  Maybe,
  PoolCandidate,
} from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import getOrThrowError from "@gc-digital-talent/i18n/src/utils/error";

// Custom status keys used to consolidate labels
type StatusLabelKey =
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

const HIRED_STATUSES: StatusLabelKey[] = [
  "HIRED_CASUAL",
  "HIRED_TERM",
  "HIRED_INDETERMINATE",
];
export const isHiredStatus = (status: Maybe<StatusLabelKey>): boolean =>
  status ? HIRED_STATUSES.includes(status) : false;
const READY_TO_HIRE_STATUSES: StatusLabelKey[] = ["READY_TO_HIRE"];
export const isReadyToHireStatus = (status: Maybe<StatusLabelKey>): boolean =>
  status ? READY_TO_HIRE_STATUSES.includes(status) : false;
const EXPIRED_STATUSES: StatusLabelKey[] = ["EXPIRED"];
export const isExpiredStatus = (status: Maybe<StatusLabelKey>): boolean =>
  status ? EXPIRED_STATUSES.includes(status) : false;
const INACTIVE_STATUSES: StatusLabelKey[] = [
  "NOT_INTERESTED",
  "PAUSED",
  "WITHDREW",
];
export const isInactiveStatus = (status: Maybe<StatusLabelKey>): boolean =>
  status ? INACTIVE_STATUSES.includes(status) : false;
const ERROR_STATUSES: StatusLabelKey[] = ["REMOVED"];
export const isErrorStatus = (status: Maybe<StatusLabelKey>): boolean =>
  status ? ERROR_STATUSES.includes(status) : false;

// Map new, consolidated keys to their labels
const statusLabels = defineMessages<StatusLabelKey>({
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

// Map existing statuses to their new, consolidated keys
const statusLabelMap = new Map<PoolCandidateStatus, StatusLabelKey>([
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

// Map existing statuses to their new, consolidated keys when the status is suspended
const suspendedStatusLabelMap = new Map<PoolCandidateStatus, StatusLabelKey>([
  [PoolCandidateStatus.PlacedCasual, "NOT_INTERESTED"],
  [PoolCandidateStatus.QualifiedAvailable, "NOT_INTERESTED"],
]);

/**
 * Get the label for a status
 *
 * @param status  Database status
 * @param suspendedAt  The timestamp for the user to suspend the pool candidate.  If suspended the label may be different.
 * @returns Maybe<MessageDescriptor>    Returns the message or null
 */
export const deriveStatusLabelKey = (
  status: Maybe<PoolCandidateStatus>,
  suspendedAt: PoolCandidate["suspendedAt"],
): StatusLabelKey | null | undefined => {
  if (!status) return null;
  const isSuspended = suspendedAt && new Date() > parseDateTimeUtc(suspendedAt);

  const statusLabelKey =
    isSuspended && suspendedStatusLabelMap.has(status)
      ? suspendedStatusLabelMap.get(status) // special suspended label
      : statusLabelMap.get(status); // regular label

  return statusLabelKey;
};

export const getStatusLabel = (
  statusLabelKey: keyof typeof statusLabels,
): MessageDescriptor =>
  getOrThrowError(
    statusLabels,
    statusLabelKey,
    `Invalid statusLabelKey '${statusLabelKey}'`,
  );
