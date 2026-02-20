import { OperationResult, useMutation } from "urql";
import { useMemo } from "react";

import { ApplicationStatus, graphql } from "@gc-digital-talent/graphql";

import { FormValues } from "./types";

type StatusStrategy = (
  id: string,
  data: FormValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<OperationResult<any, any>>;

const QualifyCandidate_Mutation = graphql(/** GraphQL */ `
  mutation QualifyCandidate(
    $id: UUID!
    $poolCandidate: QualifyCandidateInput!
  ) {
    qualifyCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
    }
  }
`);

const QualifyAndPlaceCandidate_Mutation = graphql(/** GraphQL */ `
  mutation QualifyAndPlaceCandidate(
    $id: UUID!
    $poolCandidate: QualifyAndPlaceCandidateInput!
  ) {
    qualifyAndPlaceCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
    }
  }
`);

const DisqualifyCandidate_Mutation = graphql(/** GraphQL */ `
  mutation DisqualifyCandidate($id: UUID!, $reason: DisqualificationReason!) {
    disqualifyCandidate(id: $id, reason: $reason) {
      id
    }
  }
`);

const RemoveCandidate_Mutation = graphql(/** GraphQL */ `
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

const useApplicationStatusMutation = () => {
  const [, qualify] = useMutation(QualifyCandidate_Mutation);
  const [, qualifyAndPlace] = useMutation(QualifyAndPlaceCandidate_Mutation);
  const [, disqualify] = useMutation(DisqualifyCandidate_Mutation);
  const [, remove] = useMutation(RemoveCandidate_Mutation);

  const mutationMap = useMemo(
    () =>
      new Map<ApplicationStatus, StatusStrategy>([
        [
          ApplicationStatus.Qualified,
          async (id, data) => {
            if (!data.expiryDate) throw new Error("Expiry date required.");

            // Logical branching for Placement
            if (data.placementType && data.department) {
              return qualifyAndPlace({
                id,
                poolCandidate: {
                  expiryDate: data.expiryDate,
                  placementType: data.placementType,
                  department: data.department,
                },
              });
            }
            return qualify({
              id,
              poolCandidate: { expiryDate: data.expiryDate },
            });
          },
        ],
        [
          ApplicationStatus.Disqualified,
          async (id, data) => {
            if (!data.disqualificationReason)
              throw new Error("Reason required.");
            return disqualify({
              id,
              reason: data.disqualificationReason,
            });
          },
        ],
        [
          ApplicationStatus.Removed,
          async (id, data) => {
            if (!data.removalReason)
              throw new Error("Removal reason required.");
            return remove({
              id,
              removalReason: data.removalReason,
              removalReasonOther: data.removalReasonOther,
            });
          },
        ],
      ]),
    [qualify, qualifyAndPlace, disqualify, remove],
  );

  const submitStatusChange = async (id: string, data: FormValues) => {
    const strategy = data.status ? mutationMap.get(data.status) : null;
    if (!strategy) throw new Error();
    return strategy(id, data);
  };

  return { submitStatusChange };
};

export default useApplicationStatusMutation;
