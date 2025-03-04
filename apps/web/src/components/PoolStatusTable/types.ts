import { graphql } from "@gc-digital-talent/graphql";

const PoolStatusTable_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment PoolStatusTable_PoolCandidate on PoolCandidate {
    ...ChangeDateDialog_PoolCandidate
    ...ChangeStatusDialog_PoolCandidate
    id
    suspendedAt
    expiryDate
    status {
      value
      label {
        en
        fr
      }
    }
    pool {
      id
      processNumber
      team {
        id
        displayName {
          en
          fr
        }
      }
      workStream {
        id
        name {
          en
          fr
        }
      }
      name {
        en
        fr
      }
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      classification {
        id
        group
        level
      }
    }
  }
`);

export default PoolStatusTable_PoolCandidateFragment;
