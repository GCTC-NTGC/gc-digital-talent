import React from "react";
import { IntlProvider } from "react-intl";
import CommonFrench from "@common/lang";
import AdminFrench from "../../lang/frCompiled.json";

export function getMessages(locale: string) {
  // eslint-disable-next-line global-require
  return locale === "fr" ? { ...AdminFrench, ...CommonFrench } : undefined;
}

const IntlContainer: React.FunctionComponent<{ locale: string }> = ({
  locale,
  children,
}): React.ReactElement => {
  return (
    <IntlProvider locale={locale} key={locale} messages={getMessages(locale)}>
      {children}
    </IntlProvider>
  );
};

export default IntlContainer;
