import { IntlShape } from "react-intl";
import { Fragment, ReactNode } from "react";

import { commonMessages } from "../messages";
import { Locales } from "../types";

// style should be the same as gray in packages/i18n/src/components/richTextElements.tsx.
const Gray = ({ children }: { children: ReactNode }) => (
  <span className="text-gray-500 dark:text-gray-200">{children}</span>
);

export const appendLanguageName = ({
  label,
  lang,
  intl,
  formatted,
}: {
  label: ReactNode;
  lang: Locales;
  intl: IntlShape;
  formatted?: boolean;
}): ReactNode | string => {
  if (formatted) {
    return (
      <>
        {label}{" "}
        <Gray>
          {lang === "en"
            ? intl.formatMessage(commonMessages.englishLabel)
            : intl.formatMessage(commonMessages.frenchLabel)}
        </Gray>
      </>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
  return `${label} ${
    lang === "en"
      ? intl.formatMessage(commonMessages.englishLabel)
      : intl.formatMessage(commonMessages.frenchLabel)
  }
  `;
};
