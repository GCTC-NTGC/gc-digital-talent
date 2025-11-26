import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Well } from "@gc-digital-talent/ui";

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
    <Well className="mx-6">
      <p className="mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "You don't have any new notifications.",
          id: "6cr+Qy",
          description: "Title for the no notifications message",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Check back here for alerts about a variety of activities on the platform, including job opportunities, new features, and more.",
          id: "d4aLWc",
          description: "Explanation of how the list of notifications work",
        })}
      </p>
    </Well>
  );
};

export default NotificationDialogList;
