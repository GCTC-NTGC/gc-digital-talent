import React from "react";
import { useIntl } from "react-intl";
import PageHeader from "@common/components/PageHeader";
import { ViewGridIcon } from "@heroicons/react/outline";
import DashboardContentContainer from "../DashboardContentContainer";
import PoolCandidatesTable from "./PoolCandidatesTable";

export const PoolCandidatePage: React.FC<{ poolId: string }> = ({ poolId }) => {
  const intl = useIntl();
  return (
    <DashboardContentContainer>
      <PageHeader icon={ViewGridIcon}>
        {intl.formatMessage({
          defaultMessage: "Pool Candidates",
          description:
            "Title displayed above the Pool Candidate Table component.",
        })}
      </PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This table shows a list of all applicants to this pool. Use the review button to manage an applicant.",
          description:
            "Descriptive text about the list of pool candidates in the admin portal.",
        })}
      </p>
      <PoolCandidatesTable poolId={poolId} />
    </DashboardContentContainer>
  );
};

export default PoolCandidatePage;
