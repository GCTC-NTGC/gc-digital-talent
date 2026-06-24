import { useIntl } from "react-intl";

import {
  getFragment,
  type FragmentType,
  graphql,
} from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";
import talentRequestMessages from "~/messages/talentRequestMessages";

import TalentRequestEditReferralDialog from "../TalentRequestReferralDialogs/TalentRequestEditReferralDialog";
import type { TalentRequestReferralDialogOptions } from "../TalentRequestReferralDialogs/ReferralFormFields";
import Inbox from "./Inbox";
import { getStatusIcon } from "./utils";

export const TalentRequestTrackedUserInboxItem_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentRequestTrackedUserInboxItem on TalentRequestTrackedUser {
      id
      skillCount
      status {
        value
        label {
          localized
        }
      }
      selectionDecision {
        label {
          localized
        }
      }
      notReferredReason {
        value
        label {
          localized
        }
      }
      notSelectedReason {
        value
        label {
          localized
        }
      }
      sources {
        label {
          localized
        }
      }
      user {
        id
        firstName
        lastName
        priority {
          value
          label {
            localized
          }
        }
      }
      ...TalentRequestEditReferralDialog
    }
  `,
);

interface TrackedUserListItemProps {
  query: FragmentType<typeof TalentRequestTrackedUserInboxItem_Fragment>;
  optionsQuery?: TalentRequestReferralDialogOptions;
  requestedSkillsCount?: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TrackedUserListItem = ({
  query,
  optionsQuery,
  requestedSkillsCount,
  checked,
  onCheckedChange,
}: TrackedUserListItemProps) => {
  const intl = useIntl();
  const trackedUser = getFragment(
    TalentRequestTrackedUserInboxItem_Fragment,
    query,
  );
  const fullName = getFullNameLabel(
    trackedUser.user.firstName,
    trackedUser.user.lastName,
    intl,
  );
  const statusInfo = getStatusIcon(trackedUser.status);
  const StatusIcon = statusInfo?.Icon;

  const reason =
    trackedUser.notSelectedReason?.label?.localized ??
    trackedUser.notReferredReason?.label?.localized ??
    null;

  const source =
    trackedUser.sources.flatMap((s) => s.label.localized).join(", ") || null;

  const priority = trackedUser.user.priority?.label?.localized ?? null;

  return (
    <Inbox.Row
      checked={checked}
      onCheckedChange={onCheckedChange}
      label={fullName}
    >
      <Inbox.Row.Title>
        <TalentRequestEditReferralDialog
          query={trackedUser}
          optionsQuery={optionsQuery}
          trigger={
            <Button
              type="button"
              mode="inline"
              color="black"
              className="after:absolute after:inset-0 hover:text-primary-600 dark:hover:text-primary-200"
            >
              {fullName}
            </Button>
          }
        />
      </Inbox.Row.Title>
      <Inbox.Row.Meta>
        {StatusIcon && statusInfo ? (
          <span className="flex items-center gap-x-1.5">
            <StatusIcon className={statusInfo.className} />
            <span>{statusInfo.label}</span>
          </span>
        ) : null}
        {reason ? <span>{reason}</span> : null}
        <span className="flex items-center gap-x-1.5">
          <span className="rounded border border-gray-200 p-1 dark:border-gray-700">
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {trackedUser.skillCount ?? 0}/{requestedSkillsCount ?? 0}
          </span>
          {intl.formatMessage(talentRequestMessages.requestedSkills)}
        </span>
        {source ? <span>{source}</span> : null}
        {priority ? <span>{priority}</span> : null}
      </Inbox.Row.Meta>
    </Inbox.Row>
  );
};

export default TrackedUserListItem;
