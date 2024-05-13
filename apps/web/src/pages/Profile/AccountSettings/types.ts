import { NotificationFamily } from "@gc-digital-talent/graphql";

export type UpdateNotificationInput = {
  ignoredEmailNotifications: NotificationFamily[];
  ignoredInAppNotifications: NotificationFamily[];
};

export type NotificationType = "email" | "inApp";

export type FormValues = {
  systemMessages: NotificationType[];
  applicationUpdates: NotificationType[];
  jobAlerts: NotificationType[];
};
