import React, { useEffect } from "react";
import { IntlProvider } from "react-intl";
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { isLocale, Locales, localizePath } from "../../helpers/localize";
import useIntlLanguages from "../../hooks/useIntlMessages";
import defaultRichTextElements from "../../helpers/format";

const STORED_LOCALE = "stored_locale";

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
  messages: Messages;
}

export const LanguageRedirectContainer: React.FC<
  LanguageRedirectContainerProps
> = ({ messages, children }) => {
  const { locale } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const compiledMessages = useIntlLanguages(locale || "en", messages);
  const guessedLocale = guessLocale();
  const isAvailableLocale = isLocale(locale);

  // If the url already begins with locale, update locale in locale storage. Otherwise, redirect to the correct url.
  useEffect(() => {
    if (locale && isLocale(locale)) {
      localStorage.setItem(STORED_LOCALE, locale);
    }
  }, [locale, guessedLocale, navigate, location, isAvailableLocale]);

  // If the url already begins with locale, pass it to IntlContainer. Otherwise, return null while we redirect.
  return locale && isAvailableLocale ? (
    <IntlProvider
      locale={locale}
      key={locale}
      messages={compiledMessages}
      defaultRichTextElements={defaultRichTextElements}
    >
      {children}
    </IntlProvider>
  ) : (
    <Navigate to={localizePath(location, guessedLocale)} replace />
  );
};

export default LanguageRedirectContainer;
