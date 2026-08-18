import isEmpty from "lodash/isEmpty";

import type {
  PositionDuration,
  ProvinceOrTerritory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FlexibleWorkLocation } from "@gc-digital-talent/graphql";

interface PartialWorkRegion {
  value: WorkRegion;
}

interface PartialFlexibleWorkLocation {
  value: FlexibleWorkLocation;
}

interface PartialProvinceOrTerritory {
  value: ProvinceOrTerritory;
}

export interface PartialUser {
  positionDuration?: (PositionDuration | null)[] | null;
  locationExemptions?: string | null;
  currentCity?: string | null;
  locationPreferences?: (PartialWorkRegion | null | undefined)[] | null;
  flexibleWorkLocations?:
    (PartialFlexibleWorkLocation | null | undefined)[] | null;
  currentProvince?: PartialProvinceOrTerritory | null;
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
