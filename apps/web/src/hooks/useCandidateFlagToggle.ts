import { useMutation } from "urql";
import { useIntl } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { useControllableState } from "@gc-digital-talent/ui";

const PoolCandidate_ToggleFlagMutation = graphql(/* GraphQL */ `
  mutation ToggleFlag_Mutation($id: ID!) {
    togglePoolCandidateFlag(id: $id)
  }
`);

interface UseCandidateFlagToggleArgs {
  id: string;
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (newIsFlagged: boolean) => void;
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
  toggle: () => void,
];

const useCandidateFlagToggle = ({
  id,
  defaultValue,
  onChange,
  value,
  showToast = true,
  name,
  processTitle,
}: UseCandidateFlagToggleArgs): UseCandidateFlagToggleReturn => {
  const intl = useIntl();
  const [isFlagged, setIsFlagged] = useControllableState({
    defaultValue: defaultValue ?? false,
    controlledProp: value,
    onChange,
  });

  const [{ fetching: isUpdating }, executeToggleFlagMutation] = useMutation(
    PoolCandidate_ToggleFlagMutation,
  );

  const toggleFlag = async () => {
    // Ignores calls made while a previous toggle is still in flight
    if (id && !isUpdating) {
      const previousIsFlagged = isFlagged ?? false;

      // Flip immediately so the button responds to the click, then reconcile below with
      // the value the server actually stored.
      setIsFlagged(!previousIsFlagged);

      await executeToggleFlagMutation({
        id,
      })
        .then((res) => {
          // urql resolves with an error rather than rejecting, so failures surface here:
          // an authorization denial, expired session, or network error.
          if (!res.data || res.error) {
            throw new Error();
          }

          // flag could come back null, treat that as false
          const newIsFlagged = res.data.togglePoolCandidateFlag === true;
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
          setIsFlagged(previousIsFlagged); // undo optimistic update
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

  return [{ isFlagged: isFlagged ?? false, isUpdating }, toggleFlag];
};

export default useCandidateFlagToggle;
