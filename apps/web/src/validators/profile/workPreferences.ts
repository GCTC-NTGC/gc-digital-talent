import isEmpty from "lodash/isEmpty";

import { User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "acceptedOperationalRequirements"
  | "positionDuration"
  | "locationPreferences"
  | "flexibleWorkLocations"
  | "locationExemptions"
  | "currentCity"
  | "currentProvince"
>;

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
    isEmpty(locationPreferences) ||
    isEmpty(flexibleWorkLocations) ||
    !currentCity ||
    !currentProvince
  );
}
