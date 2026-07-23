import isEmpty from "lodash/isEmpty";

import type {
  LocalizedFlexibleWorkLocation,
  LocalizedProvinceOrTerritory,
  LocalizedWorkRegion,
  User,
} from "@gc-digital-talent/graphql";
import { FlexibleWorkLocation } from "@gc-digital-talent/graphql";

export interface PartialUser extends Pick<
  User,
  "positionDuration" | "locationExemptions" | "currentCity"
> {
  locationPreferences?:
    (Pick<LocalizedWorkRegion, "value"> | null | undefined)[] | null;
  flexibleWorkLocations?:
    (Pick<LocalizedFlexibleWorkLocation, "value"> | null | undefined)[] | null;
  currentProvince?: Pick<LocalizedProvinceOrTerritory, "value"> | null;
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
