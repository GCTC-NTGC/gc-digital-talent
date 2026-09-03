import type { IntlShape } from "react-intl";
import { defineMessage, useIntl } from "react-intl";
import type { ReactNode } from "react";

import type { FragmentType, LocalizedString } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
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
import type { GraphqlType } from "@gc-digital-talent/helpers";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useRoutes from "./useRoutes";

export const UseNotificationInfo_Fragment = graphql(/* GraphQL */ `
  fragment UseNotificationInfo on Notification {
    ... on ApplicationDeadlineApproachingNotification {
      closingDate
      poolName {
        en
        fr
      }
      poolId
      poolCandidateId
    }
    ... on ApplicationDeadlineExtendedNotification {
      userName
      closingDate
      poolName {
        en
        fr
      }
      poolCandidateId
    }
    ... on ApplicationStatusChangedNotification {
      poolName {
        en
        fr
      }
    }
    ... on NewJobPostedNotification {
      poolId
      displayName {
        en
        fr
      }
    }
    ... on SystemNotification {
      message {
        en
        fr
      }
      href {
        en
        fr
      }
    }
    ... on UserFileGeneratedNotification {
      fileName
    }
    ... on UserFileGenerationErrorNotification {
      fileName
    }
  }
`);

interface NotificationInfo {
  message: ReactNode;
  label: string;
  href?: string;
  download?: string;
  external?: boolean;
}

interface DeadlineApproachingNotification {
  __typename?: "ApplicationDeadlineApproachingNotification";
  closingDate?: string | null;
  poolName?: LocalizedString | null;
  poolCandidateId?: string | null;
}

interface DeadlineExtendedNotification {
  __typename?: "ApplicationDeadlineExtendedNotification";
  closingDate?: string | null;
  poolName?: LocalizedString | null;
  poolCandidateId?: string | null;
}

interface StatusChangedNotification {
  __typename?: "ApplicationStatusChangedNotification";
  poolName?: LocalizedString | null;
}

interface JobPostedNotification {
  __typename?: "NewJobPostedNotification";
  poolId?: string | null;
  displayName?: LocalizedString | null;
}

interface PlatformNotification {
  __typename?: "SystemNotification";
  message?: LocalizedString | null;
  href?: LocalizedString | null;
}

interface FileGeneratedNotification {
  __typename?: "UserFileGeneratedNotification";
  fileName?: string | null;
}

interface FileGenerationErrorNotification {
  __typename?: "UserFileGenerationErrorNotification";
  fileName?: string | null;
}

function isApplicationDeadlineApproachingNotification(
  notification: GraphqlType,
): notification is DeadlineApproachingNotification {
  return (
    notification.__typename === "ApplicationDeadlineApproachingNotification"
  );
}

const applicationDeadlineApproachingNotificationToInfo = (
  notification: DeadlineApproachingNotification,
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
): notification is DeadlineExtendedNotification {
  return notification.__typename === "ApplicationDeadlineExtendedNotification";
}

const applicationDeadlineExtendedNotificationToInfo = (
  notification: DeadlineExtendedNotification,
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
): notification is StatusChangedNotification {
  return notification.__typename === "ApplicationStatusChangedNotification";
}

const applicationStatusChangedNotificationToInfo = (
  notification: StatusChangedNotification,
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
): notification is JobPostedNotification {
  return notification.__typename === "NewJobPostedNotification";
}

const newJobPostedNotificationToInfo = (
  notification: JobPostedNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  const displayNameLocalized = getLocalizedName(notification.displayName, intl);

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "A new opportunity is now available, {displayName}. Find out if this is a fit for you and apply.",
        id: "7KfLEe",
        description: "Message for new job posted notification",
      },
      {
        displayName: displayNameLocalized,
      },
    ),
    href: notification.poolId ? paths.jobPoster(notification.poolId) : "",
    label: intl.formatMessage(
      {
        defaultMessage:
          "A new opportunity is now available, {displayName}. Find out if this is a fit for you and apply.",
        id: "7KfLEe",
        description: "Message for new job posted notification",
      },
      {
        displayName: displayNameLocalized,
      },
    ),
  };
};

function isSystemNotification(
  notification: GraphqlType,
): notification is PlatformNotification {
  return notification.__typename === "SystemNotification";
}

const systemNotificationToInfo = (
  notification: PlatformNotification,
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
): notification is FileGenerationErrorNotification {
  return notification.__typename === "UserFileGenerationErrorNotification";
}

const userFileGenerationErrorNotificationToInfo = (
  notification: FileGenerationErrorNotification,
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
): notification is FileGeneratedNotification {
  return notification.__typename === "UserFileGeneratedNotification";
}

const fileDownloadMessage = defineMessage({
  defaultMessage: "Your file is ready for download",
  id: "+6syC7",
  description: "Notification for when q requested download is ready",
});

const userFileGeneratedNotificationToInfo = (
  notification: FileGeneratedNotification,
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

const useNotificationInfo = (
  query: FragmentType<typeof UseNotificationInfo_Fragment>,
): NotificationInfo | null => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const logger = getLogger();
  const notification = getFragment(UseNotificationInfo_Fragment, query);

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

  logger.warning(
    `Could not create NotificationInfo for ${notification.__typename}`,
  );
  return null;
};

export default useNotificationInfo;
