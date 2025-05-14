import { Skill } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { apiCache } from "./cache";

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
  let skills = apiCache.get("skills");
  if (!skills) {
    skills =
      (await ctx
        .post(Test_SkillsQueryDocument)
        .then((res: GraphQLResponse<"skills", Skill[]>) => res.skills)) ?? [];

    apiCache.set("skills", skills);
  }

  return skills;
};
