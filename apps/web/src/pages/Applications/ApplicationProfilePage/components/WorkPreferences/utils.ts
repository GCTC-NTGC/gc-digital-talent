import { IntlShape } from "react-intl";

import { PositionDuration, UpdateUserAsUserInput, User } from "~/api/generated";

import { FormValues } from "./types";

export const getLabels = (intl: IntlShape) => ({
  wouldAcceptTemporary: intl.formatMessage({
    defaultMessage: "I would consider accepting a job that lasts for:",
    id: "GNtu/7",
    description:
      "Legend Text for required work preferences options in work preferences form",
  }),
  acceptedOperationalRequirements: intl.formatMessage({
    defaultMessage: "I would consider accepting a job that:",
    id: "Vvb8tu",
    description:
      "Legend for optional work preferences check list in work preferences form",
  }),
  locationPreferences: intl.formatMessage({
    defaultMessage: "Work location",
    id: "nueuS8",
    description:
      "Legend for optional work preferences check list in work preferences form",
  }),
  locationExemptions: intl.formatMessage({
    defaultMessage: "Location exemptions",
    id: "0qNkIp",
    description:
      "Location Exemptions field label for work location preference form",
  }),
});

export const dataToFormValues = (data: User): FormValues => {
  const boolToString = (boolVal: boolean | null | undefined): string => {
    return boolVal ? "true" : "false";
  };

  return {
    wouldAcceptTemporary: data.positionDuration
      ? boolToString(data.positionDuration.includes(PositionDuration.Temporary))
      : undefined,
    acceptedOperationalRequirements: data.acceptedOperationalRequirements,
    locationPreferences: data.locationPreferences,
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
  };
};
