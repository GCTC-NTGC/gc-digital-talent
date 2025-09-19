import isEmpty from "lodash/isEmpty";

import {
  LocalizedProvinceOrTerritory,
  LocalizedWorkRegion,
  Maybe,
  User,
} from "@gc-digital-talent/graphql";

export interface PartialUser
  extends Pick<
    User,
    "positionDuration" | "locationExemptions" | "currentCity"
  > {
  locationPreferences?: Maybe<Maybe<Pick<LocalizedWorkRegion, "value">>[]>;
  currentProvince?: Maybe<Pick<LocalizedProvinceOrTerritory, "value">>;
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
