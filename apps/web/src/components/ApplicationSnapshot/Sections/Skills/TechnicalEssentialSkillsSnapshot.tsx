import {
  getFragment,
  graphql,
  SkillCategory,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import type { SnapshotExperience } from "~/utils/experienceUtils";

import SkillSnapshot from "./SkillSnapshot";

const TechnicalEssentialSkillsSnapshot_Fragment = graphql(/** GraphQL */ `
  fragment TechnicalEssentialSkillsSnapshot on PoolCandidate {
    pool {
      essentialSkills: poolSkills(type: ESSENTIAL) {
        skill {
          category {
            value
          }

          ...SkillSnapshot
        }
      }
    }
  }
`);

interface TechnicalEssentialSkillsSnapshotProps {
  query?: FragmentType<typeof TechnicalEssentialSkillsSnapshot_Fragment>;
  experiences: SnapshotExperience[];
}

const TechnicalEssentialSkillsSnapshot = ({
  query,
  experiences,
}: TechnicalEssentialSkillsSnapshotProps) => {
  const application = getFragment(
    TechnicalEssentialSkillsSnapshot_Fragment,
    query,
  );

  const technicalEssentialSkills = unpackMaybes(
    application?.pool.essentialSkills
      ?.filter(
        (poolSkill) =>
          poolSkill?.skill?.category?.value === SkillCategory.Technical,
      )
      .flatMap((poolSkill) => poolSkill?.skill),
  );

  return (
    <SkillSnapshot query={technicalEssentialSkills} experiences={experiences} />
  );
};

export default TechnicalEssentialSkillsSnapshot;
