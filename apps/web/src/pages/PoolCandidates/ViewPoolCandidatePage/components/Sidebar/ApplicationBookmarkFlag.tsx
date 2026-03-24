import { useIntl } from "react-intl";
import FlagIconOutline from "@heroicons/react/24/outline/FlagIcon";
import FlagIconSolid from "@heroicons/react/24/solid/FlagIcon";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";

import { Button, ButtonProps } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
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

    isFlagged
    isBookmarked
  }
`);

interface ApplicationBookmarkFlagProps {
  query: FragmentType<typeof ApplicationBookmarkFlag_Fragment>;
}

const ApplicationBookmarkFlag = ({ query }: ApplicationBookmarkFlagProps) => {
  const intl = useIntl();
  const application = getFragment(ApplicationBookmarkFlag_Fragment, query);

  const name = getFullNameLabel(
    application.user.firstName,
    application.user.lastName,
    intl,
  );

  const [{ isFlagged }, toggleFlag] = useCandidateFlagToggle({
    id: application.id,
    defaultValue: application.isFlagged ?? false,
    name,
    processTitle:
      application.pool.displayName?.display.localized ??
      intl.formatMessage(commonMessages.notAvailable),
  });
  const [{ isBookmarked }, toggleBookmark] = useCandidateBookmarkToggle({
    id: application.id,
    defaultValue: application.isBookmarked ?? false,
    name,
  });

  return (
    <div className="flex flex-col gap-y-4.5">
      <Button
        {...commonProps}
        icon={isBookmarked ? BookmarkIconSolid : BookmarkIconOutline}
        onClick={toggleBookmark}
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
        onClick={toggleFlag}
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

export default ApplicationBookmarkFlag;
