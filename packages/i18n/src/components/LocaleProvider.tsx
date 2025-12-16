/* eslint-disable formatjs/no-literal-string-in-jsx */
import { createContext, ReactNode, useState, useEffect, useMemo } from "react";

import { Locales } from "../types";
import { isLocale, localeRedirect } from "../utils/localize";

const STORED_LOCALE = "stored_locale";

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
    return locale;
  }

  return "en";
};

interface LinkProps {
  href: string;
  children: ReactNode;
}

const Link = ({ href, children }: LinkProps) => (
  // NOTE: Cannot use react-router here
  // eslint-disable-next-line react/forbid-elements
  <a
    href={href}
    className="text-primary-600 underline hover:text-primary-700 dark:text-primary-200 dark:hover:text-primary-100"
  >
    {children}
  </a>
);

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
  const desiredLocale = pathLocale ?? guessLocale(); // figure it out from the path, storage, or browser
  const [locale, setLocale] = useState<Locales>(desiredLocale);
  const [localeReady, setLocaleReady] = useState<boolean>(false);
  const needsRedirect = !pathLocale || pathLocale !== desiredLocale;

  useEffect(() => {
    // Do a locale redirect if the locale doesn't exist in path yet
    if (needsRedirect) {
      localeRedirect(locale);
      return;
    }

    // If storage is not up to date, set it now
    const storedLocale = localStorage.getItem(STORED_LOCALE);
    if (storedLocale !== locale) {
      localStorage.setItem(STORED_LOCALE, locale);
    }

    setLocaleReady(true);
  }, [locale, needsRedirect]);

  const state = useMemo(() => {
    return {
      locale,
      setLocale,
    };
  }, [locale, setLocale]);

  if (needsRedirect && !localeReady) {
    return (
      <div className="grid h-screen w-screen place-items-center text-center">
        <div className="max-w-5xl">
          <div className="mb-6">
            <p className="mb-.5">
              We’re redirecting you to the version of the site that matches your
              browser settings.
            </p>
            <p>
              Nous vous redirigeons vers la version du site qui correspond aux
              paramètres de votre navigateur.
            </p>
          </div>
          <div>
            <p className="mb-.5">
              If this doesn’t happen automatically, visit{" "}
              <Link href="/en">talent.canada.ca/en</Link> for the English
              version or <Link href="/fr">talent.canada.ca/fr</Link> for the
              French version.
            </p>
            <p>
              Si cette opération ne s’effectue pas automatiquement, consultez le{" "}
              <Link href="/fr">talent.canada.ca/fr</Link> pour obtenir la
              version en français ou le{" "}
              <Link href="/en">talent.canada.ca/en</Link> pour obtenir la
              version en anglais.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>
  );
};

export default LocaleProvider;
