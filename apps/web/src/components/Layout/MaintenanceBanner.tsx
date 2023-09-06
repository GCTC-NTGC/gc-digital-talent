import React from "react";
import { useIntl } from "react-intl";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";

import {
  currentDate,
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import { getRuntimeVariable } from "@gc-digital-talent/env";
import { Alert } from "@gc-digital-talent/ui";

const MaintenanceBanner = () => {
  const intl = useIntl();
  // Outage time range, date, starttime
  const maintenanceBannerPublicDate = getRuntimeVariable(
    "MAINTENANCE_BANNER_PUBLIC_DATE",
  );
  const serverMaintenanceDate = getRuntimeVariable(
    "MAINTENANCE_BANNER_START_DATE",
  );
  const serverMaintenanceDuration = getRuntimeVariable(
    "MAINTENANCE_BANNER_DURATION",
  );

  console.log(serverMaintenanceDate);
  const showMaintenanceBanner =
    maintenanceBannerPublicDate && serverMaintenanceDate
      ? (isEqual(
          parseDateTimeUtc(maintenanceBannerPublicDate),
          parseDateTimeUtc(currentDate()),
        ) ||
          isAfter(
            parseDateTimeUtc(maintenanceBannerPublicDate),
            parseDateTimeUtc(currentDate()),
          )) &&
        isBefore(
          parseDateTimeUtc(maintenanceBannerPublicDate),
          parseDateTimeUtc(serverMaintenanceDate),
        )
      : false;
  return showMaintenanceBanner &&
    serverMaintenanceDate &&
    serverMaintenanceDuration ? (
    <Alert.Root type="warning" live banner>
      <Alert.Title>
        {intl.formatMessage({
          defaultMessage: "Scheduled server maintenance",
          id: "H0RLNn",
          description: "Heading for a server maintenance banner.",
        })}
      </Alert.Title>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Please note that GC Digital Talent will be unavailable for an expected period of <strong>{serverMaintenanceDuration} hour(s)</strong> on <strong>{serverMaintenanceDate}</strong>. We apologize for any inconvenience.",
            id: "3Qe99S",
            description: "Description for a server maintenance banner.",
          },
          {
            serverMaintenanceDuration,
            serverMaintenanceDate: relativeClosingDate({
              closingDate: parseDateTimeUtc(serverMaintenanceDate),
              intl,
              customFormat: `PPPPpp`,
            }),
          },
        )}
      </p>
    </Alert.Root>
  ) : null;
};

export default MaintenanceBanner;
