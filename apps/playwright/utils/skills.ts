import type {
  CreateSkillInput,
  Skill,
} from "@gc-digital-talent/graphql/schema-types";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

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
    .post<GraphQLResponse<"skills", Skill[]>>(Test_SkillsQueryDocument)
    .then((res) => res.skills);
};

const Test_CreateSkillMutationDocument = /* GraphQL */ `
  mutation Test_CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      key
      category {
        value
      }
      name {
        en
        fr
      }
    }
  }
`;

/**
 * Create Skill
 *
 * Create a skill directly through the API.
 */
export const createSkill: GraphQLRequestFunc<Skill, CreateSkillInput> = async (
  ctx,
  skill,
) => {
  return ctx
    .post<GraphQLResponse<"createSkill", Skill>>(
      Test_CreateSkillMutationDocument,
      {
        isPrivileged: true,
        variables: { skill },
      },
    )
    .then((res) => res.createSkill);
};

const Test_DeleteSkillMutationDocument = /* GraphQL */ `
  mutation Test_DeleteSkill($id: UUID!) {
    deleteSkill(id: $id) {
      id
    }
  }
`;

/**
 * Delete Skill
 *
 * Delete a skill directly through the API.
 */
export const deleteSkill: GraphQLRequestFunc<Skill, string> = async (
  ctx,
  id,
) => {
  return ctx
    .post<GraphQLResponse<"deleteSkill", Skill>>(
      Test_DeleteSkillMutationDocument,
      {
        isPrivileged: true,
        variables: { id },
      },
    )
    .then((res) => res.deleteSkill);
};
