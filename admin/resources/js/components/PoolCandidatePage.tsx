import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../helpers/router";
import { PoolCandidatesTableApi } from "./poolCandidate/PoolCandidatesTable";

const messages = defineMessages({
  poolCandidateCreateHeading: {
    id: "poolCandidatePage.poolCandidateCreateHeading",
    defaultMessage: "Create Pool Candidate",
    description: "Heading displayed above the Pool Candidate Table component.",
  },
});

interface PoolCandidatePageProps {
  poolId: string;
}

export const PoolCandidatePage: React.FC<PoolCandidatePageProps> = ({
  poolId,
}) => {
  const intl = useIntl();
  return (
    <div>
      <Link href={`/pool-candidates/${poolId}/create/`} title="">
        {intl.formatMessage(messages.poolCandidateCreateHeading)}
      </Link>
      <PoolCandidatesTableApi poolId={poolId} />
    </div>
  );
};

export default PoolCandidatePage;
