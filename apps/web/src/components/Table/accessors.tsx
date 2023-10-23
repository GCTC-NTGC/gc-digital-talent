import { IntlShape } from "react-intl";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Maybe, Scalars } from "@gc-digital-talent/graphql";

function dateAccessor(
  value: Maybe<Scalars["DateTime"]>,
  intl: IntlShape,
): string {
  return value
    ? formatDate({
        date: parseDateTimeUtc(value),
        formatString: "PPP p",
        intl,
      })
    : "";
}

export default {
  date: dateAccessor,
};
