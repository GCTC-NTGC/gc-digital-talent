import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Pool, PoolSkillType } from "@gc-digital-talent/graphql";

// Note: Only one field to check here
// eslint-disable-next-line import/prefer-default-export
export function hasEmptyRequiredFields({ poolSkills }: Pool): boolean {
  // all nonessential skills have an associated required skill level

  const poolSkillsUnpacked = unpackMaybes(poolSkills);
  const nonessentialSkillsLackingLevels = poolSkillsUnpacked.filter(
    (poolSkill) =>
      poolSkill.type?.value === PoolSkillType.Nonessential &&
      !poolSkill.requiredLevel,
  );

  return nonessentialSkillsLackingLevels.length > 0;
}
