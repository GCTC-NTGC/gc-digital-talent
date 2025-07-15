import { useState } from "react";
import { useMutation } from "urql";
import { useIntl } from "react-intl";

import { graphql, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

const PoolCandidate_ToggleBookmarkMutation = graphql(/* GraphQL */ `
  mutation ToggleBookmark_Mutation($id: ID!) {
    togglePoolCandidateBookmark(id: $id)
  }
`);

interface UseCandidateBookmarkToggleArgs {
  id: Scalars["UUID"]["output"];
  defaultValue?: boolean;
  showToast?: boolean;
}

interface CandidateBookMarkResult {
  isBookmarked: boolean;
  isUpdating: boolean;
}

type UseCandidateBookmarkToggleReturn = [
  result: CandidateBookMarkResult,
  toggle: () => void,
];

const useCandidateBookmarkToggle = ({
  id,
  defaultValue,
  showToast = true,
}: UseCandidateBookmarkToggleArgs): UseCandidateBookmarkToggleReturn => {
  const intl = useIntl();
  const [isBookmarked, setIsBookmarked] = useState(defaultValue ?? false);

  const [{ fetching: isUpdating }, executeToggleBookmarkMutation] = useMutation(
    PoolCandidate_ToggleBookmarkMutation,
  );

  const toggleBookmark = async () => {
    if (id) {
      await executeToggleBookmarkMutation({
        id,
      })
        .then((res) => {
          if (!res.error) {
            const newIsBookmarked =
              res.data?.togglePoolCandidateBookmark === true;
            if (showToast) {
              if (newIsBookmarked) {
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

            setIsBookmarked(newIsBookmarked);
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

  return [{ isBookmarked, isUpdating }, toggleBookmark];
};

export default useCandidateBookmarkToggle;
