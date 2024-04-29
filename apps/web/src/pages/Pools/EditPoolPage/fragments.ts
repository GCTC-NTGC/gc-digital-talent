import { graphql } from "@gc-digital-talent/graphql";

export const EditPoolSkills_Fragment = graphql(/* GraphQL */`
 fragment EditPoolSkills on Pool {
  id
  status
  poolSkills {
    id
    type
    requiredLevel
    skill {
      id
      key
      category
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
`)
