import { Skill } from "@gc-digital-talent/graphql";

import { graphqlRequest } from "./graphql";

/**
 * Get Skills
 *
 * Get all the skills directly from
 * the API.
 */
// eslint-disable-next-line import/prefer-default-export
export const getSkills = async (): Promise<Skill[]> => {
  const res = await graphqlRequest(/* GraphQL */ `
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
