import { IntlShape } from "react-intl";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Maybe } from "@gc-digital-talent/graphql";

import { formatSubmittedAt } from "~/utils/poolCandidate";

export const getApplicationDeadlineMessage = (
  intl: IntlShape,
  closingDate?: Maybe<string>,
  submittedAt?: Maybe<string>,
) => {
  if (!closingDate) return null;

  if (submittedAt) {
    const message = intl.formatMessage({
      defaultMessage: "Applied on",
      id: "BdsZwe",
      description: "Label for showing the submitted date of an application.",
    });
    const date = formatSubmittedAt(submittedAt, intl);

    return (
      <>
        {message}
        {intl.formatMessage(commonMessages.dividingColon)}
        <span data-h2-color="base(black.light)">{date}</span>
      </>
    );
  }

  // not submitted
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
};
