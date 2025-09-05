import { defineMessages, IntlShape } from "react-intl";

import { LocalizedString } from "@gc-digital-talent/graphql";
import {
  DATE_FORMAT_LONG_STRING,
  formatDate,
} from "@gc-digital-talent/date-helpers";

interface JobFair {
  title: string;
  href: {
    en: string;
    fr: string;
  };
  date: string;
  location: string;
}

const locations = defineMessages({
  montreal: {
    defaultMessage: "Montreal, Quebec",
    id: "3AZTaf",
    description: "Location name of Montreal, Quebec",
  },
  ottawa: {
    defaultMessage: "Ottawa, Ontario",
    id: "FxOKfM",
    description: "Location name of Ottawa, Ontario",
  },
});

const getJobFairs = (intl: IntlShape): JobFair[] => [
  {
    title: intl.formatMessage({
      defaultMessage: "TechFair – McGill University",
      id: "s0bXMy",
      description: "Heading for TechFair job fair",
    }),
    href: {
      en: "https://www.mcgill.ca/careers4engineers/techfair",
      fr: "https://www.mcgill.ca/careers4engineers/fr/techfair",
    },
    date: intl.formatMessage({
      defaultMessage: "September 25 and 26, 2025",
      id: "9Qc9PO",
      description: "Date for TechFair",
    }),
    location: intl.formatMessage(locations.montreal),
  },
  {
    title: intl.formatMessage({
      defaultMessage: "Career Expo University of Ottawa",
      id: "q5nhMd",
      description: "Heading for TechFair job fair",
    }),
    href: {
      en: "https://www.uottawa.ca/en/events-all/career-expo",
      fr: "https://www.uottawa.ca/fr/tous-evenements/expo-carrieres",
    },
    date: formatDate({
      date: new Date(2025, 10, 2),
      intl,
      formatString: DATE_FORMAT_LONG_STRING,
    }),
    location: intl.formatMessage(locations.ottawa),
  },
];

export default getJobFairs;
