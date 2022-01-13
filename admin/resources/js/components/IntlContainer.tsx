import React from "react";
import { IntlProvider } from "react-intl";

function loadLocaleData(locale: string) {
  switch (locale) {
    case "fr":
      // eslint-disable-next-line global-require
      return require("../lang/frCompiled.json");
    default:
      return undefined;
  }
}

const IntlContainer: React.FunctionComponent<{ locale: string }> = ({
  locale,
  children,
}): React.ReactElement => {
  return (
    <IntlProvider locale={locale} messages={loadLocaleData(locale)}>
      {children}
    </IntlProvider>
  );
};

export default IntlContainer;
