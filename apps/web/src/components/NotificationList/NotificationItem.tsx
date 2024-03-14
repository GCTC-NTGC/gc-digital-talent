import React from "react";
import { useIntl } from "react-intl";
import { Link as BaseLink } from "react-router-dom";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Button, CardBasic, DropdownMenu } from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import RemoveDialog from "./RemoveDialog";
import { useNotificationInfo } from "../../utils/notification";

const NotificationItem_Fragment = graphql(/* GraphQL */ `
  fragment NotificationItem on Notification {
    id
    type
    readAt
    createdAt
    updatedAt
    ... on PoolCandidateStatusChangedNotification {
      oldStatus
      newStatus
      poolCandidateId
      poolName {
        en
        fr
      }
    }
  }
`);

interface NotificationItemProps {
  /** The actual notification type */
  notification: FragmentType<typeof NotificationItem_Fragment>;
}

const NotificationItem = ({
  notification: notificationQuery,
}: NotificationItemProps) => {
  const intl = useIntl();
  const notification = getFragment(
    NotificationItem_Fragment,
    notificationQuery,
  );
  const info = useNotificationInfo(notification);
  const isUnread = notification.readAt === null;

  if (!info) return null;

  return (
    <li>
      <CardBasic
        data-h2-display="base(flex)"
        data-h2-outline-width="base(3px)"
        data-h2-outline-style="base(solid)"
        data-h2-outline-color="base(transparent) base:selectors[:has(a:focus-visible)](focus)"
      >
        <div
          data-h2-padding="base(0 x.5)"
          data-h2-align-self="base(flex-end)"
          data-h2-font-size="base(copy)"
        >
          {isUnread && (
            <svg
              data-h2-color="base(tertiary)"
              data-h2-height="base(x.25)"
              data-h2-width="base(x.25)"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="3.5" cy="3.5" r="3.375" fill="currentColor" />
            </svg>
          )}
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column-reverse)"
          data-h2-gap="base(x.5 0)"
          data-h2-flex-grow="base(1)"
        >
          <BaseLink
            to={info.href}
            data-h2-text-decoration="base(none)"
            data-h2-color="base:hover(secondary.darker)"
            data-h2-outline="base(none)"
            {...(isUnread && {
              "data-h2-font-weight": "base(700)",
            })}
          >
            {info.message}
          </BaseLink>
          <p
            className="Notification__Date"
            data-h2-font-size="base(caption)"
            data-h2-color="base(black.light)"
          >
            {notification.createdAt
              ? formatDate({
                  date: parseDateTimeUtc(notification.createdAt),
                  formatString: DATE_FORMAT_STRING,
                  intl,
                })
              : intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </div>
        <div data-h2-align-self="base(center)">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                mode="icon_only"
                color="secondary"
                data-h2-color="base(black) base:all:hover(secondary.darkest) base:all:focus-visible(black)"
                icon={EllipsisVerticalIcon}
                aria-label={intl.formatMessage(
                  {
                    defaultMessage: "Manage {notificationName}",
                    description: "Button text for managing a notification",
                  },
                  { notificationName: info.label },
                )}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item
                asChild
                onSelect={() => console.log(`Mark ${notification.id} as read`)}
              >
                <Button mode="inline" block>
                  {intl.formatMessage({
                    defaultMessage: "Mark as read",
                    id: "vi7jVU",
                    description: "Button text to mark a notification as read",
                  })}
                </Button>
              </DropdownMenu.Item>
              <RemoveDialog />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </CardBasic>
    </li>
  );
};

export default NotificationItem;
