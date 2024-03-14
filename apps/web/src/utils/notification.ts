import { IntlShape, useIntl } from "react-intl";
import React from "react";

import {
  Notification,
  NotificationType,
  PoolCandidate,
  PoolCandidateStatus,
  PoolCandidateStatusChangedNotification,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocalizedName,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";

import useRoutes from "../hooks/useRoutes";

type NotificationInfo = {
  message: React.ReactNode;
  label: string;
  href: string;
};

type NotificationInfoGetterFunc<T extends Notification = Notification> = (
  notification: T,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => NotificationInfo | null;

// Not technically a union but will be once
type NotificationUnion = PoolCandidateStatusChangedNotification;

const usePoolCandidateStatusChangedInfo: NotificationInfoGetterFunc<
  PoolCandidateStatusChangedNotification
> = (notification, paths, intl) => {
  if (!notification.poolCandidateId) return null;
  const poolName = getLocalizedName(notification.poolName, intl);
  const oldStatus = intl.formatMessage(
    notification.oldStatus
      ? getPoolCandidateStatus(notification.oldStatus)
      : commonMessages.notAvailable,
  );
  const newStatus = intl.formatMessage(
    notification.newStatus
      ? getPoolCandidateStatus(notification.newStatus)
      : commonMessages.notAvailable,
  );

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "Your status has changed from <heavyPrimary>{oldStatus}</heavyPrimary> to <heavyPrimary>{newStatus}</heavyPrimary> in {poolName}.",
        id: "EUukwf",
        description: "Notification message for pool candidate status changed",
      },
      {
        oldStatus,
        newStatus,
        poolName,
      },
    ),
    href: paths.application(notification.poolCandidateId),
    label: intl.formatMessage(
      {
        defaultMessage: "Status change for {poolName}",
        id: "OvGt/x",
        description: "Label for the pool status changed notification",
      },
      { poolName },
    ),
  };
};

const notificationInfoGetters = new Map<
  NotificationType,
  NotificationInfoGetterFunc<NotificationUnion>
>([
  [
    NotificationType.PoolCandidateStatusChanged,
    usePoolCandidateStatusChangedInfo,
  ],
]);

export const useNotificationInfo = (
  notification: NotificationUnion,
): NotificationInfo | null => {
  if (!notification.type) return null;
  const intl = useIntl();
  const paths = useRoutes();
  const getter = notificationInfoGetters.get(notification.type);

  return getter?.(notification, paths, intl) ?? null;
};
