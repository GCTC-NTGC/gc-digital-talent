import { useIntl } from "react-intl";
import { useQuery } from "urql";
import type { OperationContext } from "urql";
import FlagIconOutline from "@heroicons/react/24/outline/FlagIcon";
import FlagIconSolid from "@heroicons/react/24/solid/FlagIcon";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";

import type { ButtonProps } from "@gc-digital-talent/ui";
import { Button } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import useCandidateFlagToggle from "~/hooks/useCandidateFlagToggle";
import useCandidateBookmarkToggle from "~/hooks/useCandidateBookmarkToggle";
import { getFullNameLabel } from "~/utils/nameUtils";

const commonProps: Partial<ButtonProps> = {
  mode: "inline",
  color: "black",
  className: "justify-start",
  block: true,
};

const ApplicationBookmarkFlag_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationBookmarkFlag on PoolCandidate {
    id
    user {
      firstName
      lastName
    }
    pool {
      displayName {
        display {
          localized
        }
      }
    }
  }
`);

const ApplicationBookmarkFlagState_Query = graphql(/** GraphQL */ `
  query ApplicationBookmarkFlagState($id: UUID!) {
    poolCandidate(id: $id) {
      id
      isBookmarked
      applicationAssessmentData {
        isFlagged
      }
    }
  }
`);

// The cached page snapshot can be stale after a toggle followed by a back-navigation (#16166),
// so the toggle state is always re-fetched from the network rather than seeded from cache.
const networkOnlyRequest: Partial<OperationContext> = {
  requestPolicy: "network-only",
};

const noop = () => {
  // Placeholder handler for the buttons while their state is still unknown.
};

interface BookmarkFlagButtonsProps {
  isBookmarked: boolean;
  isFlagged: boolean;
  bookmarkDisabled?: boolean;
  flagDisabled?: boolean;
  onToggleBookmark: () => void;
  onToggleFlag: () => void;
}

/** Presentational bookmark and flag buttons, with no knowledge of where their state comes from. */
const BookmarkFlagButtons = ({
  isBookmarked,
  isFlagged,
  bookmarkDisabled = false,
  flagDisabled = false,
  onToggleBookmark,
  onToggleFlag,
}: BookmarkFlagButtonsProps) => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-y-4.5">
      <Button
        {...commonProps}
        icon={isBookmarked ? BookmarkIconSolid : BookmarkIconOutline}
        disabled={bookmarkDisabled}
        onClick={onToggleBookmark}
      >
        {isBookmarked
          ? intl.formatMessage({
              defaultMessage: "Remove bookmark",
              id: "27mGKw",
              description: "Label for removing a bookmark",
            })
          : intl.formatMessage({
              defaultMessage: "Add bookmark",
              id: "L2xLV8",
              description: "Label for adding a bookmark",
            })}
      </Button>

      <Button
        {...commonProps}
        icon={isFlagged ? FlagIconSolid : FlagIconOutline}
        disabled={flagDisabled}
        onClick={onToggleFlag}
      >
        {isFlagged
          ? intl.formatMessage({
              defaultMessage: "Remove flag",
              id: "+Nn0rE",
              description: "Label for removing a flag",
            })
          : intl.formatMessage({
              defaultMessage: "Add flag",
              id: "FtP8OZ",
              description: "Label for adding a flag",
            })}
      </Button>
    </div>
  );
};

interface LoadedBookmarkFlagProps {
  id: string;
  name: string;
  processTitle: string;
  isBookmarked: boolean;
  isFlagged: boolean;
}

/**
 * Owns the toggle mutations, seeded with freshly fetched server state.
 *
 * The toggle hooks only read their `defaultValue` on mount, so this is deliberately kept as a
 * separate component: it is not rendered until the real values are known.
 */
const LoadedBookmarkFlag = ({
  id,
  name,
  processTitle,
  isBookmarked: initialIsBookmarked,
  isFlagged: initialIsFlagged,
}: LoadedBookmarkFlagProps) => {
  const [{ isFlagged, isUpdating: isUpdatingFlag }, toggleFlag] =
    useCandidateFlagToggle({
      id,
      defaultValue: initialIsFlagged,
      name,
      processTitle,
    });
  const [{ isBookmarked, isUpdating: isUpdatingBookmark }, toggleBookmark] =
    useCandidateBookmarkToggle({
      id,
      defaultValue: initialIsBookmarked,
      name,
    });

  return (
    <BookmarkFlagButtons
      isBookmarked={isBookmarked}
      isFlagged={isFlagged}
      bookmarkDisabled={isUpdatingBookmark}
      flagDisabled={isUpdatingFlag}
      onToggleBookmark={toggleBookmark}
      onToggleFlag={toggleFlag}
    />
  );
};

interface ApplicationBookmarkFlagProps {
  query: FragmentType<typeof ApplicationBookmarkFlag_Fragment>;
}

const ApplicationBookmarkFlag = ({ query }: ApplicationBookmarkFlagProps) => {
  const intl = useIntl();
  const application = getFragment(ApplicationBookmarkFlag_Fragment, query);

  // This query is run separately without a cache policy, to avoid rendering stale values.
  const [{ data, fetching }] = useQuery({
    query: ApplicationBookmarkFlagState_Query,
    variables: { id: application.id },
    context: networkOnlyRequest,
  });

  const candidate = data?.poolCandidate;

  // Until the current state is known, render the buttons as inert rather than risk showing a
  // stale value from the cache. The same applies if the query failed: an enabled button in an
  // unverified state is worse than one that does nothing.
  if (fetching || !candidate) {
    return (
      <BookmarkFlagButtons
        isBookmarked={false}
        isFlagged={false}
        bookmarkDisabled
        flagDisabled
        onToggleBookmark={noop}
        onToggleFlag={noop}
      />
    );
  }

  return (
    <LoadedBookmarkFlag
      id={application.id}
      name={getFullNameLabel(
        application.user.firstName,
        application.user.lastName,
        intl,
      )}
      processTitle={
        application.pool.displayName?.display.localized ??
        intl.formatMessage(commonMessages.notAvailable)
      }
      isBookmarked={candidate.isBookmarked ?? false}
      isFlagged={candidate.applicationAssessmentData?.isFlagged ?? false}
    />
  );
};

export default ApplicationBookmarkFlag;
