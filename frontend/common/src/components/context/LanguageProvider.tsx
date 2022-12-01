import React from "react";
import { IntlProvider } from "react-intl";
import useLocale from "../../hooks/useLocale";
import useIntlLanguages from "../../hooks/useIntlMessages";
import defaultRichTextElements from "../../helpers/format";

export type Messages = React.ComponentProps<typeof IntlProvider>["messages"];

export interface LanguageProviderProps {
  messages: Messages;
  children: React.ReactNode;
}

export const LanguageProvider = ({
  messages,
  children,
}: LanguageProviderProps) => {
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
