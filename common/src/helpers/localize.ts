import { IntlShape } from "react-intl";

export type Locales = "en" | "fr";

export function isLocale(locale: string): locale is Locales {
  return locale === "en" || locale === "fr";
}

export function getLocale(intl: IntlShape): Locales {
  const { locale } = intl;
  if (isLocale(locale)) {
    return locale;
  }
  console.warn("Unknown locale. Defaulting to en.");
  return "en";
}

export function oppositeLocale(locale: Locales): Locales {
  return locale === "en" ? "fr" : "en";
}

export function localizePath(path: string, locale: string): string {
  const pathIsAbsolute = path.startsWith("/");
  const pathSegments = path.split("/");

  // Check if path is already localized, ie starts with a valid locale.
  const currentLocale = pathSegments[pathIsAbsolute ? 1 : 0];
  const isLocalized = isLocale(currentLocale);

  const outputSegments = [...pathSegments];
  if (isLocalized) {
    // If path is already localized, swap out the locale segment.
    outputSegments[pathIsAbsolute ? 1 : 0] = locale;
  } else {
    // Otherwise, add the locale segment to the beginning of the path.
    outputSegments.splice(pathIsAbsolute ? 1 : 0, 0, locale);
  }
  return outputSegments.join("/");
}
