import {
  WorkExperience,
  WorkExperienceInput,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

export const defaultWorkExperience: Partial<WorkExperienceInput> = {
  role: "Playwright tester",
  organization: "Playwright org",
  division: "Playwright division",
  details: "Some details about being a playwright tester",
};

export const Test_CreateWorkExperienceMutationDocument = /* GraphQL */ `
  mutation Test_CreateWorkExperience(
    $userId: ID!
    $workExperience: WorkExperienceInput!
  ) {
    createWorkExperience(userId: $userId, workExperience: $workExperience) {
      id
    }
  }
`;

interface CreateWorkExperienceInput {
  userId: string;
  workExperience: Partial<WorkExperienceInput>;
}

export const createWorkExperience: GraphQLRequestFunc<
  WorkExperience,
  CreateWorkExperienceInput
> = async (ctx, { userId, workExperience }) => {
  return ctx
    .post(Test_CreateWorkExperienceMutationDocument, {
      variables: {
        userId,
        workExperience,
      },
    })
    .then(
      (res: GraphQLResponse<"createWorkExperience", WorkExperience>) =>
        res.createWorkExperience,
    );
};
