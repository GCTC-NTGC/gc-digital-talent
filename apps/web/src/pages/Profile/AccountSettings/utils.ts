import { NotificationFamily } from "@gc-digital-talent/graphql";

import { FormValues, UpdateNotificationInput } from "./types";

export const formValuesToData = (values: FormValues) => {
  let data: UpdateNotificationInput = {
    ignoredEmailNotifications: [],
    ignoredInAppNotifications: [],
  };

  data = values.applicationUpdates.reduce((acc, curr) => {
    switch (curr) {
      case "email":
        return {
          ...acc,
          ignoredEmailNotifications: [NotificationFamily.ApplicationUpdate],
        };
      case "inApp":
        return {
          ...acc,
          ignoredInAppNotifications: [NotificationFamily.ApplicationUpdate],
        };
      default: {
        return acc;
      }
    }
  }, data);

  data = values.jobAlerts.reduce((acc, curr) => {
    switch (curr) {
      case "email":
        return {
          ...acc,
          ignoredEmailNotifications: [
            ...acc.ignoredEmailNotifications,
            NotificationFamily.JobAlert,
          ],
        };
      case "inApp":
        return {
          ...acc,
          ignoredInAppNotifications: [
            ...acc.ignoredInAppNotifications,
            NotificationFamily.JobAlert,
          ],
        };
      default: {
        return acc;
      }
    }
  }, data);

  return data;
};

export const dataValuesToFormValues = ({
  ignoredEmailNotifications,
  ignoredInAppNotifications,
}: {
  ignoredEmailNotifications: NotificationFamily[];
  ignoredInAppNotifications: NotificationFamily[];
}) => {
  let defaultValues: FormValues = {
    systemMessages: ["email", "inApp"],
    applicationUpdates: [],
    jobAlerts: [],
  };

  defaultValues = ignoredEmailNotifications.reduce((acc, curr) => {
    switch (curr) {
      case NotificationFamily.ApplicationUpdate:
        return {
          ...acc,
          applicationUpdates: ["email"],
        };
      case NotificationFamily.JobAlert:
        return {
          ...acc,
          jobAlerts: ["email"],
        };
      default: {
        return acc;
      }
    }
  }, defaultValues);

  defaultValues = ignoredInAppNotifications.reduce((acc, curr) => {
    switch (curr) {
      case NotificationFamily.ApplicationUpdate:
        return {
          ...acc,
          applicationUpdates: acc.applicationUpdates
            ? [...acc.applicationUpdates, "inApp"]
            : ["inApp"],
        };
      case NotificationFamily.JobAlert:
        return {
          ...acc,
          jobAlerts: acc.jobAlerts ? [...acc.jobAlerts, "inApp"] : ["inApp"],
        };
      default: {
        return defaultValues;
      }
    }
  }, defaultValues);

  return defaultValues;
};
