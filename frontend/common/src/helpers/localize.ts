import { createPath, parsePath } from "history";
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
  return "en";
}

export function oppositeLocale(locale: Locales): Locales {
  return locale === "fr" ? "en" : "fr";
}

export function localizePath(path: string, locale: string): string {

  const {pathname, search, hash} = parsePath(path);
  if(!pathname)
    throw Error('Missing path');

  const pathIsAbsolute = pathname.startsWith("/");
  const pathSegments = pathname.split("/");

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
  return createPath({
    pathname: outputSegments.join("/"),
    search,
    hash
  });
}
