import { NotificationFamily } from "@gc-digital-talent/graphql";

import { FormValues, UpdateNotificationInput, NotificationType } from "./types";

const inputNameToFamilyMap: Record<keyof FormValues, NotificationFamily> = {
  systemMessages: NotificationFamily.SystemMessage,
  applicationUpdates: NotificationFamily.ApplicationUpdate,
  jobAlerts: NotificationFamily.JobAlert,
};

export const formValuesToData = (values: FormValues) => {
  const data: UpdateNotificationInput = {
    ignoredEmailNotifications: [],
    ignoredInAppNotifications: [],
  };

  const keys = Object.keys(values) as Array<keyof FormValues>;
  keys.forEach((key) => {
    const family = inputNameToFamilyMap[key];
    const enabledTypes = values[key];

    // System messages cannot be ignored
    if (family && family !== NotificationFamily.SystemMessage) {
      if (!enabledTypes.includes("email")) {
        data.ignoredEmailNotifications = [
          ...data.ignoredEmailNotifications,
          family,
        ];
      }

      if (!enabledTypes.includes("inApp")) {
        data.ignoredInAppNotifications = [
          ...data.ignoredInAppNotifications,
          family,
        ];
      }
    }
  });

  return data;
};

type IgnoredNotifications = {
  ignoredEmailNotifications: NotificationFamily[];
  ignoredInAppNotifications: NotificationFamily[];
};

const getIgnoredNotificationFamilyValue = (
  {
    ignoredEmailNotifications,
    ignoredInAppNotifications,
  }: IgnoredNotifications,
  family: NotificationFamily,
): NotificationType[] => {
  let values: NotificationType[] = [];
  if (!ignoredEmailNotifications.includes(family)) {
    values = [...values, "email"];
  }
  if (!ignoredInAppNotifications.includes(family)) {
    values = [...values, "inApp"];
  }
  return values;
};

export const dataValuesToFormValues = (
  ignoredNotifications: IgnoredNotifications,
) => {
  return {
    systemMessages: ["email", "inApp"],
    applicationUpdates: getIgnoredNotificationFamilyValue(
      ignoredNotifications,
      NotificationFamily.ApplicationUpdate,
    ),
    jobAlerts: getIgnoredNotificationFamilyValue(
      ignoredNotifications,
      NotificationFamily.JobAlert,
    ),
  } satisfies FormValues;
};
