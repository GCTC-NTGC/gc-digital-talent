import React from "react";
import { useIntl } from "react-intl";
import type { IntlShape } from "react-intl";

import { FromArray } from "@common/types/utilityTypes";
import { commonMessages } from "@common/messages";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import type { Locales } from "@common/helpers/localize";
import type {
  PoolCandidateSearchStatus,
  PoolCandidateFilter,
} from "@common/api/generated";

import { notEmpty } from "@common/helpers/util";
import Table from "../Table";
import type { ColumnsOf } from "../Table";

import { useLatestRequestsQuery } from "../../api/generated";
import type { LatestRequestsQuery } from "../../api/generated";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<
  FromArray<LatestRequestsQuery["latestPoolCandidateSearchRequests"]>
>;

const LatestRequestsTable: React.FC = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const [results] = useLatestRequestsQuery();
  const { data, fetching, error } = results;

  const columns: ColumnsOf<Data> = [
    {
      Header: intl.formatMessage({
        defaultMessage: "Pool name",
        description:
          "Title displayed on the latest requests table for the pool column.",
      }),
      accessor: ({ poolCandidateFilter }) =>
        poolCandidateFilter.pools?.map(
          (pool) =>
            pool && (
              <a key={pool.id} href={paths.poolCandidateTable(pool.id)}>
                {pool.name?.[locale]}
              </a>
            ),
        ),
    },
  ];

  if (fetching) {
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  }

  if (error) {
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );
  }

  const tableData = data?.latestPoolCandidateSearchRequests.filter(notEmpty);

  return (
    <div data-h2-margin="b(bottom, m)">
      <h2
        id="latest-requests-heading"
        data-h2-font-weight="b(800)"
        data-h2-margin="b(top, m)"
      >
        {intl.formatMessage({
          defaultMessage: "Latests requests",
          description:
            "Title for the latests requests table in the admin dashboard",
        })}
      </h2>
      <Table
        labelledBy="latest-requests-heading"
        data={tableData || []}
        filter={false}
        columns={columns}
      />
    </div>
  );
};

export default LatestRequestsTable;
