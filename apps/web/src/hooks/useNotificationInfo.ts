import { IntlShape, useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  ApplicationDeadlineApproachingNotification,
  NewJobPostedNotification,
  Notification,
} from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  formDateStringToDate,
  formatDate,
} from "@gc-digital-talent/date-helpers";
import { useLogger } from "@gc-digital-talent/logger";
import { GraphqlType } from "@gc-digital-talent/helpers";

import useRoutes from "./useRoutes";

type NotificationInfo = {
  message: ReactNode;
  label: string;
  href: string;
};

function isApplicationDeadlineApproachingNotification(
  notification: GraphqlType,
): notification is ApplicationDeadlineApproachingNotification {
  return (
    notification.__typename === "ApplicationDeadlineApproachingNotification"
  );
}

const applicationDeadlineApproachingNotificationToInfo = (
  notification: ApplicationDeadlineApproachingNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  const poolNameLocalized = getLocalizedName(notification.poolName, intl);
  const closingDateObject = formDateStringToDate(
    notification.closingDate ?? "1900-01-01",
  );
  const closingDateFormatted = formatDate({
    date: closingDateObject,
    formatString: "PPP",
    intl,
  });

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "{poolName} closes on {closingDate}. Continue your application.",
        id: "fAJPpJ",
        description:
          "Message for application deadline approaching notification",
      },
      {
        poolName: poolNameLocalized,
        closingDate: closingDateFormatted,
      },
    ),
    href: notification.poolCandidateId
      ? paths.application(notification.poolCandidateId)
      : "",
    label: intl.formatMessage(
      {
        defaultMessage: "{poolName} closes on {closingDate}.",
        id: "OWYrdr",
        description:
          "Label for the application deadline approaching notification",
      },
      {
        poolName: poolNameLocalized,
        closingDate: closingDateFormatted,
      },
    ),
  };
};

function isNewJobPostedNotification(
  notification: GraphqlType,
): notification is NewJobPostedNotification {
  return notification.__typename === "NewJobPostedNotification";
}

const newJobPostedNotificationToInfo = (
  notification: NewJobPostedNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  return {
    message: intl.formatMessage({
      defaultMessage:
        "A new opportunity is now available! Find out if this is a fit for you and apply.",
      id: "OlSnME",
      description: "Message for new job posted notification",
    }),
    href: notification.poolId ? paths.pool(notification.poolId) : "",
    label: intl.formatMessage({
      defaultMessage:
        "A new opportunity is now available! Find out if this is a fit for you and apply.",
      id: "Nm+j2a",
      description: "Label for the new job posted notification",
    }),
  };
};

const useNotificationInfo = (
  notification: Notification & GraphqlType,
): NotificationInfo | null => {
  const intl = useIntl();
  const paths = useRoutes();
  const logger = useLogger();

  if (isApplicationDeadlineApproachingNotification(notification)) {
    return applicationDeadlineApproachingNotificationToInfo(
      notification,
      paths,
      intl,
    );
  }

  if (isNewJobPostedNotification(notification)) {
    return newJobPostedNotificationToInfo(notification, paths, intl);
  }

  logger.warning(
    `Could not create NotificationInfo for ${notification.__typename}`,
  );
  return null;
};

export default useNotificationInfo;
