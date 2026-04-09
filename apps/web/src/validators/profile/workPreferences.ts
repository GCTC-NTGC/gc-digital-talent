import isEmpty from "lodash/isEmpty";

import {
  FlexibleWorkLocation,
  type LocalizedFlexibleWorkLocation,
  type LocalizedProvinceOrTerritory,
  type LocalizedWorkRegion,
  type Maybe,
  type User,
} from "@gc-digital-talent/graphql";

export interface PartialUser extends Pick<
  User,
  "positionDuration" | "locationExemptions" | "currentCity"
> {
  locationPreferences?: Maybe<Maybe<Pick<LocalizedWorkRegion, "value">>[]>;
  flexibleWorkLocations?: Maybe<
    Maybe<Pick<LocalizedFlexibleWorkLocation, "value">>[]
  >;
  currentProvince?: Maybe<Pick<LocalizedProvinceOrTerritory, "value">>;
}

export function hasAllEmptyFields({
  positionDuration,
  locationPreferences,
  flexibleWorkLocations,
  currentCity,
  currentProvince,
}: PartialUser): boolean {
  return (
    isEmpty(positionDuration) &&
    isEmpty(locationPreferences) &&
    isEmpty(flexibleWorkLocations) &&
    !currentCity &&
    !currentProvince
  );
}

export function hasEmptyRequiredFields({
  positionDuration,
  locationPreferences,
  flexibleWorkLocations,
  currentCity,
  currentProvince,
}: PartialUser): boolean {
  return (
    isEmpty(positionDuration) ||
    isEmpty(flexibleWorkLocations) ||
    (flexibleWorkLocations?.find(
      (location) =>
        location?.value === FlexibleWorkLocation.Hybrid ||
        location?.value === FlexibleWorkLocation.Onsite,
    ) &&
      isEmpty(locationPreferences)) ||
    !currentCity ||
    !currentProvince
  );
}
