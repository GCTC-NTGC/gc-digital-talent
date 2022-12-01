import React from "react";
import { isLocale, localeRedirect, Locales } from "../../helpers/localize";

export const STORED_LOCALE = "stored_locale";

function getPathLocale(pathname: string): Locales | null {
  const pathLocale = pathname.split("/")[1]; // Note: for an absolute path which starts with /, the first element is an empty string.
  return isLocale(pathLocale) ? pathLocale : null;
}

const guessLocale = (): Locales => {
  const locale: string | undefined =
    // Check for stored locale in localStorage.
    localStorage.getItem(STORED_LOCALE) ??
    // If nothing is stored, check for the browser's locale.
    navigator?.language?.split("-")[0];

  // If stored locale or browser locale is unavailable or invalid, default to english
  if (isLocale(locale)) {
    return locale as Locales;
  }

  return "en";
};

export interface LocaleState {
  locale: Locales;
  setLocale: (locale: Locales) => void;
}

export const defaultLocaleState = {
  locale: "en" as Locales,
  setLocale: () => {
    /** do nothing */
  },
};

export const LocaleContext =
  React.createContext<LocaleState>(defaultLocaleState);

interface LocaleContainerProps {
  children: React.ReactNode;
}

const LocaleContainer = ({ children }: LocaleContainerProps) => {
  const pathLocale = getPathLocale(window.location.pathname);
  const desiredLocale = pathLocale || guessLocale(); // figure it out from the path, storage, or browser
  const [locale, setLocale] = React.useState<Locales>(desiredLocale);

  React.useEffect(() => {
    // Do a locale redirect if the locale doesn't exist in path yet
    if (!pathLocale) {
      localeRedirect(locale);
    }

    // If storage is not up to date, set it now
    const storedLocale = localStorage.getItem(STORED_LOCALE);
    if (storedLocale !== locale) {
      localStorage.setItem(STORED_LOCALE, locale);
    }

    // Do a locale redirect if the current locale is not what it should be
    if (locale !== desiredLocale) {
      localeRedirect(locale);
    }
  }, [locale, desiredLocale, pathLocale]);

  const state = React.useMemo(() => {
    return {
      locale,
      setLocale,
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>
  );
};

export default LocaleContainer;
