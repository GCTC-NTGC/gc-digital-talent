import type {
  EducationExperience,
  EducationExperienceInput,
  WorkExperience,
  WorkExperienceInput,
} from "@gc-digital-talent/graphql";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

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
    .post<GraphQLResponse<"createWorkExperience", WorkExperience>>(
      Test_CreateWorkExperienceMutationDocument,
      {
        variables: {
          userId,
          workExperience,
        },
      },
    )
    .then((res) => res.createWorkExperience);
};

const Test_CreateEducationExperienceMutationDocument = /* GraphQL */ `
  mutation Test_CreateEducationExperience(
    $userId: ID!
    $educationExperience: EducationExperienceInput!
  ) {
    createEducationExperience(
      userId: $userId
      educationExperience: $educationExperience
    ) {
      id
      institution
      areaOfStudy
    }
  }
`;

interface CreateEducationExperienceInput {
  userId: string;
  educationExperience: Partial<EducationExperienceInput>;
}

export const createEducationExperience: GraphQLRequestFunc<
  EducationExperience,
  CreateEducationExperienceInput
> = async (ctx, { userId, educationExperience }) => {
  return ctx
    .post<GraphQLResponse<"createEducationExperience", EducationExperience>>(
      Test_CreateEducationExperienceMutationDocument,
      {
        variables: {
          userId,
          educationExperience,
        },
      },
    )
    .then((res) => res.createEducationExperience);
};
