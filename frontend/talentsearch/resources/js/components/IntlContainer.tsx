import React from "react";
import { IntlProvider } from "react-intl";

export function getMessages(locale: string) {
  // eslint-disable-next-line global-require
  return locale === "fr" ? require("../lang/frCompiled.json") : undefined;
}

const IntlContainer: React.FunctionComponent<{ locale: string }> = ({
  locale,
  children,
}): React.ReactElement => (
  <IntlProvider locale={locale} key={locale} messages={getMessages(locale)}>
    {children}
  </IntlProvider>
);

export default IntlContainer;
