import { createPath, parsePath, Path } from "history";
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

export function localizePath(
  path: Partial<Path>,
  locale: string,
): Partial<Path> {
  const pathIsAbsolute = path.pathname?.startsWith("/");
  const pathSegments = path.pathname?.split("/") ?? [];

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
  return {
    pathname: outputSegments.join("/"),
    search: path.search,
    hash: path.hash,
  };
}

export function localizePathString(path: string, locale: string): string {
  return createPath(localizePath(parsePath(path), locale));
}
