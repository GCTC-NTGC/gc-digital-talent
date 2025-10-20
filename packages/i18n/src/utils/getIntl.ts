import { createIntl, createIntlCache, MessageFormatElement } from "react-intl";

import { getDesiredLocale } from "./localize";
import combineMessages from "./combineMessages";

const cache = createIntlCache();

const getIntl = (
  messages:
    | Record<string, string>
    | Record<string, MessageFormatElement[]>
    | undefined,
) => {
  const locale = getDesiredLocale();

  return createIntl(
    {
      locale,
      messages: combineMessages(locale, messages),
    },
    cache,
  );
};

export default getIntl;
