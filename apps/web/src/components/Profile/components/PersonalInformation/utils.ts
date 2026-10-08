import type { IntlShape } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";

export const getLabels = (intl: IntlShape) => ({
  preferredLang: intl.formatMessage({
    defaultMessage: "Communication language",
    id: "ceofev",
    description: "Legend text for communication language preference",
  }),
  preferredLanguageForInterview: intl.formatMessage({
    defaultMessage: "Spoken interview language",
    id: "ehrsDa",
    description:
      "Legend text for spoken interview language preference for interviews",
  }),
  preferredLanguageForExam: intl.formatMessage({
    defaultMessage: "Written exam language",
    id: "boPmF+",
    description: "Legend text for written exam language preference for exams",
  }),
  telephone: intl.formatMessage(commonMessages.telephone),
  firstName: intl.formatMessage({
    defaultMessage: "Given name",
    id: "DUh8zg",
    description: "Label for given name field",
  }),
  lastName: intl.formatMessage({
    defaultMessage: "Surname",
    id: "dssZUt",
    description: "Label for surname field",
  }),
  citizenship: intl.formatMessage({
    defaultMessage: "Citizenship status",
    id: "7DUfu+",
    description: "Legend text for citizenship status",
  }),
  armedForcesStatus: intl.formatMessage(profileMessages.veteranStatus),
});
