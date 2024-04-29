import { IntlShape, useIntl } from "react-intl";
import React from "react";

import {
  ApplicationDeadlineApproachingNotification,
  Notification,
  PoolCandidateStatusChangedNotification,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocalizedName,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import { useLogger } from "@gc-digital-talent/logger";
import { GraphqlType } from "@gc-digital-talent/helpers";

import useRoutes from "./useRoutes";

type NotificationInfo = {
  message: React.ReactNode;
  label: string;
  href: string;
};

function isPoolCandidateStatusChangedNotification(
  notification: GraphqlType,
): notification is PoolCandidateStatusChangedNotification {
  return (
    // eslint-disable-next-line no-underscore-dangle
    notification.__typename === "PoolCandidateStatusChangedNotification"
  );
}

const poolCandidateStatusChangedNotificationToInfo = (
  notification: PoolCandidateStatusChangedNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo | null => {
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

function isApplicationDeadlineApproachingNotification(
  notification: GraphqlType,
): notification is ApplicationDeadlineApproachingNotification {
  return (
    // eslint-disable-next-line no-underscore-dangle
    notification.__typename === "ApplicationDeadlineApproachingNotification"
  );
}

const applicationDeadlineApproachingNotificationToInfo = (
  notification: ApplicationDeadlineApproachingNotification,
  intl: IntlShape,
): NotificationInfo => {
  const poolName = getLocalizedName(notification.poolName, intl);
  const closingDateObject = parseDateTimeUtc(
    notification.closingDate ?? "1900-01-01",
  );
  const closingDate = relativeClosingDate({
    closingDate: closingDateObject,
    intl,
  });
  const applicationLink = getLocalizedName(notification.applicationLink, intl);

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "{poolName} closes on {closingDate}. Continue your application.",
        id: "nVRb8r",
        description: "Notification message for pool candidate status changed",
      },
      {
        poolName,
        closingDate,
      },
    ),
    href: applicationLink,
    label: intl.formatMessage(
      {
        defaultMessage: "Application deadline approaching for {poolName}",
        id: "K1yDdz",
        description: "Label for the pool status changed notification",
      },
      { poolName },
    ),
  };
};

const useNotificationInfo = (
  notification: Notification & GraphqlType,
): NotificationInfo | null => {
  const intl = useIntl();
  const paths = useRoutes();
  const logger = useLogger();

  if (isPoolCandidateStatusChangedNotification(notification)) {
    return poolCandidateStatusChangedNotificationToInfo(
      notification,
      paths,
      intl,
    );
  }

  if (isApplicationDeadlineApproachingNotification(notification)) {
    return applicationDeadlineApproachingNotificationToInfo(notification, intl);
  }

  logger.warning(
    // eslint-disable-next-line no-underscore-dangle
    `Could not create NotificationInfo for ${notification.__typename}`,
  );
  return null;
};

export default useNotificationInfo;
