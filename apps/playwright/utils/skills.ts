import { Skill, SkillCategory } from "@gc-digital-talent/graphql";

import DATA from "~/constants/data";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { readCache } from "./cache";

const Test_SkillsQueryDocument = /* GraphQL */ `
  query Skills {
    skills {
      id
      key
      category {
        value
        label {
          en
          fr
        }
      }
      name {
        en
        fr
      }
    }
  }
`;

/**
 * Get Skills
 *
 * Get all the skills directly from the API.
 */
export const getSkills: GraphQLRequestFunc<Skill[]> = async (ctx) => {
  return ctx
    .post(Test_SkillsQueryDocument)
    .then((res: GraphQLResponse<"skills", Skill[]>) => res.skills);
};

/**
 * Get a single technical skill
 */
export const getTechnicalSkill = (): Skill => {
  const technicalSkill = readCache<Skill[]>(DATA.SKILLS).find(
    (skill) => skill.category.value === SkillCategory.Technical,
  );
  return technicalSkill;
};
