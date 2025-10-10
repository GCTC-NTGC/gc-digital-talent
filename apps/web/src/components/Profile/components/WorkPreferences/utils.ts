import {
  getFragment,
  PositionDuration,
  ProfileWorkPreferencesFragment,
  UpdateUserAsUserInput,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { FormValues } from "./types";
import { WorkPreferencesDisplay_Fragment } from "./Display";

export const dataToFormValues = (
  data: ProfileWorkPreferencesFragment,
): FormValues => {
  const boolToString = (boolVal: boolean | null | undefined): string => {
    return boolVal ? "true" : "false";
  };

  const fragmentData = getFragment(WorkPreferencesDisplay_Fragment, data);

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
    flexibleWorkLocations: unpackMaybes(
      fragmentData?.flexibleWorkLocations?.map((loc) => loc?.value),
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

  // remove WorkRegion.Telework from input
  const filteredLocationPreferences = values.locationPreferences?.filter(
    (pref) => !(pref === WorkRegion.Telework),
  );

  return {
    positionDuration: stringToBool(values.wouldAcceptTemporary)
      ? [PositionDuration.Permanent, PositionDuration.Temporary]
      : [PositionDuration.Permanent], // always accepting permanent, accepting temporary is what is variable
    acceptedOperationalRequirements: values.acceptedOperationalRequirements,
    locationPreferences: filteredLocationPreferences,
    flexibleWorkLocations: values.flexibleWorkLocations,
    locationExemptions: values.locationExemptions,
    currentCity: values.currentCity,
    currentProvince: values.currentProvince,
  };
};
