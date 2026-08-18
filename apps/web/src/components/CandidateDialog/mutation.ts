import { graphql } from "@gc-digital-talent/graphql";

const UpdatePoolCandidateStatus_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePoolCandidateStatus_Mutation(
    $id: UUID!
    $poolCandidate: UpdatePoolCandidateStatusInput!
  ) {
    updatePoolCandidateStatus(id: $id, poolCandidate: $poolCandidate) {
      expiryDate
      applicationStatusData {
        status {
          value
        }
      }
    }
  }
`);

export default UpdatePoolCandidateStatus_Mutation;
