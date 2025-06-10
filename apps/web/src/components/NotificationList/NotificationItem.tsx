import { useIntl } from "react-intl";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";
import { useMutation } from "urql";
import { ReactNode, useEffect, useRef } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  Card,
  DialogPrimitive,
  DropdownMenu,
  IconButton,
  Separator,
} from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import useNotificationInfo from "~/hooks/useNotificationInfo";

import {
  MarkNotificationAsRead_Mutation,
  MarkNotificationAsUnread_Mutation,
} from "./mutations";
import RemoveDialog from "./RemoveDialog";
import NotificationDownload from "./NotificationDownload";
import NotificationLink from "./NotificationLink";
import NotificationButton from "./NotificationButton";

interface LinkWrapperProps {
  inDialog?: boolean;
  children: ReactNode;
}

const LinkWrapper = ({ inDialog = false, children }: LinkWrapperProps) => {
  if (!inDialog) return <>{children}</>;

  return <DialogPrimitive.Close asChild>{children}</DialogPrimitive.Close>;
};

const NotificationItem_Fragment = graphql(/* GraphQL */ `
  fragment NotificationItem on Notification {
    id
    readAt
    createdAt
    updatedAt
    ... on ApplicationDeadlineApproachingNotification {
      closingDate
      poolName {
        en
        fr
      }
      poolId
      poolCandidateId
    }
    ... on ApplicationStatusChangedNotification {
      poolName {
        en
        fr
      }
    }
    ... on NewJobPostedNotification {
      poolId
    }
    ... on SystemNotification {
      message {
        en
        fr
      }
      href {
        en
        fr
      }
    }
    ... on UserFileGeneratedNotification {
      fileName
    }
    ... on UserFileGenerationErrorNotification {
      fileName
    }
  }
`);

interface NotificationItemProps {
  /** The actual notification type */
  notification: FragmentType<typeof NotificationItem_Fragment>;
  inDialog?: boolean;
  focusRef?: React.MutableRefObject<
    (HTMLAnchorElement & HTMLButtonElement) | null
  >;
  onRead?: () => void;
}

const NotificationItem = ({
  notification: notificationQuery,
  inDialog,
  focusRef,
  onRead,
}: NotificationItemProps) => {
  const intl = useIntl();
  const notification = getFragment(
    NotificationItem_Fragment,
    notificationQuery,
  );
  const itemRef = useRef<HTMLLIElement>(null);
  const info = useNotificationInfo(notification);
  const isUnread = notification.readAt === null;

  const [{ fetching: markingAsRead }, executeMarkAsReadMutation] = useMutation(
    MarkNotificationAsRead_Mutation,
  );
  const [{ fetching: markingAsUnread }, executeMarkAsUnreadMutation] =
    useMutation(MarkNotificationAsUnread_Mutation);

  useEffect(() => {
    if (focusRef) focusRef.current?.focus();
  }, [focusRef]);

  // Store the next list item on mount
  // Then, attempt to focus it on unmount
  useEffect(() => {
    const nextListItem = itemRef.current?.nextElementSibling;
    return () => {
      nextListItem
        ?.querySelector<
          HTMLAnchorElement | HTMLButtonElement
        >("[data-notification-link]")
        ?.focus();
    };
  }, []);

  if (!info) return null;

  const isTogglingReadStatus = markingAsRead || markingAsUnread;

  const toggleReadStatus = async () => {
    const mutation = isUnread
      ? executeMarkAsReadMutation
      : executeMarkAsUnreadMutation;
    await mutation({ id: notification.id });
  };

  const createdAt = notification.createdAt
    ? formatDate({
        date: parseDateTimeUtc(notification.createdAt),
        formatString: DATE_FORMAT_STRING,
        intl,
      })
    : intl.formatMessage(commonMessages.notAvailable);

  const commonLinkProps = {
    ref: focusRef,
    id: notification.id,
    onRead,
    isUnread,
  };

  return (
    <li ref={itemRef}>
      <Card
        className={
          inDialog
            ? "flex rounded-none p-3 shadow-none has-focus-visible:inset-shadow"
            : "has-focus-visible:outline-2 has-focus-visible:outline-focus"
        }
      >
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(x.5 1fr)"
          data-h2-grid-template-rows="base(auto auto)"
          data-h2-gap="base(x.25)"
          data-h2-width="base(100%)"
        >
          <div
            data-h2-font-size="base(copy)"
            data-h2-grid-row="base(2)"
            data-h2-margin="base(0 auto)"
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
            data-h2-grid-row="base(2)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(flex-start)"
            data-h2-gap="base(x.25)"
            data-h2-justify-content="base(space-between)"
            data-h2-width="base(100%)"
          >
            {info.href ? (
              <LinkWrapper inDialog={inDialog}>
                {info.download ? (
                  <NotificationDownload
                    href={info.href}
                    fileName={info.download}
                    {...commonLinkProps}
                  >
                    {info.message}
                  </NotificationDownload>
                ) : (
                  <NotificationLink href={info.href} {...commonLinkProps}>
                    {info.message}
                  </NotificationLink>
                )}
              </LinkWrapper>
            ) : (
              <NotificationButton {...commonLinkProps}>
                {info.message}
              </NotificationButton>
            )}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton
                  color="black"
                  icon={EllipsisVerticalIcon}
                  label={intl.formatMessage(
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
          <p
            className="Notification__Date"
            data-h2-font-size="base(caption)"
            data-h2-color="base(black.light)"
            data-h2-grid-column="base(2)"
            data-h2-grid-row="base(1)"
          >
            {createdAt}
          </p>
        </div>
      </Card>
      {inDialog && (
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
      )}
    </li>
  );
};

export default NotificationItem;
