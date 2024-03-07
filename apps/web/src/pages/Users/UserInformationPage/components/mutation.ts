import { graphql } from "@gc-digital-talent/graphql";

const UpdatePoolCandidateStatusAndExpiry_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePoolCandidateStatusAndExpiry_Mutation(
    $id: UUID!
    $poolCandidate: UpdatePoolCandidateStatusAndExpiryInput!
  ) {
    updatePoolCandidateStatusAndExpiry(id: $id, poolCandidate: $poolCandidate) {
      cmoIdentifier
      expiryDate
      status
    }
  }
`);

export default UpdatePoolCandidateStatusAndExpiry_Mutation;
