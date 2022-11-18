import React from "react";

import Pending from "@common/components/Pending";

import { useLatestRequestsQuery } from "../../api/generated";
import { SearchRequestTable } from "../searchRequest/SearchRequestTable";

export const LatestRequestsTableApi: React.FC = () => {
  const [{ data, fetching, error }] = useLatestRequestsQuery();

  return (
    <Pending fetching={fetching} error={error}>
      {/* <LatestRequestsTable data={data} /> */}
      <SearchRequestTable
        poolCandidateSearchRequests={
          data?.latestPoolCandidateSearchRequests ?? []
        }
      />
    </Pending>
  );
};

export default LatestRequestsTableApi;
