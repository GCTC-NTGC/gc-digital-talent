import { Skill } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

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
      families {
        id
        key
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
