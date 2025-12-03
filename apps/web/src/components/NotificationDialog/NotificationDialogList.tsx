import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Notice } from "@gc-digital-talent/ui";

import NotificationItem from "../NotificationList/NotificationItem";

const NotificationDialogItem_Fragment = graphql(/** GraphQL */ `
  fragment NotificationDialogItem on Notification {
    id
    ...NotificationItem
  }
`);

interface NotificationDialogListProps {
  query: FragmentType<typeof NotificationDialogItem_Fragment>[];
  onRead?: () => void;
}

const NotificationDialogList = ({
  query,
  onRead,
}: NotificationDialogListProps) => {
  const intl = useIntl();
  const notifications = getFragment(NotificationDialogItem_Fragment, query);

  return notifications.length > 0 ? (
    <ul className="flex list-none flex-col p-0">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          inDialog
          onRead={onRead}
        />
      ))}
    </ul>
  ) : (
    <Notice.Root className="mx-6">
      <Notice.Title>
        {intl.formatMessage({
          defaultMessage: "You don't have any new notifications.",
          id: "6cr+Qy",
          description: "Title for the no notifications message",
        })}
      </Notice.Title>
      <Notice.Content>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Check back here for alerts about a variety of activities on the platform, including job opportunities, new features, and more.",
            id: "d4aLWc",
            description: "Explanation of how the list of notifications work",
          })}
        </p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default NotificationDialogList;
