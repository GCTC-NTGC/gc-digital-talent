import React from "react";
import { IntlProvider, useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import defaultRichTextElements from "../../helpers/format";
import { Messages } from "./LanguageProvider";

interface NestedLanguageProvider {
  messages: Map<string, Messages>;
  children: React.ReactNode;
}

/**
 * Nested Language Provider
 *
 * Providers a secondary language within the
 * existing Language Provider.
 *
 * Note: This must be used within a LanguageProvider
 */
const NestedLanguageProvider = ({
  messages,
  children,
}: NestedLanguageProvider) => {
  const { messages: fallbackMessages } = useIntl();
  const [searchParams] = useSearchParams();
  const locale = searchParams.get("locale");
  const localeMessages = messages.get(locale || "");

  /**
   * If no locale is set or we cannot
   * find the messages associated with the locale,
   * just return the children
   */
  if (!locale || !localeMessages) {
    return children as JSX.Element;
  }

  // Merge the messages
  const nestedMessages = {
    ...fallbackMessages,
    ...localeMessages,
  } as Messages;

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
