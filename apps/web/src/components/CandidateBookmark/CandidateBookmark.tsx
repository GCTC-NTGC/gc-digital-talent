import { useIntl } from "react-intl";
import { useMutation } from "urql";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";

import { Button, useControllableState } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import { getFullNameLabel } from "~/utils/nameUtils";

export const PoolCandidate_BookmarkFragment = graphql(/* GraphQL */ `
  fragment PoolCandidate_Bookmark on PoolCandidate {
    id
    isBookmarked
    user {
      id
      firstName
      lastName
    }
  }
`);

const PoolCandidate_ToggleBookmarkMutation = graphql(/* GraphQL */ `
  mutation ToggleBookmark_Mutation($id: ID!) {
    togglePoolCandidateBookmark(id: $id)
  }
`);

interface CandidateBookmarkProps {
  candidateQuery: FragmentType<typeof PoolCandidate_BookmarkFragment>;
  onBookmarkChange?: (newIsBookmarked: boolean) => void;
  bookmarked?: boolean;
  size?: "sm" | "md" | "lg";
}

const CandidateBookmark = ({
  candidateQuery,
  bookmarked,
  onBookmarkChange,
  size = "md",
}: CandidateBookmarkProps) => {
  const intl = useIntl();
  const candidate = getFragment(PoolCandidate_BookmarkFragment, candidateQuery);
  const [isBookmarked, setIsBookmarked] = useControllableState<boolean>({
    controlledProp: bookmarked,
    defaultValue: candidate.isBookmarked ?? undefined,
    onChange: onBookmarkChange,
  });
  // const candidate = getFragment(PoolCandidate_BookmarkFragment, query);
  const [{ fetching: isUpdatingBookmark }, executeToggleBookmarkMutation] =
    useMutation(PoolCandidate_ToggleBookmarkMutation);

  const toggleBookmark = async () => {
    if (candidate.id) {
      await executeToggleBookmarkMutation({
        id: candidate.id,
      })
        .then((res) => {
          if (!res.error) {
            const newIsBookmarked =
              res.data?.togglePoolCandidateBookmark === true;
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
                  defaultMessage: "Candidate's bookmark removed successfully.",
                  id: "glBoRl",
                  description:
                    "Alert displayed to the user when they un-mark a candidate as bookmarked.",
                }),
              );
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

  let iconSize = {
    "data-h2-height": "base(x.9)",
    "data-h2-width": "base(x.9)",
  };
  if (size === "sm") {
    iconSize = {
      "data-h2-height": "base(x.8)",
      "data-h2-width": "base(x.8)",
    };
  }
  if (size === "lg") {
    iconSize = {
      "data-h2-height": "base(x1)",
      "data-h2-width": "base(x1)",
    };
  }

  return (
    <Button
      mode="icon_only"
      color={isBookmarked ? "primary" : "black"}
      onClick={toggleBookmark}
      disabled={isUpdatingBookmark}
      icon={isBookmarked ? BookmarkIconSolid : BookmarkIconOutline}
      {...iconSize}
      aria-label={
        isBookmarked
          ? intl.formatMessage(
              {
                defaultMessage:
                  "Remove {candidateName} bookmark from top of column.",
                id: "ISSs88",
                description:
                  "Un-bookmark button label for applicant assessment tracking.",
              },
              {
                candidateName: getFullNameLabel(
                  candidate.user.firstName,
                  candidate.user.lastName,
                  intl,
                ),
              },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Bookmark {candidateName} to top of column.",
                id: "Gc5hcz",
                description:
                  "Bookmark button label for applicant assessment tracking.",
              },
              {
                candidateName: getFullNameLabel(
                  candidate.user.firstName,
                  candidate.user.lastName,
                  intl,
                ),
              },
            )
      }
    />
  );
};

export default CandidateBookmark;
