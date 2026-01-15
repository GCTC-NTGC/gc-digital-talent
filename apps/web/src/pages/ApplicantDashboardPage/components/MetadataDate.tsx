import { useIntl } from "react-intl";

import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  CandidateInterest,
  CandidateStatus,
  Maybe,
} from "@gc-digital-talent/graphql";

import { deadlineToApply } from "~/utils/poolCandidate";

const SUBMITTED_STATUSES = [
  CandidateStatus.Received,
  CandidateStatus.UnderReview,
  CandidateStatus.UnderAssessment,
  CandidateStatus.ApplicationReviewed,
];

const ASSESSED_STATUSES = [
  CandidateStatus.Qualified,
  CandidateStatus.Unsuccessful,
  CandidateStatus.Withdrew,
  CandidateStatus.Ineligible,
  CandidateStatus.NotResponsive,
  CandidateStatus.Removed,
];

interface ApplicationDateProps {
  closingDate?: string | null;
  submittedAt?: string | null;
  assessedDate?: string | null;
  status?: Maybe<CandidateStatus>;
}

export const ApplicationDate = ({
  closingDate,
  submittedAt,
  assessedDate,
  status,
}: ApplicationDateProps) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  if (status === CandidateStatus.Draft || status === CandidateStatus.Expired) {
    const deadlineClose = deadlineToApply(closingDate, status);

    return (
      <span
        className={
          deadlineClose ? "text-error-600 dark:text-error-100" : undefined
        }
      >
        {intl.formatMessage({
          defaultMessage: "Deadline",
          id: "nIAA4Q",
          description: "Label for deadline metadata",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {closingDate
          ? formatDate({
              date: parseDateTimeUtc(closingDate),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
              timeZone: "Canada/Pacific",
            })
          : nullMessage}
      </span>
    );
  }

  if (status && SUBMITTED_STATUSES.includes(status)) {
    return (
      <span>
        {intl.formatMessage({
          defaultMessage: "Submitted",
          id: "16tGhC",
          description: "Label for application submitted",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {submittedAt
          ? formatDate({
              date: parseDateTimeUtc(submittedAt),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  if (status && ASSESSED_STATUSES.includes(status)) {
    return (
      <span>
        {intl.formatMessage({
          defaultMessage: "Assessed",
          id: "GYcxDu",
          description: "Label for assessed metadata",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {assessedDate
          ? formatDate({
              date: parseDateTimeUtc(assessedDate),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  return null;
};

interface RecruitmentDateProps {
  statusUpdatedAt?: string | null;
  interest?: Maybe<CandidateInterest>;
}

export const RecruitmentDate = ({
  statusUpdatedAt,
  interest,
}: RecruitmentDateProps) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  if (!interest) return null;

  return (
    <span>
      {intl.formatMessage(commonMessages.qualified)}
      {intl.formatMessage(commonMessages.dividingColon)}
      {statusUpdatedAt
        ? formatDate({
            date: parseDateTimeUtc(statusUpdatedAt),
            formatString: DATE_FORMAT_LOCALIZED,
            intl,
          })
        : nullMessage}
    </span>
  );
};
