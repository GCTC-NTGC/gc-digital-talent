import type { Messages } from "../types";
import CommonFrench from "../lang/frCompiled.json";
import { Locales } from "../types";
import { isLocale } from "./localize";

export const STORED_LOCALE = "stored_locale";

/**
 * Get the current locale from a location pathname
 */
export function getPathLocale(pathname: string): Locales | null {
  const pathLocale = pathname.split("/")[1]; // Note: for an absolute path which starts with /, the first element is an empty string.
  return isLocale(pathLocale) ? pathLocale : null;
}

/**
 * Presume currently set locale,
 * then fall back to English if unable to determine
 */
function guessLocale(): Locales {
  const locale: string | undefined =
    // Check for stored locale in localStorage.
    localStorage.getItem(STORED_LOCALE) ??
    // If nothing is stored, check for the browser's locale.
    navigator?.language?.split("-")[0];

  // If stored locale or browser locale is unavailable or invalid, default to English
  if (isLocale(locale)) {
    return locale;
  }

  return "en";
}

/**
 * Get user's desired locale
 * First from path, then presumption
 */
export function getDesiredLocale() {
  const pathLocale = getPathLocale(window.location.pathname);
  const desiredLocale = pathLocale ?? guessLocale(); // figure it out from the path, storage, or browser

  return desiredLocale;
}

/**
 * Combine multiple message files
 */
export function combineMessages(
  locale: string | null,
  messages: Messages | undefined,
) {
  return locale === "fr"
    ? {
        ...messages,
        ...CommonFrench,
      }
    : undefined;
}
