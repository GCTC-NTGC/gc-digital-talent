import { NotificationFamily } from "@gc-digital-talent/graphql";

import { FormValues, UpdateNotificationInput, NotificationType } from "./types";

const inputNameToFamilyMap: Record<keyof FormValues, NotificationFamily> = {
  systemMessages: NotificationFamily.SystemMessage,
  applicationUpdates: NotificationFamily.ApplicationUpdate,
  jobAlerts: NotificationFamily.JobAlert,
};

export const formValuesToData = (values: FormValues) => {
  const data: UpdateNotificationInput = {
    enabledEmailNotifications: [],
    enabledInAppNotifications: [],
  };

  const keys = Object.keys(values) as (keyof FormValues)[];
  keys.forEach((key) => {
    const family = inputNameToFamilyMap[key];
    const enabledTypes = values[key];

    // System messages cannot be enabled
    if (family && family !== NotificationFamily.SystemMessage) {
      if (enabledTypes.includes("email")) {
        data.enabledEmailNotifications = [
          ...data.enabledEmailNotifications,
          family,
        ];
      }

      if (enabledTypes.includes("inApp")) {
        data.enabledInAppNotifications = [
          ...data.enabledInAppNotifications,
          family,
        ];
      }
    }
  });

  return data;
};

interface EnabledNotifications {
  enabledEmailNotifications: NotificationFamily[];
  enabledInAppNotifications: NotificationFamily[];
}

const getEnabledNotificationFamilyValue = (
  {
    enabledEmailNotifications,
    enabledInAppNotifications,
  }: EnabledNotifications,
  family: NotificationFamily,
): NotificationType[] => {
  let values: NotificationType[] = [];
  if (enabledEmailNotifications.includes(family)) {
    values = [...values, "email"];
  }
  if (enabledInAppNotifications.includes(family)) {
    values = [...values, "inApp"];
  }
  return values;
};

export const dataValuesToFormValues = (
  enabledNotifications: EnabledNotifications,
) => {
  return {
    systemMessages: ["email", "inApp"],
    applicationUpdates: getEnabledNotificationFamilyValue(
      enabledNotifications,
      NotificationFamily.ApplicationUpdate,
    ),
    jobAlerts: getEnabledNotificationFamilyValue(
      enabledNotifications,
      NotificationFamily.JobAlert,
    ),
  } satisfies FormValues;
};
