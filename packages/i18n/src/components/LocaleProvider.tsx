import { createContext, ReactNode, useState, useEffect, useMemo } from "react";

import { Locales } from "../types";
import {
  getDesiredLocale,
  getPathLocale,
  localeRedirect,
  STORED_LOCALE,
} from "../utils/localize";

export interface LocaleState {
  locale: Locales;
  setLocale: (locale: Locales) => void;
}

const defaultLocaleState = {
  locale: "en" as Locales,
  setLocale: () => {
    /** do nothing */
  },
};

export const LocaleContext = createContext<LocaleState>(defaultLocaleState);

interface LocaleProviderProps {
  children: ReactNode;
}

const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const pathLocale = getPathLocale(window.location.pathname);
  const desiredLocale = getDesiredLocale();
  const [locale, setLocale] = useState<Locales>(desiredLocale);

  useEffect(() => {
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

  const state = useMemo(() => {
    return {
      locale,
      setLocale,
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>
  );
};

export default LocaleProvider;
