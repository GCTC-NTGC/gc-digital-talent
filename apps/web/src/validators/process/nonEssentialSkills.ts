import { Pool } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

// Note: Only one field to check here
// eslint-disable-next-line import/prefer-default-export
export function hasAllEmptyFields({ nonessentialSkills }: Pool): boolean {
  return empty(nonessentialSkills);
}
