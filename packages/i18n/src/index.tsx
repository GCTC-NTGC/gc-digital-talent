import richTextElements from "./components/richTextElements";
import {
  isLocale,
  getLocale,
  oppositeLocale,
  changeLocale,
  localizePath,
  localeRedirect,
  getLocalizedName,
  localizeCurrency,
  localizeSalaryRange,
} from "./utils/localize";
import { STORED_LOCALE } from "./const";
import type { Locales } from "./types";

export {
  richTextElements,
  isLocale,
  getLocale,
  oppositeLocale,
  changeLocale,
  localizePath,
  localeRedirect,
  getLocalizedName,
  localizeCurrency,
  localizeSalaryRange,
  STORED_LOCALE,
};

export type { Locales };
