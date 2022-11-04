import React from "react";
import {
  isLocale,
  localeRedirect,
  Locales,
  localizePath,
} from "../../helpers/localize";

export const STORED_LOCALE = "stored_locale";

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
  const guessedLocale = guessLocale();
  const [locale, setLocale] = React.useState<Locales>(guessedLocale);

  React.useEffect(() => {
    if (locale !== guessedLocale) {
      localStorage.setItem(STORED_LOCALE, locale);
      localeRedirect(locale);
    }
  }, [locale, guessedLocale]);

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
