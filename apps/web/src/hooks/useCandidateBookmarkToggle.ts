import { useMutation } from "urql";
import { useIntl } from "react-intl";

import { graphql, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { useControllableState } from "@gc-digital-talent/ui";

const TogglePoolCandidateUserBookmark_Mutation = graphql(/* GraphQL */ `
  mutation TogglePoolCandidateUserBookmark_Mutation($poolCandidateId: UUID!) {
    togglePoolCandidateUserBookmark(poolCandidateId: $poolCandidateId)
  }
`);

interface CandidateInfo {
  candidateName: string;
}

interface UseCandidateBookmarkToggleArgs {
  poolCandidateId: Scalars["UUID"]["output"];
  candidateInfo: CandidateInfo;
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
  poolCandidateId,
  candidateInfo,
  defaultValue,
  showToast = true,
}: UseCandidateBookmarkToggleArgs): UseCandidateBookmarkToggleReturn => {
  const intl = useIntl();

  const candidateName = candidateInfo.candidateName;

  const [isBookmarked, setIsBookmarked] = useControllableState({
    defaultValue: defaultValue ?? false,
  });
  const [{ fetching: isUpdating }, executeToggleBookmarkMutation] = useMutation(
    TogglePoolCandidateUserBookmark_Mutation,
  );

  const toggleBookmark = async () => {
    if (poolCandidateId) {
      await executeToggleBookmarkMutation({
        poolCandidateId,
      })
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
                      name: candidateName,
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
                      name: candidateName,
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
              defaultMessage:
                "Error: failed to update a candidates's bookmark.",
              id: "6mwspP",
              description:
                "Alert displayed to the user when failing to (un-)bookmark a candidate",
            }),
          );
        });
    }
  };

  return [{ isBookmarked: isBookmarked ?? false, isUpdating }, toggleBookmark];
};

export default useCandidateBookmarkToggle;
