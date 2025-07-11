import { useIntl } from "react-intl";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import {
  applicationStatus,
  deadlineToApply,
  qualifiedRecruitmentStatus,
  StatusChipWithDescription,
} from "~/utils/poolCandidate";

interface ApplicationDateProps {
  closingDate?: string | null;
  submittedAt?: string | null;
  finalDecisionAt?: string | null;
  status: StatusChipWithDescription["value"];
}

export const ApplicationDate = ({
  closingDate,
  submittedAt,
  finalDecisionAt,
  status,
}: ApplicationDateProps) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  if (
    status === applicationStatus.DRAFT ||
    status === applicationStatus.EXPIRED
  ) {
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
              formatString: "PPP",
              intl,
              timeZone: "Canada/Pacific",
            })
          : nullMessage}
      </span>
    );
  }

  if (
    status === applicationStatus.RECEIVED ||
    status === applicationStatus.UNDER_REVIEW ||
    status === applicationStatus.UNDER_ASSESSMENT
  ) {
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
              formatString: "PPP",
              intl,
            })
          : nullMessage}
      </span>
    );
  }

  if (
    status === applicationStatus.SUCCESSFUL ||
    status === applicationStatus.UNSUCCESSFUL
  ) {
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
  status: StatusChipWithDescription["value"];
}

export const RecruitmentDate = ({
  finalDecisionAt,
  status,
}: RecruitmentDateProps) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  if (
    status === qualifiedRecruitmentStatus.OPEN_TO_JOBS ||
    status === qualifiedRecruitmentStatus.NOT_INTERESTED ||
    status === qualifiedRecruitmentStatus.HIRED
  ) {
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

  return null;
};
