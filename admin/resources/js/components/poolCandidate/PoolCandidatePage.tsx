import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../../helpers/router";
import { PoolCandidatesTableApi } from "./PoolCandidatesTable";

const messages = defineMessages({
  poolCandidateCreateHeading: {
    id: "poolCandidatePage.poolCandidateCreateHeading",
    defaultMessage: "Create Pool Candidate",
    description: "Heading displayed above the Pool Candidate Table component.",
  },
});

export const PoolCandidatePage: React.FC<{ poolId: string }> = ({ poolId }) => {
  const intl = useIntl();
  return (
    <div>
      <Link href={`/pools/${poolId}/pool-candidates/create`} title="">
        {intl.formatMessage(messages.poolCandidateCreateHeading)}
      </Link>
      <PoolCandidatesTableApi poolId={poolId} />
    </div>
  );
};

export default PoolCandidatePage;
