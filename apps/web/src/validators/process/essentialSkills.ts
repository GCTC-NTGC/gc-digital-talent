import { empty } from "@gc-digital-talent/helpers";
import { Pool } from "@gc-digital-talent/graphql";

// Note: Only one field to check here
// eslint-disable-next-line import/prefer-default-export
export function hasEmptyRequiredFields({ essentialSkills }: Pool): boolean {
  return empty(essentialSkills) || !essentialSkills.length;
}
