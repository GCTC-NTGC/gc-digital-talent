import { graphql } from "@gc-digital-talent/graphql";

export const QualifyCandidate_Mutation = graphql(/** GraphQL */ `
  mutation QualifyCandidate(
    $id: UUID!
    $poolCandidate: QualifyCandidateInput!
  ) {
    qualifyCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
    }
  }
`);

export const QualifyAndPlaceCandidate_Mutation = graphql(/** GraphQL */ `
  mutation QualifyAndPlaceCandidate(
    $id: UUID!
    $poolCandidate: QualifyAndPlaceCandidateInput!
  ) {
    qualifyAndPlaceCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
    }
  }
`);

export const DisqualifyCandidate_Mutation = graphql(/** GraphQL */ `
  mutation DisqualifyCandidate($id: UUID!, $reason: DisqualificationReason!) {
    disqualifyCandidate(id: $id, reason: $reason) {
      id
    }
  }
`);

export const RemoveCandidate_Mutation = graphql(/** GraphQL */ `
  mutation RemoveCandidate(
    $id: UUID!
    $removalReason: CandidateRemovalReason!
    $removalReasonOther: String
  ) {
    removeCandidate(
      id: $id
      removalReason: $removalReason
      removalReasonOther: $removalReasonOther
    ) {
      id
    }
  }
`);

export const RevertDecision_Mutation = graphql(/** GraphQL */ `
  mutation RevertDecision($id: UUID!) {
    revertFinalDecision(id: $id) {
      id
    }
  }
`);

export const ReinstateCandidate_Mutation = graphql(/** GraphQL */ `
  mutation ReinstateCandidate($id: UUID!) {
    reinstateCandidate(id: $id) {
      id
    }
  }
`);
