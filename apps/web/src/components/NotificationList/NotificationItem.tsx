import React from "react";
import { useIntl } from "react-intl";
import { Link as BaseLink, useNavigate } from "react-router-dom";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";
import { useMutation } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  CardBasic,
  DialogPrimitive,
  DropdownMenu,
  Separator,
  cn,
} from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import useNotificationInfo from "~/hooks/useNotificationInfo";

import RemoveDialog from "./RemoveDialog";
import {
  MarkNotificationAsRead_Mutation,
  MarkNotificationAsUnread_Mutation,
} from "./mutations";

type LinkWrapperProps = {
  inDialog?: boolean;
  children: React.ReactNode;
};

const LinkWrapper = ({ inDialog = false, children }: LinkWrapperProps) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!inDialog) return <>{children}</>;

  return <DialogPrimitive.Close asChild>{children}</DialogPrimitive.Close>;
};

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
  inDialog?: boolean;
  onRead?: () => void;
}

const NotificationItem = ({
  notification: notificationQuery,
  inDialog,
  onRead,
}: NotificationItemProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const notification = getFragment(
    NotificationItem_Fragment,
    notificationQuery,
  );
  const info = useNotificationInfo(notification);
  const isUnread = notification.readAt === null;

  const [{ fetching: markingAsRead }, executeMarkAsReadMutation] = useMutation(
    MarkNotificationAsRead_Mutation,
  );
  const [{ fetching: markingAsUnread }, executeMarkAsUnreadMutation] =
    useMutation(MarkNotificationAsUnread_Mutation);

  if (!info) return null;

  const isTogglingReadStatus = markingAsRead || markingAsUnread;

  const toggleReadStatus = () => {
    const mutation = isUnread
      ? executeMarkAsReadMutation
      : executeMarkAsUnreadMutation;
    mutation({ id: notification.id });
  };

  const handleLinkClicked = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();

    executeMarkAsReadMutation({ id: notification.id }).then((res) => {
      if (res.data?.markNotificationAsRead) {
        onRead?.();
        navigate(info.href);
      }
      return false;
    });
  };

  const createdAt = notification.createdAt
    ? formatDate({
        date: parseDateTimeUtc(notification.createdAt),
        formatString: DATE_FORMAT_STRING,
        intl,
      })
    : intl.formatMessage(commonMessages.notAvailable);

  return (
    <li>
      <CardBasic
        className={cn("flex", {
          "!rounded-none p-3": inDialog,
          "outline outline-4": !inDialog,
        })}
        {...(inDialog
          ? {
              "data-h2-shadow":
                "base:selectors[:has(a:focus-visible)](inset x.25 0 0 0 rgb(var(--h2-color-focus)))",
            }
          : {
              "data-h2-outline-color":
                "base(transparent) base:selectors[:has(a:focus-visible)](focus)",
            })}
      >
        <div className="mb-1 self-end px-3">
          {isUnread && (
            <svg
              data-h2-color="base(tertiary)"
              className="h-1.5 w-1.5"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="3.5" cy="3.5" r="3.375" fill="currentColor" />
            </svg>
          )}
        </div>
        <div className="flex flex-grow flex-col-reverse gap-y-3">
          <LinkWrapper inDialog={inDialog}>
            <BaseLink
              to={info.href}
              onClick={handleLinkClicked}
              className={cn("no-underline outline-none", {
                "font-bold": isUnread,
              })}
              data-h2-color="base:hover(secondary.darker)"
            >
              {info.message}
            </BaseLink>
          </LinkWrapper>
          <p
            className="Notification__Date"
            data-h2-font-size="base(caption)"
            data-h2-color="base(black.light)"
          >
            {createdAt}
          </p>
        </div>
        <div className="self-center">
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
                    id: "lSSz6L",
                    description: "Button text for managing a notification",
                  },
                  { notificationName: info.label },
                )}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item asChild onSelect={toggleReadStatus}>
                <Button mode="inline" block disabled={isTogglingReadStatus}>
                  {isUnread
                    ? intl.formatMessage({
                        defaultMessage: "Mark as read",
                        id: "vi7jVU",
                        description:
                          "Button text to mark a notification as read",
                      })
                    : intl.formatMessage({
                        defaultMessage: "Mark as unread",
                        id: "2SnhXV",
                        description:
                          "Button text to mark a notification as unread",
                      })}
                </Button>
              </DropdownMenu.Item>
              <RemoveDialog
                id={notification.id}
                message={info.message}
                date={createdAt}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </CardBasic>
      {inDialog && (
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
      )}
    </li>
  );
};

export default NotificationItem;
