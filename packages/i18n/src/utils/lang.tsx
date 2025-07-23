import { IntlShape } from "react-intl";
import { Fragment, ReactNode } from "react";

import { commonMessages } from "../messages";
import { Locales } from "../types";

// style should be the same as gray in packages/i18n/src/components/richTextElements.tsx.
const Gray = ({ children }: { children: ReactNode }) => (
  <span className="text-gray-500 dark:text-gray-300">{children}</span>
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
}): ReactNode => {
  const Wrapper = formatted ? Gray : Fragment;
  return (
    <>
      {label}{" "}
      <Wrapper>
        {lang === "en"
          ? intl.formatMessage(commonMessages.englishLabel)
          : intl.formatMessage(commonMessages.frenchLabel)}
      </Wrapper>
    </>
  );
};
