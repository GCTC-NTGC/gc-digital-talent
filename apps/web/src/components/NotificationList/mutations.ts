import { useMutation } from "urql";

import { graphql, Scalars } from "@gc-digital-talent/graphql";

export const MarkNotificationAsRead_Mutation = graphql(/* GraphQL */ `
  mutation MarkNotificationAsRead($id: UUID!) {
    markNotificationAsRead(id: $id) {
      id
    }
  }
`);

export const MarkNotificationAsUnread_Mutation = graphql(/* GraphQL */ `
  mutation MarkNotificationAsUnread($id: UUID!) {
    markNotificationAsUnread(id: $id) {
      id
    }
  }
`);

export const MarkAllNotificationsAsRead_Mutation = graphql(/* GraphQL */ `
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      id
    }
  }
`);

export const DeleteNotification_Mutation = graphql(/* GraphQL */ `
  mutation DeleteNotification($id: UUID!) {
    deleteNotification(id: $id) {
      id
    }
  }
`);

type UseMarkAsReadReturn = [{ fetching: boolean }, () => Promise<void>];

export function useMarkAsRead(
  id: Scalars["UUID"]["output"],
): UseMarkAsReadReturn {
  const [{ fetching }, executeMutation] = useMutation(
    MarkNotificationAsRead_Mutation,
  );

  async function markAsRead() {
    return executeMutation({ id })
      .then((res) => {
        if (!res.data?.markNotificationAsRead) {
          return Promise.reject();
        }

        return Promise.resolve();
      })
      .catch(() => Promise.reject());
  }

  return [{ fetching }, markAsRead];
}
