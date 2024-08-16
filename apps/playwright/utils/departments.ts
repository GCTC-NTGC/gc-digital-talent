import { Department } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_DepartmentsQueryDocument = /* GraphQL */ `
  query Test_Departments {
    departments {
      id
      departmentNumber
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
