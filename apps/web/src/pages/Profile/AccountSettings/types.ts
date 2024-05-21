import { NotificationFamily } from "@gc-digital-talent/graphql";

export type UpdateNotificationInput = {
  enabledEmailNotifications: NotificationFamily[];
  enabledInAppNotifications: NotificationFamily[];
};

export type NotificationType = "email" | "inApp";

export type FormValues = {
  systemMessages: NotificationType[];
  applicationUpdates: NotificationType[];
  jobAlerts: NotificationType[];
};
