import { graphql } from "@gc-digital-talent/graphql";

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
