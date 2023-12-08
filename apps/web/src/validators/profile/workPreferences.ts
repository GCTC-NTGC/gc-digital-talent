import isEmpty from "lodash/isEmpty";

import { User } from "~/api/generated";

export type PartialUser = Pick<
  User,
  "acceptedOperationalRequirements" | "positionDuration"
>;

export function hasAllEmptyFields({ positionDuration }: PartialUser): boolean {
  return isEmpty(positionDuration);
}

export function hasEmptyRequiredFields({
  positionDuration,
}: PartialUser): boolean {
  return isEmpty(positionDuration);
}
