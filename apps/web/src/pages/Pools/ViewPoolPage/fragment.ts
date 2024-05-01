import { graphql } from "@gc-digital-talent/graphql";

const ViewPool_Fragment = graphql(/* GraphQL */ `
  fragment ViewPool on Pool {
    id
    publishingGroup
    publishedAt
    isComplete
    status
    closingDate
    processNumber
    stream
    classification {
      id
      group
      level
    }
    name {
      en
      fr
    }
    poolSkills {
      id
    }
    assessmentSteps {
      id
    }
    poolCandidates {
      id
      pool {
        id
      }
      user {
        id
        email
      }
    }
  }
`);

export default ViewPool_Fragment;
