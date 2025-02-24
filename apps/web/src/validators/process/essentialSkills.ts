import { empty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Pool, PoolSkillType } from "@gc-digital-talent/graphql";

import { filterPoolSkillsByType } from "~/utils/skillUtils";

// Note: Only one field to check here
export function hasEmptyRequiredFields({
  poolSkills,
}: Pick<Pool, "poolSkills">): boolean {
  // has at least one essential skill, and all essential skills have associated required skill levels

  const poolSkillsUnpacked = unpackMaybes(poolSkills);
  const essentialSkillsLackingLevels = poolSkillsUnpacked.filter(
    (poolSkill) =>
      poolSkill.type?.value === PoolSkillType.Essential &&
      !poolSkill.requiredLevel,
  );
  const essentialSkills = filterPoolSkillsByType(
    poolSkillsUnpacked,
    PoolSkillType.Essential,
  );
  return (
    empty(essentialSkills) ||
    !essentialSkills.length ||
    essentialSkillsLackingLevels.length > 0
  );
}
