import React from "react";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import { useLatestRequestsQuery } from "~/api/generated";
import { SearchRequestTable } from "~/components/SearchRequestTable/SearchRequestTable";

const LatestRequestsTable = () => {
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
