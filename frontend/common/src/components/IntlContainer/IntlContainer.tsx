import React from "react";
import { IntlProvider } from "react-intl";

import CommonFrench from "../../lang";

type IntlMessages = Record<string, string>;

export const getMessages = (locale: string, messages: IntlMessages) => {
  return locale === "fr" ? { ...messages, ...CommonFrench } : undefined;
};

export interface IntlContainerProps {
  locale: string;
  messages: IntlMessages;
}

const IntlContainer: React.FC<IntlContainerProps> = ({
  locale,
  messages,
  children,
}) => (
  <IntlProvider
    locale={locale}
    key={locale}
    messages={getMessages(locale, messages)}
  >
    {children}
  </IntlProvider>
);

export default IntlContainer;
