import { graphql } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const TeamDepartmentOption_Fragment = graphql(/* GraphQL */ `
  fragment TeamDepartmentOption on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);
