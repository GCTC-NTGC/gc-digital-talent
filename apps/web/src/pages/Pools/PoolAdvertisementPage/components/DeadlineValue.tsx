import { ReactNode } from "react";
import { useIntl } from "react-intl";

import { parseDateTimeUtc, formatDate } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

interface DeadlineValueProps {
  closingDate: string | null | undefined;
  closingReason: string | null | undefined;
}

const DeadlineValue = ({
  closingDate,
  closingReason,
}: DeadlineValueProps): ReactNode => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  if (closingDate && !closingReason) {
    return intl.formatMessage(
      {
        defaultMessage: "Apply on or before {closingDate}",
        id: "LjYzkS",
        description: "Message to apply to the pool before deadline",
      },
      {
        closingDate: formatDate({
          date: parseDateTimeUtc(closingDate),
          formatString: "PPP",
          intl,
          timeZone: "Canada/Pacific",
        }),
      },
    );
  }

  if (closingReason) {
    return intl.formatMessage({
      defaultMessage: "This advertisement has closed early.",
      id: "TgQ/J/",
      description: "Message on advertisement poster that it was closed early.",
    });
  }

  return notAvailable;
};

export default DeadlineValue;
