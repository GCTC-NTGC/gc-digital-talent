import { Department } from "@gc-digital-talent/graphql";

import { graphqlRequest } from "./graphql";

export const Test_DepartmentsQueryDocument = /* GraphQL */ `
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
 * Get all the classifications directly from
 * the API.
 */
export async function getDepartments(): Promise<Department[]> {
  const res = await graphqlRequest(Test_DepartmentsQueryDocument);

  return res.departments;
}
