import { Locales } from "@gc-digital-talent/i18n";

// parameters for the formatDate function
export type FormatDateOptions = {
  date: Date;
  formatString: string;
  locale: Locales;
  timeZone?: string;
};
