import { useIntl } from "react-intl";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

export const ApplicationDate = ({
  closingDate,
  submittedAt,
  finalDecisionAt,
}: {
  closingDate?: string | null;
  submittedAt?: string | null;
  finalDecisionAt?: string | null;
}) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const isDraftStatus = true;
  const isExpiredStatus = true;
  if (isDraftStatus || isExpiredStatus) {
    return (
      <span>
        {intl.formatMessage({
          defaultMessage: "Deadline",
          id: "nIAA4Q",
          description: "Label for deadline metadata",
        })}{" "}
        {intl.formatMessage(commonMessages.dividingColon)}{" "}
        {closingDate
          ? formatDate({
              date: parseDateTimeUtc(closingDate),
              formatString: "PPP",
              intl,
              timeZone: "Canada/Pacific",
            })
          : nullMessage}
      </span>
    );
  }

  const isReceivedStatus = true;
  const isUnderReviewStatus = true;
  const isPendingAssessmentStatus = true;
  const isUnderAssessmentStatus = true;
  if (
    isReceivedStatus ||
    isUnderReviewStatus ||
    isPendingAssessmentStatus ||
    isUnderAssessmentStatus
  ) {
    return (
      <span>
        {intl.formatMessage({
          defaultMessage: "Submitted",
          id: "B1sXVl",
          description: "Label for submitted metadata",
        })}{" "}
        {intl.formatMessage(commonMessages.dividingColon)}{" "}
        {submittedAt
          ? formatDate({
              date: parseDateTimeUtc(submittedAt),
              formatString: "PPP",
              intl,
              timeZone: "Canada/Pacific",
            })
          : nullMessage}
      </span>
    );
  }

  const isSuccessfulStatus = true;
  const isUnsuccessfulStatus = true;
  const isIneligibleStatus = true;
  if (isSuccessfulStatus || isUnsuccessfulStatus || isIneligibleStatus) {
    return (
      <span>
        {intl.formatMessage({
          defaultMessage: "Assessed",
          id: "GYcxDu",
          description: "Label for assessed metadata",
        })}{" "}
        {intl.formatMessage(commonMessages.dividingColon)}{" "}
        {finalDecisionAt
          ? formatDate({
              date: parseDateTimeUtc(finalDecisionAt),
              formatString: "PPP",
              intl,
              timeZone: "Canada/Pacific",
            })
          : nullMessage}
      </span>
    );
  }

  return null;
};

export const RecruitmentDate = ({
  finalDecisionAt,
  removedAt,
}: {
  finalDecisionAt?: string | null;
  removedAt?: string | null;
}) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const isOpenToJobsStatus = true;
  const isNotInterestedStatus = true;
  const isHiredStatus = true;
  const isExpiredStatus = true;
  if (
    isOpenToJobsStatus ||
    isNotInterestedStatus ||
    isHiredStatus ||
    isExpiredStatus
  ) {
    return (
      <span>
        {intl.formatMessage(commonMessages.awarded)}{" "}
        {intl.formatMessage(commonMessages.dividingColon)}{" "}
        {finalDecisionAt
          ? formatDate({
              date: parseDateTimeUtc(finalDecisionAt),
              formatString: "PPP",
              intl,
              timeZone: "Canada/Pacific",
            })
          : nullMessage}
      </span>
    );
  }

  const isRemovedStatus = true;
  if (isRemovedStatus) {
    return (
      <span>
        {intl.formatMessage(commonMessages.removed)}{" "}
        {intl.formatMessage(commonMessages.dividingColon)}{" "}
        {removedAt
          ? formatDate({
              date: parseDateTimeUtc(removedAt),
              formatString: "PPP",
              intl,
              timeZone: "Canada/Pacific",
            })
          : nullMessage}
      </span>
    );
  }

  return null;
};
