import React, { useEffect } from "react";
import { IntlProvider } from "react-intl";
import { isLocale, Locales, localizePath } from "../../helpers/localize";
import { redirect, useLocation } from "../../helpers/router";

const STORED_LOCALE = "stored_locale";

function getPathLocale(pathname: string): Locales | null {
  const pathLocale = pathname.split("/")[1]; // Note: for an absolute path which starts with /, the first element is an empty string.
  return isLocale(pathLocale) ? pathLocale : null;
}

function guessLocale(): Locales {
  const locale: string | undefined =
    // Check for stored locale in localStorage.
    localStorage.getItem(STORED_LOCALE) ??
    // If nothing is stored, check for the browser's locale.
    navigator?.language?.split("-")[0];

  // If stored locale or browser locale is unavailable or invalid, default to english
  if (isLocale(locale)) {
    return locale;
  }
  return "en";
}

export type Messages = React.ComponentProps<typeof IntlProvider>["messages"];

export interface LanguageRedirectContainerProps {
  getMessages: (locale: string) => Messages;
}

export const LanguageRedirectContainer: React.FC<
  LanguageRedirectContainerProps
> = ({ getMessages, children }) => {
  const location = useLocation();

  const pathLocale = getPathLocale(location.pathname);
  const guessedLocale = pathLocale || guessLocale();

  // If the url already begins with locale, update locale in locale storage. Otherwise, redirect to the correct url.
  useEffect(() => {
    if (pathLocale) {
      localStorage.setItem(STORED_LOCALE, pathLocale);
    } else {
      // The redirect call must be in a useEffect hook to ensure the component process the change in location correctly.
      redirect(localizePath(location, guessedLocale));
    }
  }, [location, pathLocale, guessedLocale]);

  // If the url already begins with locale, pass it to IntlContainer. Otherwise, return null while we redirect.
  return pathLocale ? (
    <IntlProvider
      locale={pathLocale}
      key={pathLocale}
      messages={getMessages(pathLocale)}
    >
      {children}
    </IntlProvider>
  ) : null;
};

export default LanguageRedirectContainer;
