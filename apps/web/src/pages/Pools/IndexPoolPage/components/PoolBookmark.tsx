import { useIntl } from "react-intl";
import { useMutation } from "urql";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";

import { IconButton } from "@gc-digital-talent/ui";
import {
  FragmentType,
  LocalizedString,
  Maybe,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { getLocalizedName } from "@gc-digital-talent/i18n";

export const PoolBookmark_Fragment = graphql(/* GraphQL */ `
  fragment PoolBookmark on User {
    id
    poolBookmarks {
      id
    }
  }
`);

const TogglePoolUserBookmark_Mutation = graphql(/* GraphQL */ `
  mutation TogglePoolUserBookmark_Mutation($poolId: UUID!) {
    togglePoolUserBookmark(poolId: $poolId) {
      id
    }
  }
`);

interface PoolBookmarkProps {
  user: FragmentType<typeof PoolBookmark_Fragment>;
  poolId: string;
  poolName?: Maybe<LocalizedString>;
  size?: "sm" | "md" | "lg";
}

const PoolBookmark = ({
  user: userQuery,
  poolId,
  poolName,
  size = "md",
}: PoolBookmarkProps) => {
  const intl = useIntl();
  const user = getFragment(PoolBookmark_Fragment, userQuery);
  const [{ fetching: isUpdatingBookmark }, executeToggleBookmarkMutation] =
    useMutation(TogglePoolUserBookmark_Mutation);

  const isBookmarked = user.poolBookmarks?.find((pool) => pool?.id === poolId);

  const toggleBookmark = async () => {
    if (user.id && poolId) {
      await executeToggleBookmarkMutation({
        poolId,
      })
        .then((res) => {
          if (!res.error) {
            if (!isBookmarked) {
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Process successfully bookmarked.",
                  id: "lZ8lct",

                  description:
                    "Alert displayed to the user when they mark a pool as bookmarked.",
                }),
              );
            } else {
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Process's bookmark removed successfully.",
                  id: "g4F/WB",

                  description:
                    "Alert displayed to the user when they un-mark a pool as bookmarked.",
                }),
              );
            }
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: failed to update a process's bookmark.",
              id: "mzgZQs",
              description:
                "Alert displayed to the user when failing to (un-)bookmark a pool.",
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
                name: getLocalizedName(poolName, intl),
              },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Bookmark {name} to top of column.",
                id: "HxZIwt",
                description: "Bookmark button label for pool table tracking.",
              },
              {
                name: getLocalizedName(poolName, intl),
              },
            )
      }
    />
  );
};

export default PoolBookmark;
