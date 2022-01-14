import { redirect, useLocation } from "@common/helpers/router";
import path from "path-browserify";
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

function getPathLocale(pathname: string): string | null {
  const pathLocale = pathname.split("/")[1];
  if (pathLocale === "en" || pathLocale === "fr") {
    return pathLocale;
  }
  return null;
}

function guessLocale(): string {
  // Check for stored locale in localStorage.
  let locale = localStorage.getItem(STORED_LOCALE);
  if (locale !== "en" && locale !== "fr") {
    // If stored locale is unavailable or invalid, default to english
    locale = "en";
  }
  return locale;
}

export const LanguageRedirectContainer: React.FC = ({ children }) => {
  const location = useLocation();

  const pathLocale = getPathLocale(location.pathname);
  const guessedLocale = pathLocale || guessLocale();

  // If the url already begins with locale, save locale in locale storage. Otherwise, redirect to the correct url.
  useEffect(() => {
    if (pathLocale) {
      localStorage.setItem(STORED_LOCALE, pathLocale);
    } else {
      // The redirect call must be in a useEffect hook to ensure the component process the change in location correctly.
      redirect(path.join("/", guessedLocale, location.pathname));
    }
  }, [location.pathname, pathLocale, guessedLocale]);

  // If the url already begins with locale, pass it to IntlContainer. Otherwise, return null while we redirect.
  return pathLocale ? (
    <IntlContainer locale={pathLocale}>{children}</IntlContainer>
  ) : null;
};

export default IntlContainer;
