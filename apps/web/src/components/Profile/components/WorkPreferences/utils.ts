import { IntlShape } from "react-intl";

import {
  PositionDuration,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import profileMessages from "~/messages/profileMessages";

import { FormValues, PartialUser } from "./types";

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

export const dataToFormValues = (data: PartialUser): FormValues => {
  const boolToString = (boolVal: boolean | null | undefined): string => {
    return boolVal ? "true" : "false";
  };

  return {
    wouldAcceptTemporary: data.positionDuration
      ? boolToString(data.positionDuration.includes(PositionDuration.Temporary))
      : undefined,
    acceptedOperationalRequirements: unpackMaybes(
      data.acceptedOperationalRequirements?.map((req) => req?.value),
    ),
    currentProvince: data?.currentProvince?.value,
    currentCity: data?.currentCity,
    locationPreferences: unpackMaybes(
      data.locationPreferences?.map((pref) => pref?.value),
    ),
    locationExemptions: data.locationExemptions,
  };
};

export const formValuesToSubmitData = (
  values: FormValues,
): UpdateUserAsUserInput => {
  const stringToBool = (
    stringVal: string | undefined,
  ): boolean | null | undefined => {
    if (stringVal === "true") {
      return true;
    }
    return false;
  };
  return {
    positionDuration: stringToBool(values.wouldAcceptTemporary)
      ? [PositionDuration.Permanent, PositionDuration.Temporary]
      : [PositionDuration.Permanent], // always accepting permanent, accepting temporary is what is variable
    acceptedOperationalRequirements: values.acceptedOperationalRequirements,
    locationPreferences: values.locationPreferences,
    locationExemptions: values.locationExemptions,
    currentCity: values.currentCity,
    currentProvince: values.currentProvince,
  };
};
