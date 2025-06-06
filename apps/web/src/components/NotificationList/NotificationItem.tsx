import { useIntl } from "react-intl";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";
import { useMutation } from "urql";
import { ReactNode, useEffect, useRef } from "react";
import { tv } from "tailwind-variants";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  Card,
  DialogPrimitive,
  DropdownMenu,
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

const notificationItem = tv({
  base: "flex",
  variants: {
    inDialog: {
      true: "rounded-none p-3 has-focus-visible:shadow-[inset_calc(var(--spacing)*1.5)_0_0_0_var(--color-focus)]",
      false: "has-focus-visible:ring-2 has-focus-visible:ring-focus",
    },
  },
});

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
      <Card className={notificationItem({ inDialog })}>
        <div className="grid w-full grid-cols-[calc(var(--spacing)*3)_1fr] grid-rows-[auto_auto] gap-1.5">
          <div className="row-start-2 m-auto">
            {isUnread && (
              <svg
                className="size-1.5 text-error"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="3.5" cy="3.5" r="3.375" fill="currentColor" />
              </svg>
            )}
          </div>
          <div className="row-start-2 flex w-full items-start justify-between gap-1.5">
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
                <Button
                  mode="icon_only"
                  color="secondary"
                  className="text-black! hover:text-secondary-600! focus-visible:text-black! dark:text-white!"
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
          <p className="col-start-2 row-start-1 text-sm/none text-gray-500 dark:text-gray-300">
            {createdAt}
          </p>
        </div>
      </Card>
      {inDialog && <Separator orientation="horizontal" space="none" />}
    </li>
  );
};

export default NotificationItem;
