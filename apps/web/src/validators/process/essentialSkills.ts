import { empty } from "@gc-digital-talent/helpers";

import { Pool } from "~/api/generated";

// Note: Only one field to check here
// eslint-disable-next-line import/prefer-default-export
export function hasEmptyRequiredFields({ essentialSkills }: Pool): boolean {
  return empty(essentialSkills) || !essentialSkills.length;
}
