import React from "react";

import Pending from "@common/components/Pending";
import { notEmpty } from "@common/helpers/util";

import { useLatestRequestsQuery } from "~/api/generated";
import { SearchRequestTable } from "~/components/SearchRequestTable/SearchRequestTable";

const LatestRequestsTable: React.FC = () => {
  const [{ data, fetching, error }] = useLatestRequestsQuery();

  const poolCandidateSearchRequests =
    data?.poolCandidateSearchRequests.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SearchRequestTable
        poolCandidateSearchRequests={poolCandidateSearchRequests || []}
      />
    </Pending>
  );
};

export default LatestRequestsTable;
