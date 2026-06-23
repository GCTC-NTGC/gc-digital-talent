import { useIntl } from "react-intl";
import PaperAirplaneIcon from "@heroicons/react/16/solid/PaperAirplaneIcon";
import ArchiveBoxIcon from "@heroicons/react/16/solid/ArchiveBoxIcon";
import CheckIcon from "@heroicons/react/16/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon";
import { tv } from "tailwind-variants";

import { type IconType } from "@gc-digital-talent/ui";
import {
  getFragment,
  type FragmentType,
  TalentRequestTrackedUserStatus,
  graphql,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import { SkillMatchDialog } from "~/components/Table/SkillMatchDialog";

import { TalentRequestUserSkillMatch_Fragment } from "../skillMatchFragment";
import TalentRequestEditReferralDialog from "../TalentRequestReferralDialogs/TalentRequestEditReferralDialog";
import type { TalentRequestReferralDialogOptions } from "../TalentRequestReferralDialogs/ReferralFormFields";
import Inbox from "./Inbox";

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

const statusIcons: Record<TalentRequestTrackedUserStatus, IconType> = {
  [TalentRequestTrackedUserStatus.Referred]: PaperAirplaneIcon,
  [TalentRequestTrackedUserStatus.NotReferred]: ArchiveBoxIcon,
  [TalentRequestTrackedUserStatus.Selected]: CheckIcon,
  [TalentRequestTrackedUserStatus.NotSelected]: XMarkIcon,
};

const statusIconStyle = tv({
  base: "size-4 shrink-0",
  variants: {
    status: {
      [TalentRequestTrackedUserStatus.Referred]:
        "text-primary-600 dark:text-primary-200",
      [TalentRequestTrackedUserStatus.NotReferred]:
        "text-gray-500 dark:text-gray-300",
      [TalentRequestTrackedUserStatus.Selected]:
        "text-success-600 dark:text-success-200",
      [TalentRequestTrackedUserStatus.NotSelected]:
        "text-error-600 dark:text-error-200",
    },
  },
});

const nameTrigger = tv({
  base: "block w-fit text-left font-bold outline-none after:absolute after:inset-0 hover:underline focus-visible:rounded-xs focus-visible:bg-focus focus-visible:text-black",
});

const interactiveCell = tv({ base: "relative z-10" });

interface TrackedUserListItemProps {
  query: FragmentType<typeof TalentRequestTrackedUserInboxItem_Fragment>;
  skillsQuery: FragmentType<typeof TalentRequestUserSkillMatch_Fragment>[];
  optionsQuery?: TalentRequestReferralDialogOptions;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TrackedUserListItem = ({
  query,
  skillsQuery,
  optionsQuery,
  checked,
  onCheckedChange,
}: TrackedUserListItemProps) => {
  const intl = useIntl();
  const trackedUser = getFragment(
    TalentRequestTrackedUserInboxItem_Fragment,
    query,
  );
  const matchedSkills = getFragment(
    TalentRequestUserSkillMatch_Fragment,
    skillsQuery,
  );

  const fullName = getFullNameLabel(
    trackedUser.user.firstName,
    trackedUser.user.lastName,
    intl,
  );

  const statusValue = trackedUser.status?.value;
  const statusLabel = trackedUser.status?.label?.localized;
  const StatusIcon = statusValue ? statusIcons[statusValue] : undefined;

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
            <button type="button" className={nameTrigger()}>
              {fullName}
            </button>
          }
        />
      </Inbox.Row.Title>
      <Inbox.Row.Meta>
        {StatusIcon && statusLabel && statusValue ? (
          <span className="flex items-center gap-x-1.5">
            <StatusIcon className={statusIconStyle({ status: statusValue })} />
            <span>{statusLabel}</span>
          </span>
        ) : null}
        {reason ? <span>{reason}</span> : null}
        <span className={interactiveCell()}>
          <SkillMatchDialog
            filteredSkills={[...matchedSkills]}
            skillsCount={trackedUser.skillCount}
            userId={trackedUser.user.id}
            poolCandidateName={fullName}
          />
        </span>
        {source ? <span>{source}</span> : null}
        {priority ? <span>{priority}</span> : null}
      </Inbox.Row.Meta>
    </Inbox.Row>
  );
};

export default TrackedUserListItem;
