import { defineMessages, IntlShape } from "react-intl";

import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
} from "@gc-digital-talent/date-helpers";

interface JobFair {
  title: string;
  lang?: string;
  href: {
    en: string;
    fr: string;
  };
  date: string;
  location: string;
}

interface FormattedDateArgs {
  y: number;
  m: number;
  d: number;
  intl: IntlShape;
}

const formattedDate = ({ y, m, d, intl }: FormattedDateArgs) =>
  formatDate({
    date: new Date(y, m - 1, d),
    intl,
    formatString: DATE_FORMAT_LOCALIZED,
  });

const locations = defineMessages({
  montreal: {
    defaultMessage: "Montréal, Quebec",
    id: "RojSQE",
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
      defaultMessage:
        "Women in STEM Career and Networking Fair – Carleton University",
      id: "lBX7NE",
      description: "Heading for Women in STEM career fair",
    }),
    href: {
      en: "https://carleton.ca/engineering-design/career-fair-for-women-in-stem/",
      fr: "https://carleton.ca/engineering-design/career-fair-for-women-in-stem/",
    },
    date: formattedDate({ y: 2025, m: 11, d: 20, intl }),
    location: intl.formatMessage(locations.ottawa),
  },
  {
    title: intl.formatMessage({
      defaultMessage: "Winter Career & Networking Fair – Carleton University",
      id: "ZJsUbj",
      description: "Heading for winter career fair",
    }),
    href: {
      en: "https://carleton.ca/career/cu-event/winter-career-networking-fair/",
      fr: "https://carleton.ca/career/cu-event/winter-career-networking-fair/",
    },
    date: formattedDate({ y: 2026, m: 2, d: 4, intl }),
    location: intl.formatMessage(locations.ottawa),
  },
  {
    title: intl.formatMessage({
      defaultMessage: "Career Networking Fair – Algonquin College",
      id: "LCLNos",
      description: "Heading for Algonquin career fair",
    }),
    href: {
      en: "https://www.algonquincollege.com/coop-career-centre/career-fairs/",
      fr: "https://www.algonquincollege.com/coop-career-centre/career-fairs/",
    },
    date: formattedDate({ y: 2026, m: 2, d: 10, intl }),
    location: intl.formatMessage(locations.ottawa),
  },
  {
    title: intl.formatMessage({
      defaultMessage: "Foire de l’emploi - La Cité",
      id: "gy65G/",
      description: "Heading for Foire de l’emploi fair",
    }),
    lang: "fr",
    href: {
      en: "https://www.collegelacite.ca/foire-de-emploi-etudiants",
      fr: "https://www.collegelacite.ca/foire-de-emploi-etudiants",
    },
    date: formattedDate({ y: 2026, m: 2, d: 19, intl }),
    location: intl.formatMessage(locations.ottawa),
  },
  {
    title: intl.formatMessage({
      defaultMessage: "Career Week Job Fair – University of Ottawa",
      id: "qytMp/",
      description: "Heading for career week job fair",
    }),
    href: {
      en: "https://www.uottawa.ca/en/events-all/career-week-job-fair",
      fr: "https://www.uottawa.ca/fr/tous-evenements/salon-lemploi-semaine-carriere",
    },
    date: formattedDate({ y: 2026, m: 2, d: 19, intl }),
    location: intl.formatMessage(locations.ottawa),
  },
];

export default getJobFairs;
