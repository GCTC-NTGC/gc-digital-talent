import { useSubscription } from "urql";

import { Ul } from "@gc-digital-talent/ui";
import { graphql, NotificationSubscription } from "@gc-digital-talent/graphql";
import { useAuthentication } from "@gc-digital-talent/auth";
import { toast } from "@gc-digital-talent/toast";

const Notification_Subscription = graphql(/** GraphQL */ `
  subscription Notification {
    notificationReceived {
      id
      data
    }
  }
`);

type NotificationItem = NonNullable<
  NotificationSubscription["notificationReceived"]
>;

const NotificationList = () => {
  const [res] = useSubscription(
    { query: Notification_Subscription },
    (messages: NotificationItem[] | undefined, result) => {
      const currentMessages = messages ?? [];
      if (!result.notificationReceived) return currentMessages;

      toast.info(`New notification: ${result.notificationReceived.id}`);

      return [result.notificationReceived, ...currentMessages];
    },
  );

  if (!res.data?.length) {
    return <p>No notifications.</p>;
  }

  return (
    <Ul space="sm" className="text-sm">
      {res.data.map((msg) => (
        <li key={msg.id}>
          <pre>{JSON.stringify(msg.data)}</pre>
        </li>
      ))}
    </Ul>
  );
};

const NotificationTest = () => {
  const { loggedIn } = useAuthentication();

  if (!loggedIn) return null;

  return (
    <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-md bg-white p-3 shadow-lg dark:bg-gray-600">
      <NotificationList />
    </div>
  );
};

export default NotificationTest;
