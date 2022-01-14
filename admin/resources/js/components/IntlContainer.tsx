import { isLocale, Locales, localizePath } from "@common/helpers/localize";
import { redirect, useLocation } from "@common/helpers/router";
import React, { useEffect } from "react";
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

const STORED_LOCALE = "stored_locale";

function getPathLocale(pathname: string): Locales | null {
  const pathLocale = pathname.split("/")[1]; // Note: for an absolute path which starts with /, the first element is an empty string.
  return isLocale(pathLocale) ? pathLocale : null;
}

function guessLocale(): Locales {
  const locale =
    // Check for stored locale in localStorage.
    localStorage.getItem(STORED_LOCALE) ??
    // If nothing is stored, check for the browser's locale.
    navigator.language.split("-")[0];

  // If stored locale or browser locale is unavailable or invalid, default to english
  if (isLocale(locale)) {
    return locale;
  }
  return "en";
}

export const LanguageRedirectContainer: React.FC = ({ children }) => {
  const location = useLocation();

  const pathLocale = getPathLocale(location.pathname);
  const guessedLocale = pathLocale || guessLocale();

  // If the url already begins with locale, update locale in locale storage. Otherwise, redirect to the correct url.
  useEffect(() => {
    if (pathLocale) {
      localStorage.setItem(STORED_LOCALE, pathLocale);
    } else {
      // The redirect call must be in a useEffect hook to ensure the component process the change in location correctly.
      redirect(localizePath(location.pathname, guessedLocale));
    }
  }, [location.pathname, pathLocale, guessedLocale]);

  // If the url already begins with locale, pass it to IntlContainer. Otherwise, return null while we redirect.
  return pathLocale ? (
    <IntlContainer locale={pathLocale}>{children}</IntlContainer>
  ) : null;
};

export default IntlContainer;
