import { graphql } from "@gc-digital-talent/graphql";

export const EditPoolSkills_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolSkills on Pool {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    poolSkills {
      id
      type {
        value
        label {
          en
          fr
        }
      }
      requiredLevel
      skill {
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
        description {
          en
          fr
        }
      }
    }
  }
`);
