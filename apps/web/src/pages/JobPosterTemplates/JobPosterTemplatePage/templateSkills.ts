import type { JobPosterTemplateSkillsFragment } from "@gc-digital-talent/graphql";
import { graphql, makeFragmentData } from "@gc-digital-talent/graphql";

import type PoolSkillAccordion from "~/components/PoolSkillAccordion/PoolSkillAccordion";
import { PoolSkillAccordion_Fragment } from "~/components/PoolSkillAccordion/PoolSkillAccordion";

export const JobPosterTemplateSkills_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateSkills on JobPosterTemplate {
    templateSkills: jobPosterTemplateSkills {
      id
      requiredLevel {
        value
      }
      type {
        value
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
      requiredLevel: templateSkill.requiredLevel?.value,
      skill: templateSkill.skill,
    },
    PoolSkillAccordion_Fragment,
  );

  return poolSkillFragment;
}
