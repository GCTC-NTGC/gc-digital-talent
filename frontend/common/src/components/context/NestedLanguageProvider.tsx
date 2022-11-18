import React from "react";
import { IntlProvider, useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import defaultRichTextElements from "../../helpers/format";
import { LanguageProviderProps } from "./LanguageProvider";

/**
 * Indigenous Language codes
 *
 * crg - Michif
 * crk - Plains Cree
 * ojw - Western Ojibway
 * mic - Mikmaq
 */
type SecondaryLocale = "crg" | "crk" | "ojw" | "mic" | undefined;

/**
 * Nested Language Provider
 *
 * Providers a secondary language within the
 * existing Language Provider.
 *
 * Note: This must be used within a LanguageProvider
 *
 * @param param0
 */
const NestedLanguageProvider = ({
  messages,
  children,
}: LanguageProviderProps) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const locale = searchParams.get("locale") as SecondaryLocale;

  // Return just children if there is no
  // locale in the search params
  if (!locale) {
    return children as JSX.Element;
  }

  // Merge the messages
  const nestedMessages = {
    ...intl.messages,
    ...messages,
  };

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      messages={nestedMessages}
      defaultRichTextElements={defaultRichTextElements}
    >
      {children}
    </IntlProvider>
  );
};

export default NestedLanguageProvider;
