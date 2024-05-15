import * as React from "react";
import { IntlProvider } from "react-intl";

import useLocale from "../hooks/useLocale";
import useIntlLanguages from "../hooks/useIntlMessages";
import { Messages } from "../types";
import defaultRichTextElements from "./richTextElements";

interface LanguageProviderProps {
  messages: Messages;
  children: React.ReactNode;
}

const LanguageProvider = ({ messages, children }: LanguageProviderProps) => {
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();
  const compiledMessages = useIntlLanguages(locale, messages);

  // If the url already begins with locale, pass it to IntlContainer. Otherwise, return null while we redirect.
  return (
    <IntlProvider
      locale={locale}
      key={locale}
      messages={compiledMessages}
      defaultRichTextElements={defaultRichTextElements}
    >
      {children}
    </IntlProvider>
  );
};

export default LanguageProvider;
