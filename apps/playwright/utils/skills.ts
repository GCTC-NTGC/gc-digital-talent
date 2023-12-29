import { Skill } from "@gc-digital-talent/graphql";
import { graphqlRequest } from "./graphql";

/**
 * Get Skills
 *
 * Get all the skills directly from
 * the API.
 */
export const getSkills = async (): Promise<Skill[]> => {
  const res = await graphqlRequest(/* GraphQL */ `
    query Skills {
      skills {
        id
        key
        category
        name {
          en
          fr
        }
      }
    }
  `);

  return res.skills;
};
