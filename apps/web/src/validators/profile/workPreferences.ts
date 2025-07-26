import isEmpty from "lodash/isEmpty";

import { User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "acceptedOperationalRequirements"
  | "positionDuration"
  | "flexibleWorkLocations"
  | "locationExemptions"
  | "currentCity"
  | "currentProvince"
>;

export function hasAllEmptyFields({
  positionDuration,
  flexibleWorkLocations,
  currentCity,
  currentProvince,
}: PartialUser): boolean {
  return (
    isEmpty(positionDuration) &&
    isEmpty(flexibleWorkLocations) &&
    !currentCity &&
    !currentProvince
  );
}

export function hasEmptyRequiredFields({
  positionDuration,
  flexibleWorkLocations,
  currentCity,
  currentProvince,
}: PartialUser): boolean {
  return (
    isEmpty(positionDuration) ||
    isEmpty(flexibleWorkLocations) ||
    !currentCity ||
    !currentProvince
  );
}
