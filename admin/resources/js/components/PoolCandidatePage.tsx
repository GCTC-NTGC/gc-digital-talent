import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../helpers/router";
import { PoolCandidatesTableApi } from "./poolCandidate/PoolCandidatesTable";

const messages = defineMessages({
  poolCandidateCreateHeading: {
    id: "operationalRequirementPage.poolCandidateCreateHeading",
    defaultMessage: "Create Pool Candidate",
    description: "Heading displayed above the Pool Candidate Table component.",
  },
});

export const PoolCandidatePage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <Link href="/pool-candidates/create" title="">
        {intl.formatMessage(messages.poolCandidateCreateHeading)}
      </Link>
      <PoolCandidatesTableApi />
    </div>
  );
};

export default PoolCandidatePage;
