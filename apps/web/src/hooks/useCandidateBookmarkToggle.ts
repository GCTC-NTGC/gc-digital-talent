import { useMutation } from "urql";
import { useIntl } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import useServerSyncedState from "./useServerSyncedState";

const TogglePoolCandidateUserBookmark_Mutation = graphql(/* GraphQL */ `
  mutation TogglePoolCandidateUserBookmark_Mutation($id: UUID!) {
    togglePoolCandidateUserBookmark(poolCandidateId: $id)
  }
`);

interface UseCandidateBookmarkToggleArgs {
  id: string;
  name: string;
  defaultValue?: boolean;
  showToast?: boolean;
}

interface CandidateBookmarkResult {
  isBookmarked: boolean;
  isUpdating: boolean;
}

type UseCandidateBookmarkToggleReturn = [
  result: CandidateBookmarkResult,
  toggle: () => void,
];

const useCandidateBookmarkToggle = ({
  id,
  name,
  defaultValue,
  showToast = true,
}: UseCandidateBookmarkToggleArgs): UseCandidateBookmarkToggleReturn => {
  const intl = useIntl();

  const [{ fetching: isUpdating }, executeToggleBookmarkMutation] = useMutation(
    TogglePoolCandidateUserBookmark_Mutation,
  );
  const [isBookmarked, setIsBookmarked] = useServerSyncedState(
    defaultValue ?? false,
  );

  const toggleBookmark = async () => {
    if (id) {
      await executeToggleBookmarkMutation({ id })
        .then((res) => {
          if (!res.error) {
            const newIsBookmarked =
              res.data?.togglePoolCandidateUserBookmark === true;
            if (showToast) {
              if (newIsBookmarked) {
                toast.success(
                  intl.formatMessage(
                    {
                      defaultMessage: "You've bookmarked {name} for yourself",
                      id: "9DJWk4",
                      description: "Bookmarked a candidate",
                    },
                    {
                      name,
                    },
                  ),
                );
              } else {
                toast.success(
                  intl.formatMessage(
                    {
                      defaultMessage: "You've removed the bookmark for {name}.",
                      id: "UBY4qe",
                      description: "Un-bookmarked a candidate",
                    },
                    {
                      name,
                    },
                  ),
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
              id: "NngAJq",
              description:
                "Alert displayed to the user when failing to (un-)bookmark a candidate",
            }),
          );
        });
    }
  };

  return [{ isBookmarked, isUpdating }, toggleBookmark];
};

export default useCandidateBookmarkToggle;
