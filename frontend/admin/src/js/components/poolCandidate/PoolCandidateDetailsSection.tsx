import {
  getJobLookingStatus,
  getPoolCandidateStatus,
} from "@common/constants/localizedConstants";
import React from "react";
import { useIntl } from "react-intl";

import { PoolCandidate } from "../../api/generated";

interface PoolCandidateDetailsSectionProps {
  candidate: Pick<
    PoolCandidate,
    "status" | "notes" | "submittedAt" | "archivedAt" | "expiryDate" | "user"
  >;
}

const PoolCandidateDetailsSection: React.FC<
  PoolCandidateDetailsSectionProps
> = ({
  candidate: { status, notes, submittedAt, archivedAt, expiryDate, user },
}) => {
  const intl = useIntl();

  // TODO: Remove this
  const candidatePriority = (priority: number | null | undefined) => {
    switch (priority) {
      case 10:
        return intl.formatMessage({
          defaultMessage: "Priority Entitlement",
          id: "j1p7LR",
          description: "Priority text for users with priority entitlement",
        });
      case 20:
        return intl.formatMessage({
          defaultMessage: "Veteran",
          id: "oU8C65",
          description: "Priority text for veterans",
        });
      case 30:
        return intl.formatMessage({
          defaultMessage: "Citizen or Resident",
          id: "oMyc4e",
          description: "Priority text for citizens of canada",
        });
      case 40:
        return intl.formatMessage({
          defaultMessage: "Work Visa",
          id: "EimWiB",
          description: "Priority text for users with work visas",
        });
      default:
        return "";
    }
  };

  return (
    <div data-h2-flex-item="base(1of1) p-tablet(3of4)">
      <div
        data-h2-background-color="base(light.dt-gray)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(s)"
      >
        <p>
          {intl.formatMessage({
            defaultMessage: "Status:",
            id: "OJbrJJ",
            description: "Status label and colon",
          })}{" "}
          <span data-h2-font-weight="base(700)">
            {status
              ? intl.formatMessage(getPoolCandidateStatus(status as string))
              : ""}
          </span>
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Priority:",
            id: "UmNhUa",
            description: "Priority label and colon",
          })}{" "}
          <span data-h2-font-weight="base(700)">
            {candidatePriority(user.priorityWeight)}
          </span>
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Availability:",
            id: "bKixM0",
            description: "Availability label and colon",
          })}{" "}
          <span data-h2-font-weight="base(700)">
            {user.jobLookingStatus
              ? intl.formatMessage(
                  getJobLookingStatus(user.jobLookingStatus as string, "short"),
                )
              : ""}
          </span>
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Notes:",
            id: "lkZ+Zt",
            description: "Notes label and colon",
          })}{" "}
          <span data-h2-font-weight="base(700)">{notes || ""}</span>
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Date Received:",
            id: "gDSeKw",
            description: "Date Received label and colon",
          })}{" "}
          <span data-h2-font-weight="base(700)">{submittedAt || ""}</span>
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Expiry Date:",
            id: "crrqFg",
            description: "Expiry Date label and colon",
          })}{" "}
          <span data-h2-font-weight="base(700)">{expiryDate || ""}</span>
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Archival Date:",
            id: "VDP17+",
            description: "Archival Date label and colon",
          })}{" "}
          <span data-h2-font-weight="base(700)">{archivedAt || ""}</span>
        </p>
      </div>
    </div>
  );
};

export default PoolCandidateDetailsSection;
