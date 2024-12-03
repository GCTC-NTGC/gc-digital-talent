import { NotificationFamily } from "@gc-digital-talent/graphql";

export interface UpdateNotificationInput {
  enabledEmailNotifications: NotificationFamily[];
  enabledInAppNotifications: NotificationFamily[];
}

export type NotificationType = "email" | "inApp";

export interface FormValues {
  systemMessages: NotificationType[];
  applicationUpdates: NotificationType[];
  jobAlerts: NotificationType[];
}
