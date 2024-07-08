import { IntlShape } from "react-intl";

import {
  PositionDuration,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { FormValues, PartialUser } from "./types";

export const getLabels = (intl: IntlShape) => ({
  wouldAcceptTemporary: intl.formatMessage({
    defaultMessage: "I would consider accepting a job that lasts for...",
    id: "/DCykA",
    description:
      "Legend Text for required work preferences options in work preferences form",
  }),
  acceptedOperationalRequirements: intl.formatMessage({
    defaultMessage: "I would consider accepting a job that...",
    id: "82Oe0C",
    description:
      "Legend for optional work preferences check list in work preferences form",
  }),
  locationPreferences: intl.formatMessage({
    defaultMessage: "I am willing to work in the...",
    id: "1PVIbX",
    description: "Legend for work regions check list in work preferences form",
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
  };
};
