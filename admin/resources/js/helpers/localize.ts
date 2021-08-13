import { IntlShape } from "react-intl";

export type Locales = "en" | "fr";

export function getLocale(intl: IntlShape): Locales {
  const { locale } = intl;
  if (locale === "en" || locale === "fr") {
    return locale;
  }
  console.warn("Unknown locale. Defaulting to en.");
  return "en";
}
