import { Locales } from "../types";
import { STORED_LOCALE } from "./constants";
import { isLocale } from "./localize";

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

function getDesiredLocale() {
  const pathLocale = getPathLocale(window.location.pathname);
  const desiredLocale = pathLocale ?? guessLocale(); // figure it out from the path, storage, or browser

  return desiredLocale;
}

export default getDesiredLocale;
