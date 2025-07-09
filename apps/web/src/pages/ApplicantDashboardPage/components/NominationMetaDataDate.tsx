import { useIntl } from "react-intl";
import { JSX } from "react";
import { endOfDay } from "date-fns/endOfDay";
import { isPast } from "date-fns/isPast";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

interface NominationMetaDataDateProps {
  closeDate: string | null | undefined;
  submittedAt: string | null | undefined;
}

export const NominationMetaDataDate = ({
  closeDate,
  submittedAt,
}: NominationMetaDataDateProps): JSX.Element => {
  const intl = useIntl();

  if (submittedAt) {
    return (
      <span>
        {intl.formatMessage(commonMessages.submitted)}
        {intl.formatMessage(commonMessages.dividingColon)}
        {formatDate({
          date: parseDateTimeUtc(submittedAt),
          formatString: "PPP",
          intl,
        })}
      </span>
    );
  }

  if (closeDate) {
    const closeDateParsed = parseDateTimeUtc(closeDate);
    const closeDateEnd = endOfDay(closeDateParsed);

    if (isPast(closeDateEnd)) {
      return (
        <span className="text-error-600 dark:text-error-100">
          {intl.formatMessage(commonMessages.deadline)}
          {intl.formatMessage(commonMessages.dividingColon)}
          {formatDate({
            date: closeDateParsed,
            formatString: "PPP",
            intl,
          })}
        </span>
      );
    }
    return (
      <span>
        {intl.formatMessage(commonMessages.deadline)}
        {intl.formatMessage(commonMessages.dividingColon)}
        {formatDate({
          date: closeDateParsed,
          formatString: "PPP",
          intl,
        })}
      </span>
    );
  }

  return <span>{intl.formatMessage(commonMessages.notAvailable)}</span>;
};
