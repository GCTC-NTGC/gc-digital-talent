import { IntlShape } from "react-intl";

// parameters for the formatDate function
export type FormatDateOptions = {
  date: Date;
  formatString: string;
  intl: IntlShape;
  timeZone?: string;
};
