import { useMutation } from "urql";
import { useIntl } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import useServerSyncedState from "./useServerSyncedState";

const PoolCandidate_ToggleFlagMutation = graphql(/* GraphQL */ `
  mutation ToggleFlag_Mutation($id: ID!) {
    togglePoolCandidateFlag(id: $id)
  }
`);

interface UseCandidateFlagToggleArgs {
  id: string;
  defaultValue?: boolean;
  showToast?: boolean;
  name: string;
  processTitle: string;
}

interface CandidateFlagResult {
  isFlagged: boolean;
  isUpdating: boolean;
}

type UseCandidateFlagToggleReturn = [
  result: CandidateFlagResult,
  toggle: () => Promise<void>,
];

const useCandidateFlagToggle = ({
  id,
  defaultValue,
  showToast = true,
  name,
  processTitle,
}: UseCandidateFlagToggleArgs): UseCandidateFlagToggleReturn => {
  const intl = useIntl();
  const [{ fetching: isUpdating }, executeToggleFlagMutation] = useMutation(
    PoolCandidate_ToggleFlagMutation,
  );
  const [isFlagged, setIsFlagged] = useServerSyncedState(
    defaultValue ?? false,
    id,
  );

  const toggleFlag = async () => {
    if (id) {
      await executeToggleFlagMutation({
        id,
      })
        .then((res) => {
          // urql resolves rather than rejects on a GraphQL error, so rethrow to reach
          // the error toast below.
          if (res.error) throw new Error(res.error.message);
          const newIsFlagged = res.data?.togglePoolCandidateFlag;
          // The mutation returns a nullable Boolean: a missing value means the toggle
          // did not happen, and must not be reported as a successful un-flag.
          if (typeof newIsFlagged !== "boolean") {
            throw new Error("Flag toggle returned no value");
          }

          if (showToast) {
            if (newIsFlagged) {
              toast.success(
                intl.formatMessage(
                  {
                    defaultMessage:
                      "You've flagged {candidateName} in {processTitle}. Other authorized users can also view or remove this flag.",
                    id: "NRX2CA",
                    description:
                      "Alert displayed to the user when they mark a candidate as flagged.",
                  },
                  {
                    candidateName: name,
                    processTitle,
                  },
                ),
              );
            } else {
              toast.success(
                intl.formatMessage(
                  {
                    defaultMessage:
                      "You've removed the flag for {candidateName} in {processTitle}.",
                    id: "idwHJf",
                    description:
                      "Alert displayed to the user when they un-flag a candidate.",
                  },
                  {
                    candidateName: name,
                    processTitle,
                  },
                ),
              );
            }
          }

          setIsFlagged(newIsFlagged);
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: failed to update a candidate's flag.",
              id: "07pYaF",
              description:
                "Alert displayed to the user when failing to (un-)flag a candidate.",
            }),
          );
        });
    }
  };

  return [{ isFlagged, isUpdating }, toggleFlag];
};

export default useCandidateFlagToggle;
