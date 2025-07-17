import { useIntl } from "react-intl";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";

import { IconButton } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import useCandidateBookmarkToggle from "~/hooks/useCandidateBookmarkToggle";

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

export const PoolCandidateCandidateTable_BookmarkFragment = graphql(
  /* GraphQL */ `
    fragment PoolCandidateTable_Bookmark on PoolCandidateAdminView {
      id
      isBookmarked
      user {
        id
        firstName
        lastName
      }
    }
  `,
);

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
  const [{ isBookmarked, isUpdating: isUpdatingBookmark }, toggleBookmark] =
    useCandidateBookmarkToggle({
      id: candidate.id,
      onChange: onBookmarkChange,
      value: bookmarked,
      defaultValue: candidate?.isBookmarked ?? false,
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
