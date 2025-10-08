import { IntlShape } from "react-intl";

import profileMessages from "~/messages/profileMessages";

export const getLabels = (intl: IntlShape) => ({
  contractDuration: intl.formatMessage(profileMessages.contractDuration),
  acceptedOperationalRequirements: intl.formatMessage(
    profileMessages.acceptableRequirements,
  ),
  currentLocation: intl.formatMessage({
    defaultMessage: "Your current location",
    id: "J3yJhp",
    description: "Legend for users current location",
  }),
  currentProvince: intl.formatMessage({
    defaultMessage: "Province, territory or region",
    id: "fm2lKX",
    description: "Label for current province or territory field",
  }),
  currentCity: intl.formatMessage({
    defaultMessage: "City or town",
    id: "Qvep+v",
    description: "Label for current city field in About Me form",
  }),
  workLocationPreferences: intl.formatMessage({
    defaultMessage: "Work location preferences",
    id: "ahK7mI",
    description: "Legend for the work location preferences section",
  }),
  locationExemptions: intl.formatMessage({
    defaultMessage:
      "Please indicate if there is a city that you would like to exclude from a region.",
    id: "dcvRbO",
    description:
      "Location Exemptions field label for work location preference form",
  }),
});
