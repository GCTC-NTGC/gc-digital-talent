import { useIntl } from "react-intl";
import { useMutation } from "urql";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";

import { IconButton } from "@gc-digital-talent/ui";
import {
  FragmentType,
  Maybe,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import { getFullNameLabel } from "~/utils/nameUtils";

export const PoolCandidateBookmark_Fragment = graphql(/* GraphQL */ `
  fragment PoolCandidate_Bookmark on User {
    poolCandidateBookmarks {
      id
    }
  }
`);

const TogglePoolCandidateUserBookmark_Mutation = graphql(/* GraphQL */ `
  mutation TogglePoolCandidateUserBookmark_Mutation($poolCandidateId: UUID!) {
    togglePoolCandidateUserBookmark(poolCandidateId: $poolCandidateId) {
      id
    }
  }
`);

interface PoolCandidateBookmarkProps {
  userQuery?: Maybe<FragmentType<typeof PoolCandidateBookmark_Fragment>>;
  poolCandidateId?: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  size?: "sm" | "md" | "lg";
}

const PoolCandidateBookmark = ({
  userQuery,
  poolCandidateId,
  firstName,
  lastName,
  size = "md",
}: PoolCandidateBookmarkProps) => {
  const intl = useIntl();
  const user = getFragment(PoolCandidateBookmark_Fragment, userQuery);
  const [{ fetching: isUpdatingBookmark }, executeToggleBookmarkMutation] =
    useMutation(TogglePoolCandidateUserBookmark_Mutation);

  const isBookmarked = !!user?.poolCandidateBookmarks?.find(
    (candidate) => candidate?.id === poolCandidateId,
  );

  const poolCandidateName = getFullNameLabel(firstName, lastName, intl);

  const toggleBookmark = async () => {
    if (user && poolCandidateId) {
      await executeToggleBookmarkMutation({
        poolCandidateId,
      })
        .then((res) => {
          if (!res.error) {
            if (!isBookmarked) {
              toast.success(
                intl.formatMessage(
                  {
                    defaultMessage: "You've bookmarked {name} for yourself",
                    id: "9DJWk4",
                    description: "Bookmarked a candidate",
                  },
                  {
                    name: poolCandidateName,
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
                    name: poolCandidateName,
                  },
                ),
              );
            }
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

  return (
    <IconButton
      color={isBookmarked ? "secondary" : "black"}
      onClick={toggleBookmark}
      disabled={isUpdatingBookmark}
      icon={isBookmarked ? BookmarkIconSolid : BookmarkIconOutline}
      size={size}
      label={
        isBookmarked
          ? intl.formatMessage(
              {
                defaultMessage: "Remove {name} bookmark from top of column.",
                id: "BB0opI",
                description:
                  "Un-bookmark button label for pool table tracking.",
              },
              {
                name: poolCandidateName,
              },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Bookmark {name} to top of column.",
                id: "HxZIwt",
                description: "Bookmark button label for pool table tracking.",
              },
              {
                name: poolCandidateName,
              },
            )
      }
    />
  );
};

export default PoolCandidateBookmark;
