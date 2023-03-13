import { Maybe } from "@gc-digital-talent/graphql";
import { IntlShape } from "react-intl";

// parameters for the formatDate function
export type FormatDateOptions = {
  date: Date;
  formatString: string;
  intl: IntlShape;
  timeZone?: string;
};

export type SeparatedDateString = {
  year: string;
  month: string;
  day: string;
};

export type SeparatedDateRange = {
  min?: Maybe<SeparatedDateString>;
  max?: Maybe<SeparatedDateString>;
};
