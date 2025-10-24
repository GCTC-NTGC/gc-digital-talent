import { CreateDepartmentInput, Department } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_DepartmentsQueryDocument = /* GraphQL */ `
  query Test_Departments {
    departments {
      id
      departmentNumber
      isCorePublicAdministration
      name {
        en
        fr
      }
    }
  }
`;

/**
 * Get Classifications
 *
 * Get all the classifications directly from the API.
 */
export const getDepartments: GraphQLRequestFunc<Department[]> = async (ctx) => {
  return await ctx
    .post(Test_DepartmentsQueryDocument)
    .then(
      (res: GraphQLResponse<"departments", Department[]>) => res.departments,
    );
};

const Test_DeleteDepartmentMutationDocument = /* GraphQL */ `
  mutation Test_DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id) {
      id
    }
  }
`;

interface DeleteDepartmentArgs {
  id: string;
}

export const deleteDepartment: GraphQLRequestFunc<
  Department,
  DeleteDepartmentArgs
> = async (ctx, { id }) => {
  return await ctx
    .post(Test_DeleteDepartmentMutationDocument, {
      isPrivileged: true,
      variables: { id },
    })
    .then(
      (res: GraphQLResponse<"deleteDepartment", Department>) =>
        res.deleteDepartment,
    );
};

const Test_CreateDepartmentMutationDocument = /* GraphQL */ `
  mutation Test_CreateDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      id
    }
  }
`;

export const createDepartment: GraphQLRequestFunc<
  Department,
  CreateDepartmentInput
> = async (ctx, department) => {
  return await ctx
    .post(Test_CreateDepartmentMutationDocument, {
      isPrivileged: true,
      variables: { department },
    })
    .then(
      (res: GraphQLResponse<"createDepartment", Department>) =>
        res.createDepartment,
    );
};
