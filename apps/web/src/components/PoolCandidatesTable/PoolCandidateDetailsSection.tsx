import React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import {
  getJobLookingStatus,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";

import { PoolCandidate } from "~/api/generated";

interface PoolCandidateDetailsSectionProps {
  candidate: Pick<
    PoolCandidate,
    "status" | "notes" | "submittedAt" | "archivedAt" | "expiryDate" | "user"
  >;
}

const PoolCandidateDetailsSection = ({
  candidate: { status, notes, submittedAt, archivedAt, expiryDate, user },
}: PoolCandidateDetailsSectionProps) => {
  const intl = useIntl();

  return (
    <div data-h2-flex-item="base(1of1) p-tablet(3of4)">
      <Well>
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
            {user.priorityWeight
              ? intl.formatMessage(
                  getPoolCandidatePriorities(user.priorityWeight),
                )
              : ""}
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
      </Well>
    </div>
  );
};

export default PoolCandidateDetailsSection;
