import { unpackMaybes } from "@gc-digital-talent/helpers";
import { PoolSkillType } from "@gc-digital-talent/graphql";

import type { PoolWithSkills } from "~/utils/skillUtils";

// Note: Only one field to check here
export function hasEmptyRequiredFields({
  poolSkills,
}: PoolWithSkills): boolean {
  // all nonessential skills have an associated required skill level

  const poolSkillsUnpacked = unpackMaybes(poolSkills);
  const nonessentialSkillsLackingLevels = poolSkillsUnpacked.filter(
    (poolSkill) =>
      poolSkill.type?.value === PoolSkillType.Nonessential &&
      !poolSkill.requiredLevel,
  );

  return nonessentialSkillsLackingLevels.length > 0;
}
