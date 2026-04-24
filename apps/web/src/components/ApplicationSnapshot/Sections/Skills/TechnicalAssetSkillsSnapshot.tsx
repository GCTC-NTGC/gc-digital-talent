import {
  getFragment,
  graphql,
  SkillCategory,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import type { SnapshotExperience } from "~/utils/experienceUtils";

import SkillSnapshot from "./SkillSnapshot";

const TechnicalAssetSkillsSnapshot_Fragment = graphql(/** GraphQL */ `
  fragment TechnicalAssetSkillsSnapshot on PoolCandidate {
    pool {
      assetSkills: poolSkills(type: NONESSENTIAL) {
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

interface TechnicalAssetSkillsSnapshotProps {
  query?: FragmentType<typeof TechnicalAssetSkillsSnapshot_Fragment>;
  experiences: SnapshotExperience[];
}

const TechnicalAssetSkillsSnapshot = ({
  query,
  experiences,
}: TechnicalAssetSkillsSnapshotProps) => {
  const application = getFragment(TechnicalAssetSkillsSnapshot_Fragment, query);

  const technicalAssetSkills = unpackMaybes(
    application?.pool.assetSkills
      ?.filter(
        (poolSkill) =>
          poolSkill?.skill?.category?.value === SkillCategory.Technical,
      )
      .flatMap((poolSkill) => poolSkill?.skill),
  );

  return (
    <SkillSnapshot query={technicalAssetSkills} experiences={experiences} />
  );
};

export default TechnicalAssetSkillsSnapshot;
