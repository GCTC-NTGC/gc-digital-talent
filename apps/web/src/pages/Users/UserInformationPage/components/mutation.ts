import { graphql } from "@gc-digital-talent/graphql";

const AdminUpdatePoolCandidate_Mutation = graphql(/* GraphQL */ `
  mutation AdminUpdatePoolCandidate_Mutation(
    $id: UUID!
    $poolCandidate: UpdatePoolCandidateAsAdminInput!
  ) {
    updatePoolCandidateAsAdmin(id: $id, poolCandidate: $poolCandidate) {
      cmoIdentifier
      expiryDate
      status
    }
  }
`);

export default AdminUpdatePoolCandidate_Mutation;
