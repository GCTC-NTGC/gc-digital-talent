import { useMutation } from "urql";
import { useIntl } from "react-intl";

import { graphql, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { useControllableState } from "@gc-digital-talent/ui";

const PoolCandidate_ToggleFlagMutation = graphql(/* GraphQL */ `
  mutation ToggleFlag_Mutation($id: ID!) {
    togglePoolCandidateFlag(id: $id)
  }
`);

interface UseCandidateFlagToggleArgs {
  id: Scalars["UUID"]["output"];
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (newIsFlagged: boolean) => void;
  showToast?: boolean;
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
    if (id) {
      await executeToggleFlagMutation({
        id,
      })
        .then((res) => {
          if (!res.error) {
            const newIsFlagged = res.data?.togglePoolCandidateFlag === true;
            if (showToast) {
              if (newIsFlagged) {
                toast.success(
                  intl.formatMessage({
                    defaultMessage: "Candidate successfully bookmarked.",
                    id: "neIH5o",
                    description:
                      "Alert displayed to the user when they mark a candidate as bookmarked.",
                  }),
                );
              } else {
                toast.success(
                  intl.formatMessage({
                    defaultMessage:
                      "Candidate's bookmark removed successfully.",
                    id: "glBoRl",
                    description:
                      "Alert displayed to the user when they un-mark a candidate as bookmarked.",
                  }),
                );
              }
            }

            setIsFlagged(newIsFlagged);
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: failed to update a candidate's bookmark.",
              id: "9QJRRw",
              description:
                "Alert displayed to the user when failing to (un-)bookmark a candidate.",
            }),
          );
        });
    }
  };

  return [{ isFlagged: isFlagged ?? false, isUpdating }, toggleFlag];
};

export default useCandidateFlagToggle;
