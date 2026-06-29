import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import {
  parseDateTimeUtc,
  formatDate,
  DATE_FORMAT_LOCALIZED,
} from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

interface DeadlineValueProps {
  closingDate: string | null | undefined;
  wasClosedEarly: boolean;
}

const DeadlineValue = ({
  closingDate,
  wasClosedEarly,
}: DeadlineValueProps): ReactNode => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  if (closingDate && !wasClosedEarly) {
    return intl.formatMessage(
      {
        defaultMessage: "Apply on or before {closingDate}",
        id: "LjYzkS",
        description: "Message to apply to the pool before deadline",
      },
      {
        closingDate: formatDate({
          date: parseDateTimeUtc(closingDate),
          formatString: DATE_FORMAT_LOCALIZED,
          intl,
          timeZone: "Canada/Pacific",
        }),
      },
    );
  }

  if (wasClosedEarly) {
    return intl.formatMessage({
      defaultMessage: "<red>This advertisement has closed early.</red>",
      id: "6qu9EB",
      description: "Message on advertisement poster that it was closed early.",
    });
  }

  return notAvailable;
};

export default DeadlineValue;
