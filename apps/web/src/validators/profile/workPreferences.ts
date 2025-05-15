import isEmpty from "lodash/isEmpty";

import {
  LocalizedProvinceOrTerritory,
  LocalizedWorkRegion,
  PositionDuration,
} from "@gc-digital-talent/graphql";

export interface PartialUser {
  positionDuration?: (PositionDuration | null)[] | null;
  locationPreferences?: (LocalizedWorkRegion | null)[] | null;
  currentCity?: string | null;
  currentProvince?: LocalizedProvinceOrTerritory | null;
}

export function hasAllEmptyFields({
  positionDuration,
  locationPreferences,
  currentCity,
  currentProvince,
}: PartialUser): boolean {
  return (
    isEmpty(positionDuration) &&
    isEmpty(locationPreferences) &&
    !currentCity &&
    !currentProvince
  );
}

export function hasEmptyRequiredFields({
  positionDuration,
  locationPreferences,
  currentCity,
  currentProvince,
}: PartialUser): boolean {
  return (
    isEmpty(positionDuration) ||
    isEmpty(locationPreferences) ||
    !currentCity ||
    !currentProvince
  );
}
