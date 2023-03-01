import React from "react";
import { useIntl } from "react-intl";

import { Heading, HeadingProps, Pill } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getPoolCandidateStatusLabel } from "@gc-digital-talent/i18n";

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
  const recruitmentIsExpired = isExpired(
    application.poolAdvertisement?.closingDate,
  );
  const submittedAt = formatSubmittedAt(application.submittedAt, intl);
  const closingDate = formatClosingDate(
    application.poolAdvertisement?.closingDate,
    intl,
  );
  const status = getPoolCandidateStatusLabel(application.status);

  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-shadow="base(medium)"
      data-h2-radius="base(0px rounded rounded 0px)"
      {...border}
    >
      <div
        data-h2-padding="base(x1)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-justify-content="base(space-between)"
      >
        <div>
          <h2 data-h2-font-size="base(h5, 1.1)">
            {application.poolAdvertisement
              ? getFullPoolAdvertisementTitleHtml(
                  intl,
                  application.poolAdvertisement,
                )
              : ""}
          </h2>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x0.5)"
            data-h2-padding="base(x1, 0) l-tablet(x1, 0, 0, 0)"
          >
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
        <ApplicationActions.ContinueAction
          show={applicationIsDraft && !recruitmentIsExpired}
          application={application}
        />
        {!applicationIsDraft && status ? (
          <Pill color="secondary" mode="outline">
            {intl.formatMessage(status)}
          </Pill>
        ) : null}
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
