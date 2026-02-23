import { OperationResult, useMutation } from "urql";
import { useMemo } from "react";

import { ApplicationStatus } from "@gc-digital-talent/graphql";

import { FormValues } from "./types";
import {
  DisqualifyCandidate_Mutation,
  QualifyAndPlaceCandidate_Mutation,
  QualifyCandidate_Mutation,
  RemoveCandidate_Mutation,
} from "./mutations";

type StatusStrategy = (
  id: string,
  data: FormValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<OperationResult<any, any>>;

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
                  department: { connect: data.department },
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
