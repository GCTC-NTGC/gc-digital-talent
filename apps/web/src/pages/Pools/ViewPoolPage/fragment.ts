import { graphql } from "@gc-digital-talent/graphql";

const ViewPool_Fragment = graphql(/* GraphQL */ `
  fragment ViewPool on Pool {
    ...AssessmentPlanStatus
    id
    publishingGroup
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
      type
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
