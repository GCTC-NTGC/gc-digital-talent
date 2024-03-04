import { empty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Pool, PoolSkillType } from "@gc-digital-talent/graphql";

import { filterPoolSkillsByType } from "~/utils/skillUtils";

// Note: Only one field to check here
// eslint-disable-next-line import/prefer-default-export
export function hasEmptyRequiredFields({ poolSkills }: Pool): boolean {
  const essentialSkills = filterPoolSkillsByType(
    unpackMaybes(poolSkills),
    PoolSkillType.Essential,
  );
  return empty(essentialSkills) || !essentialSkills.length;
}
