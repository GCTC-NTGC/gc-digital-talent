import { useIntl } from "react-intl";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";

import { IconButton } from "@gc-digital-talent/ui";
import {
  FragmentType,
  Maybe,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import useCandidateBookmarkToggle from "~/hooks/useCandidateBookmarkToggle";

export const PoolCandidateBookmark_Fragment = graphql(/* GraphQL */ `
  fragment PoolCandidate_Bookmark on User {
    poolCandidateBookmarks {
      id
    }
  }
`);

interface PoolCandidateBookmarkProps {
  poolCandidateId: string;
  userQuery?: Maybe<FragmentType<typeof PoolCandidateBookmark_Fragment>>;
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

  const isBookmarkedDefaultValue = !!user?.poolCandidateBookmarks?.find(
    (candidate) => candidate?.id === poolCandidateId,
  );
  const poolCandidateName = getFullNameLabel(firstName, lastName, intl);

  const [{ isBookmarked, isUpdating: isUpdatingBookmark }, toggleBookmark] =
    useCandidateBookmarkToggle({
      poolCandidateId,
      defaultValue: isBookmarkedDefaultValue,
      candidateInfo: {
        candidateName: poolCandidateName,
      },
    });

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
