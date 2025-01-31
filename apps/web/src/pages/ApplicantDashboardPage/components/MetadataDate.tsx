import { useIntl } from "react-intl";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import { ApplicationStatus } from "~/utils/poolCandidate";

interface ApplicationDateProps {
  closingDate?: string | null;
  submittedAt?: string | null;
  finalDecisionAt?: string | null;
  status: ApplicationStatus;
}

export const ApplicationDate = ({
  closingDate,
  submittedAt,
  finalDecisionAt,
  status,
}: ApplicationDateProps) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  if (!status) {
    return null;
  }

  const isDraftStatus = status === ApplicationStatus.DRAFT;
  const isExpiredStatus = status === ApplicationStatus.EXPIRED;

  if (isDraftStatus || isExpiredStatus) {
    return (
      <span>
        {intl.formatMessage({
          defaultMessage: "Deadline",
          id: "nIAA4Q",
          description: "Label for deadline metadata",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {closingDate
          ? formatDate({
              date: parseDateTimeUtc(closingDate),
              formatString: "PPP",
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  const isReceivedStatus = status === ApplicationStatus.RECEIVED;
  const isUnderReviewStatus = status === ApplicationStatus.UNDER_REVIEW;
  const isUnderAssessmentStatus = status === ApplicationStatus.UNDER_ASSESSMENT;
  if (isReceivedStatus || isUnderReviewStatus || isUnderAssessmentStatus) {
    return (
      <span>
        {intl.formatMessage(formMessages.submitted)}
        {intl.formatMessage(commonMessages.dividingColon)}
        {submittedAt
          ? formatDate({
              date: parseDateTimeUtc(submittedAt),
              formatString: "PPP",
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  const isSuccessfulStatus = status === ApplicationStatus.SUCCESSFUL;
  const isUnsuccessfulStatus = status === ApplicationStatus.UNSUCCESSFUL;
  if (isSuccessfulStatus || isUnsuccessfulStatus) {
    return (
      <span>
        {intl.formatMessage({
          defaultMessage: "Assessed",
          id: "GYcxDu",
          description: "Label for assessed metadata",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {finalDecisionAt
          ? formatDate({
              date: parseDateTimeUtc(finalDecisionAt),
              formatString: "PPP",
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  return null;
};

interface RecruitmentDateProps {
  finalDecisionAt?: string | null;
  removedAt?: string | null;
  status: ApplicationStatus;
}

export const RecruitmentDate = ({
  finalDecisionAt,
  removedAt,
  status,
}: RecruitmentDateProps) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  if (!status) {
    return null;
  }

  const isOpenToJobsStatus = status === ApplicationStatus.OPEN_TO_JOBS;
  const isNotInterestedStatus = status === ApplicationStatus.NOT_INTERESTED;
  const isHiredStatus = status === ApplicationStatus.HIRED;
  if (isOpenToJobsStatus || isNotInterestedStatus || isHiredStatus) {
    return (
      <span>
        {intl.formatMessage(commonMessages.qualified)}
        {intl.formatMessage(commonMessages.dividingColon)}
        {finalDecisionAt
          ? formatDate({
              date: parseDateTimeUtc(finalDecisionAt),
              formatString: "PPP",
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  const isUnsuccessfulStatus = status === ApplicationStatus.UNSUCCESSFUL;
  if (isUnsuccessfulStatus) {
    return (
      <span>
        {intl.formatMessage(commonMessages.removed)}
        {intl.formatMessage(commonMessages.dividingColon)}
        {removedAt
          ? formatDate({
              date: parseDateTimeUtc(removedAt),
              formatString: "PPP",
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  return null;
};
