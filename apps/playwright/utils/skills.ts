import { Skill } from "@gc-digital-talent/graphql";
import { graphqlRequest } from "./graphql";

export const getSkills = async (): Promise<Skill[]> => {
  const res = await graphqlRequest(/* GraphQL */ `
    query Skills {
      skills {
        id
        key
        name {
          en
          fr
        }
      }
    }
  `);

  return res.skills;
};
