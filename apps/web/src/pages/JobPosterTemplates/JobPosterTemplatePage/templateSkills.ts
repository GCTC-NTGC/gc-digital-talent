import {
  graphql,
  JobPosterTemplateSkillsFragment,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import PoolSkillAccordion, {
  PoolSkillAccordion_Fragment,
} from "~/components/PoolSkillAccordion/PoolSkillAccordion";

export const JobPosterTemplateSkills_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateSkills on JobPosterTemplate {
    templateSkills: skills {
      id
      pivot {
        requiredLevel
        type {
          value
        }
      }
      skill {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category {
          value
        }
      }
    }
  }
`);

type TemplateSkill = NonNullable<
  JobPosterTemplateSkillsFragment["templateSkills"]
>[number];
type PoolSkillFragment = React.ComponentProps<
  typeof PoolSkillAccordion
>["poolSkillQuery"];

export function convertTemplateSkillToPoolSkillFragment(
  templateSkill: TemplateSkill,
): PoolSkillFragment {
  const poolSkillFragment = makeFragmentData(
    {
      id: templateSkill.id,
      requiredLevel: templateSkill.pivot?.requiredLevel,
      skill: templateSkill.skill,
    },
    PoolSkillAccordion_Fragment,
  );

  return poolSkillFragment;
}
