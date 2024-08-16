import { Skill } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc } from "./graphql";

/**
 * Get Skills
 *
 * Get all the skills directly from
 * the API.
 */
// eslint-disable-next-line import/prefer-default-export
export const getSkills: GraphQLRequestFunc<Skill[]> = async (ctx) => {
  const res = await ctx.post(/* GraphQL */ `
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
  `);

  return res.skills;
};
