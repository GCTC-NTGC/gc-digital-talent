import React from "react";
import { useIntl } from "react-intl";

import { getPoolCandidateStatus } from "@common/constants/localizedConstants";
import { relativeExpiryDate } from "@common/helpers/dateUtils";

import { notEmpty } from "@common/helpers/util";
import { type PoolCandidate, PoolCandidateStatus } from "../../api/generated";
import getFullPoolAdvertisementTitle from "../pool/getFullPoolAdvertisementTitle";

import ApplicationActions from "./ApplicationActions";
import { canBeArchived, canBeDeleted, isDraft } from "./utils";
import { type BorderMapKey, borderKeyMap, borderMap } from "./maps";

export type Application = Omit<PoolCandidate, "pool" | "user">;

export interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const intl = useIntl();

  const applicationIsDraft = isDraft(application.status);
  const applicationCanBeArchived = canBeArchived(application.status);
  const applicationCanBeDeleted = canBeDeleted(application.status);

  let borderKey: BorderMapKey = "dt-gray";
  if (!application.archivedAt && application.status) {
    borderKey = borderKeyMap[application.status];
  }

  const border = borderMap[borderKey];

  return (
    <div data-h2-shadow="base(s)" {...border}>
      <div
        data-h2-padding="base(x1)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-justify-content="base(space-between)"
      >
        <div>
          <h2 data-h2-font-size="base(h5)" data-h2-margin="base(0, 0, x0.5, 0)">
            {application.poolAdvertisement
              ? getFullPoolAdvertisementTitle(
                  intl,
                  application.poolAdvertisement,
                )
              : ""}
          </h2>
          <div data-h2-display="base(flex)" data-h2-gap="base(x0.5)">
            <ApplicationActions.ContinueAction
              show={applicationIsDraft}
              application={application}
            />
            <ApplicationActions.SeeAdvertisementAction
              show={notEmpty(application.poolAdvertisement)}
              advertisement={application.poolAdvertisement}
            />
            <ApplicationActions.DeleteAction
              show={applicationCanBeDeleted}
              application={application}
            />
            <ApplicationActions.ArchiveAction
              show={applicationCanBeArchived}
              application={application}
            />
          </div>
        </div>
        <div data-h2-text-align="l-tablet(right)">
          <div data-h2-margin="base(0, 0, x0.5, 0)">
            {applicationIsDraft && application.poolAdvertisement ? (
              <p
                data-h2-font-weight="base(800)"
                data-h2-color="base(dt-primary)"
              >
                {relativeExpiryDate(
                  new Date(application.poolAdvertisement.expiryDate),
                  intl,
                )}
              </p>
            ) : (
              <p>
                {intl.formatMessage(
                  getPoolCandidateStatus(
                    application?.status || PoolCandidateStatus.NewApplication,
                  ),
                )}
              </p>
            )}
          </div>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "ID: {id}",
                id: "hEXXG0",
                description: "Label for application ID",
              },
              {
                id: application.id,
              },
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
