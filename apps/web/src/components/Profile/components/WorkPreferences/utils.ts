import {
  PositionDuration,
  ProfileWorkPreferencesFragment,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { FormValues } from "./types";

export const dataToFormValues = (
  data: ProfileWorkPreferencesFragment,
): FormValues => {
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
