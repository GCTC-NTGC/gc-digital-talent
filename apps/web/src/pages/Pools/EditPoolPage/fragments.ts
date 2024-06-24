import { graphql } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const EditPoolSkills_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolSkills on Pool {
    id
    status {
      value
    }
    poolSkills {
      id
      type {
        value
      }
      requiredLevel
      skill {
        id
        key
        category {
          value
        }
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`);
