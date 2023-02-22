import React from "react";
import { useIntl } from "react-intl";

import { getPoolCandidateStatus } from "@gc-digital-talent/i18n";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";

import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import { type PoolCandidate, PoolCandidateStatus } from "~/api/generated";

import ApplicationActions from "./ApplicationActions";
import type {
  ArchiveActionProps,
  DeleteActionProps,
} from "./ApplicationActions";
import { canBeArchived, canBeDeleted, isDraft } from "./utils";
import { type BorderMapKey, borderKeyMap, borderMap } from "./maps";
import useMutations from "./useMutations";

export type Application = Omit<PoolCandidate, "pool" | "user">;

export interface ApplicationCardProps {
  application: Application;
  onDelete: DeleteActionProps["onDelete"];
  onArchive: ArchiveActionProps["onArchive"];
}

const ApplicationCard = ({
  application,
  onDelete,
  onArchive,
}: ApplicationCardProps) => {
  const intl = useIntl();

  const applicationIsDraft = isDraft(application.status);
  const applicationCanBeArchived = canBeArchived(
    application.status,
    application.archivedAt,
  );
  const applicationCanBeDeleted = canBeDeleted(application.status);

  let borderKey: BorderMapKey = "dt-gray";
  if (!application.archivedAt && application.status) {
    borderKey = borderKeyMap[application.status];
  }

  const border = borderMap[borderKey];

  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-shadow="base(s)"
      {...border}
    >
      <div
        data-h2-padding="base(x1)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-justify-content="base(space-between)"
      >
        <div>
          <h2 data-h2-font-size="base(h5)" data-h2-margin="base(0, 0, x0.5, 0)">
            {application.poolAdvertisement
              ? getFullPoolAdvertisementTitleHtml(
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
              onDelete={onDelete}
              show={applicationCanBeDeleted}
              application={application}
            />
            <ApplicationActions.ArchiveAction
              onArchive={onArchive}
              show={applicationCanBeArchived}
              application={application}
            />
          </div>
        </div>
        <div data-h2-text-align="l-tablet(right)">
          <div data-h2-margin="base(0, 0, x0.5, 0)">
            {applicationIsDraft && application.poolAdvertisement ? (
              <p data-h2-font-weight="base(800)" data-h2-color="base(primary)">
                {application.poolAdvertisement.closingDate
                  ? relativeClosingDate({
                      closingDate: parseDateTimeUtc(
                        application.poolAdvertisement.closingDate,
                      ),
                      intl,
                    })
                  : ""}
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

interface ApplicationCardApiProps {
  application: Application;
}

const ApplicationCardApi = ({ application }: ApplicationCardApiProps) => {
  const mutations = useMutations();

  return (
    <ApplicationCard
      application={application}
      onDelete={() => mutations.delete(application.id)}
      onArchive={() => mutations.archive(application.id)}
    />
  );
};

export const ApplicationCardComponent = ApplicationCard;
export default ApplicationCardApi;
