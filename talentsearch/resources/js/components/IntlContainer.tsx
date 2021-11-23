import React from "react";
import { IntlProvider } from "react-intl";

const IntlContainer: React.FunctionComponent<{ locale: string }> = ({
  locale,
  children,
}): React.ReactElement => (
  <IntlProvider locale={locale}>{children}</IntlProvider>
);

export default IntlContainer;
