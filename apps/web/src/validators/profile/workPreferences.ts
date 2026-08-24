import isEmpty from "lodash/isEmpty";

import type {
  PositionDuration,
  ProvinceOrTerritory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FlexibleWorkLocation } from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

export interface PartialUser {
  positionDuration?: (PositionDuration | null)[] | null;
  locationExemptions?: string | null;
  currentCity?: string | null;
  locationPreferences?:
    (LocalizedEnumValue<WorkRegion> | null | undefined)[] | null;
  flexibleWorkLocations?:
    (LocalizedEnumValue<FlexibleWorkLocation> | null | undefined)[] | null;
  currentProvince?: LocalizedEnumValue<ProvinceOrTerritory> | null;
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
