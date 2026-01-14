import { defineMessage, IntlShape, useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  ApplicationDeadlineApproachingNotification,
  ApplicationDeadlineExtendedNotification,
  ApplicationStatusChangedNotification,
  MigrateOffPlatformProcessesNotification,
  NewJobPostedNotification,
  Notification,
  SystemNotification,
  UserFileGeneratedNotification,
  UserFileGenerationErrorNotification,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_LOCALIZED,
  formDateStringToDate,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { getLogger } from "@gc-digital-talent/logger";
import { GraphqlType } from "@gc-digital-talent/helpers";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useRoutes from "./useRoutes";

interface NotificationInfo {
  message: ReactNode;
  label: string;
  href?: string;
  download?: string;
  external?: boolean;
}

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
    formatString: DATE_FORMAT_LOCALIZED,
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

function isApplicationDeadlineExtendedNotification(
  notification: GraphqlType,
): notification is ApplicationDeadlineExtendedNotification {
  return notification.__typename === "ApplicationDeadlineExtendedNotification";
}

const applicationDeadlineExtendedNotificationToInfo = (
  notification: ApplicationDeadlineExtendedNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  const poolNameLocalized = getLocalizedName(notification.poolName, intl);
  let closingDateFormatted = intl.formatMessage(commonMessages.notFound);

  if (notification.closingDate) {
    closingDateFormatted = formatDate({
      date: parseDateTimeUtc(notification.closingDate),
      formatString: DATE_FORMAT_LOCALIZED,
      intl,
    });
  }

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "The deadline for {poolName} has been extended to {closingDate}. If you're still interested, we encourage you to continue your application.",
        id: "QaB7J+",
        description: "Message for application deadline extended notification",
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
        defaultMessage:
          "The deadline for {poolName} has been extended to {closingDate}.",
        id: "ffSxnV",
        description: "Label for the application deadline extended notification",
      },
      {
        poolName: poolNameLocalized,
        closingDate: closingDateFormatted,
      },
    ),
  };
};

function isApplicationStatusChangedNotification(
  notification: GraphqlType,
): notification is ApplicationStatusChangedNotification {
  return notification.__typename === "ApplicationStatusChangedNotification";
}

const applicationStatusChangedNotificationToInfo = (
  notification: ApplicationStatusChangedNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  const poolNameLocalized = getLocalizedName(notification.poolName, intl);

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "The status of your application for {poolName} has been updated.",
        id: "FSBogI",
        description: "Message for application status changed notification",
      },
      {
        poolName: poolNameLocalized,
      },
    ),
    href: paths.profileAndApplications(),
    label: intl.formatMessage(
      {
        defaultMessage:
          "The status of your application for {poolName} has been updated.",
        id: "LHv3/N",
        description:
          "Label for the application deadline approaching notification",
      },
      {
        poolName: poolNameLocalized,
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
    href: notification.poolId ? paths.jobPoster(notification.poolId) : "",
    label: intl.formatMessage({
      defaultMessage:
        "A new opportunity is now available! Find out if this is a fit for you and apply.",
      id: "Nm+j2a",
      description: "Label for the new job posted notification",
    }),
  };
};

function isSystemNotification(
  notification: GraphqlType,
): notification is SystemNotification {
  return notification.__typename === "SystemNotification";
}

const systemNotificationToInfo = (
  notification: SystemNotification,
  intl: IntlShape,
): NotificationInfo => {
  return {
    message: getLocalizedName(notification.message, intl),
    href: getLocalizedName(notification.href, intl),
    label: getLocalizedName(notification.message, intl),
  };
};

function isUserFileGenerationErrorNotification(
  notification: GraphqlType,
): notification is UserFileGenerationErrorNotification {
  return notification.__typename === "UserFileGenerationErrorNotification";
}

const userFileGenerationErrorNotificationToInfo = (
  notification: UserFileGenerationErrorNotification,
  intl: IntlShape,
): NotificationInfo => {
  return {
    message: intl.formatMessage(errorMessages.downloadingFileFailed, {
      fileName: notification.fileName,
    }),
    label: intl.formatMessage(errorMessages.downloadingFileFailed, {
      fileName: notification.fileName,
    }),
  };
};

function isUserFileGeneratedNotification(
  notification: GraphqlType,
): notification is UserFileGeneratedNotification {
  return notification.__typename === "UserFileGeneratedNotification";
}

const fileDownloadMessage = defineMessage({
  defaultMessage: "Your file is ready for download",
  id: "+6syC7",
  description: "Notification for when q requested download is ready",
});

const userFileGeneratedNotificationToInfo = (
  notification: UserFileGeneratedNotification,
  paths: ReturnType<typeof useApiRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  return {
    message: `${intl.formatMessage(fileDownloadMessage)}${intl.formatMessage(commonMessages.dividingColon)}${notification.fileName}`,
    href: paths.userGeneratedFile(notification.fileName ?? ""),
    label: `${intl.formatMessage(fileDownloadMessage)}${intl.formatMessage(commonMessages.dividingColon)}${notification.fileName}`,
    download: notification.fileName ?? "",
    external: true,
  };
};

const migrateOffPlatformProcessesNotificationMessage = defineMessage({
  defaultMessage:
    "We’ve updated how we collect details about successful off-platform recruitment processes. Please re-enter yours using our new format to avoid losing them.",
  id: "d0T0Xq",
  description: "Notification for migrating off platform processes",
});

function isMigrateOffPlatformProcessesNotification(
  notification: GraphqlType,
): notification is MigrateOffPlatformProcessesNotification {
  return notification.__typename === "MigrateOffPlatformProcessesNotification";
}

const migrateOffPlatformProcessesNotificationToInfo = (
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  return {
    message: intl.formatMessage(migrateOffPlatformProcessesNotificationMessage),
    href: paths.applicantDashboard(),
    label: intl.formatMessage(migrateOffPlatformProcessesNotificationMessage),
  };
};

const useNotificationInfo = (
  notification: Notification & GraphqlType,
): NotificationInfo | null => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const logger = getLogger();

  if (isApplicationDeadlineApproachingNotification(notification)) {
    return applicationDeadlineApproachingNotificationToInfo(
      notification,
      paths,
      intl,
    );
  }

  if (isApplicationDeadlineExtendedNotification(notification)) {
    return applicationDeadlineExtendedNotificationToInfo(
      notification,
      paths,
      intl,
    );
  }

  if (isApplicationStatusChangedNotification(notification)) {
    return applicationStatusChangedNotificationToInfo(
      notification,
      paths,
      intl,
    );
  }

  if (isNewJobPostedNotification(notification)) {
    return newJobPostedNotificationToInfo(notification, paths, intl);
  }

  if (isUserFileGeneratedNotification(notification)) {
    return userFileGeneratedNotificationToInfo(notification, apiPaths, intl);
  }

  if (isUserFileGenerationErrorNotification(notification)) {
    return userFileGenerationErrorNotificationToInfo(notification, intl);
  }

  if (isSystemNotification(notification)) {
    return systemNotificationToInfo(notification, intl);
  }

  if (isMigrateOffPlatformProcessesNotification(notification)) {
    return migrateOffPlatformProcessesNotificationToInfo(paths, intl);
  }

  logger.warning(
    `Could not create NotificationInfo for ${notification.__typename}`,
  );
  return null;
};

export default useNotificationInfo;
