import { createPath, parsePath, Path } from "history";
import type { IntlShape } from "react-intl";

import type { LocalizedString, Maybe } from "@gc-digital-talent/graphql";

import { Locales } from "../types";
import { commonMessages } from "../messages";

export function isLocale(locale?: string): locale is Locales {
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

export const changeLocale = (locale: Locales) => {
  localStorage.setItem("stored_locale", locale);
};

export function localizePath(
  path: string | Partial<Path>,
  locale: string,
): string {
  const inputPath = typeof path === "string" ? parsePath(path) : path;

  const pathIsAbsolute = inputPath.pathname?.startsWith("/");
  const pathSegments = inputPath.pathname?.split("/") ?? [];

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
    search: inputPath.search,
    hash: inputPath.hash,
  });
}

export function localeRedirect(locale: Locales) {
  window.location.replace(localizePath(window.location, locale));
}

export const getLocalizedName = (
  name: Maybe<LocalizedString> | undefined,
  intl: IntlShape,
  emptyNotFound = false,
): string => {
  const locale = getLocale(intl);

  const notAvailable = emptyNotFound
    ? ""
    : intl.formatMessage(commonMessages.notAvailable);

  if (!name?.[locale]) {
    return notAvailable;
  }

  return name[locale] ?? notAvailable;
};

export const localizeCurrency = (
  value: number,
  locale: string,
  currency = "CAD",
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
};

export const localizeSalaryRange = (
  min: Maybe<number> | undefined,
  max: Maybe<number> | undefined,
  locale: string,
  currency = "USD",
) => {
  let salaryRange;
  if (min || max) {
    if (min && max) {
      salaryRange = `${localizeCurrency(
        min,
        locale,
        currency,
      )} - ${localizeCurrency(max, locale, currency)}`;
    } else if (min) {
      salaryRange = localizeCurrency(min, locale, currency);
    } else if (max) {
      salaryRange = localizeCurrency(max, locale, currency);
    }
  }

  return salaryRange;
};
