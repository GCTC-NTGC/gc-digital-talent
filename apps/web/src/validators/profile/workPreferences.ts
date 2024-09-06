import isEmpty from "lodash/isEmpty";

import { User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "acceptedOperationalRequirements"
  | "positionDuration"
  | "locationPreferences"
  | "locationExemptions"
  | "currentCity"
  | "currentProvince"
>;

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
