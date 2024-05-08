import { NotificationFamily } from "@gc-digital-talent/graphql";

export type UpdateNotificationInput = {
  ignoredEmailNotifications: NotificationFamily[];
  ignoredInAppNotifications: NotificationFamily[];
};

type NotificationType = "email" | "inApp";

export type FormValues = {
  systemMessages: NotificationType[];
  applicationUpdates: NotificationType[];
  jobAlerts: NotificationType[];
};
