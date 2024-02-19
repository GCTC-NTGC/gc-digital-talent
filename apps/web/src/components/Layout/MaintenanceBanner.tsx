/* eslint-disable import/no-duplicates */
import React from "react";
import { useIntl } from "react-intl";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
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

  const startDate = serverMaintenanceDate
    ? formatDate({
        date: parseDateTimeUtc(serverMaintenanceDate),
        formatString: `PPPPpp`,
        intl,
      })
    : null;

  const duration = serverMaintenanceDuration || null;

  const showMaintenanceBanner =
    maintenanceBannerPublicDate && serverMaintenanceDate
      ? (isEqual(new Date(), parseDateTimeUtc(maintenanceBannerPublicDate)) ||
          isAfter(new Date(), parseDateTimeUtc(maintenanceBannerPublicDate))) &&
        isBefore(
          parseDateTimeUtc(maintenanceBannerPublicDate),
          parseDateTimeUtc(serverMaintenanceDate),
        )
      : false;

  return showMaintenanceBanner &&
    serverMaintenanceDate &&
    serverMaintenanceDuration ? (
    <div data-h2-background-color="base:all(warning.lightest)">
      <div data-h2-container="base(center, large, x1)">
        <Alert.Root
          type="warning"
          live
          banner
          data-h2-color="base:all(warning.darkest)"
          data-h2-shadow="base(none)"
          data-h2-margin="base(0, -x1, 0, -x1)"
        >
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
                  "Please note that GC Digital Talent will be unavailable for an expected period of <strong>{duration} hour(s)</strong> on <strong>{startDate}</strong>. We apologize for any inconvenience.",
                id: "2oqp21",
                description: "Description for a server maintenance banner.",
              },
              {
                duration,
                startDate,
              },
            )}
          </p>
        </Alert.Root>
      </div>
    </div>
  ) : null;
};

export default MaintenanceBanner;
