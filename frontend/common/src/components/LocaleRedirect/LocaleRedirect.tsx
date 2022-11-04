import React from "react";
import { useParams } from "react-router-dom";
import { localeRedirect } from "../../helpers/localize";
import useLocale from "../../hooks/useLocale";

const LocaleRedirect = () => {
  const { locale } = useLocale();
  const { locale: localeParam } = useParams();

  React.useEffect(() => {
    if (!localeParam || localeParam !== locale) {
      localeRedirect(locale);
    }
  }, [locale, localeParam]);

  return null;
};

export default LocaleRedirect;
