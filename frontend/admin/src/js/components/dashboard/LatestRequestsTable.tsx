import React from "react";
import { useIntl } from "react-intl";
import type { IntlShape } from "react-intl";

import { FromArray } from "@common/types/utilityTypes";
import { commonMessages } from "@common/messages";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import type { PoolCandidateSearchStatus } from "@common/api/generated";

import { notEmpty } from "@common/helpers/util";
import Table from "../Table";
import type { ColumnsOf } from "../Table";

import { useLatestRequestsQuery } from "../../api/generated";
import type { LatestRequestsQuery } from "../../api/generated";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<
  FromArray<LatestRequestsQuery["latestPoolCandidateSearchRequests"]>
>;

const hiddenText = (...chunks: string[]) => (
  <span data-h2-visibility="b(invisible)">{chunks}</span>
);

const requestActionAccessor = (
  id: string,
  path: string,
  intl: IntlShape,
  fullName?: string | null,
) => (
  <a key={id} href={path} data-h2-display="b(block)" data-h2-width="b(100)">
    {intl.formatMessage(
      {
        defaultMessage: "View request<hidden>{name}</hidden>",
        description:
          "Link text for the view action of the latests requests table on the admin portal dashboard.",
      },
      {
        name: fullName,
        hidden: hiddenText,
      },
    )}
  </a>
);

const statusAccessor = (
  status: PoolCandidateSearchStatus | null | undefined,
  intl: IntlShape,
) =>
  status
    ? intl.formatMessage(getPoolCandidateSearchStatus(status as string))
    : "";

export interface LatestRequestsTableProps {
  data?: LatestRequestsQuery;
}

const LatestRequestsTable: React.FC<LatestRequestsTableProps> = ({ data }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();

  const columns: ColumnsOf<Data> = [
    {
      Header: intl.formatMessage({
        defaultMessage: "Action",
        description:
          "Title displayed on the latest requests table for the action column.",
      }),
      width: 10,
      accessor: ({ id, fullName }) =>
        requestActionAccessor(
          id,
          paths.searchRequestUpdate(id),
          intl,
          fullName,
        ),
    },
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
    {
      Header: intl.formatMessage({
        defaultMessage: "Date received",
        description:
          "Title displayed on the latest requests table for the date column.",
      }),
      accessor: "requestedDate",
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Status",
        description:
          "Title displayed on the latest requests table status column.",
      }),
      accessor: ({ status }) => statusAccessor(status, intl),
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Manager",
        description:
          "Title displayed on the latest requests table manager column.",
      }),
      accessor: "fullName",
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Department",
        description:
          "Title displayed on the latest requests table department column.",
      }),
      accessor: ({ department }) => department?.name?.[locale],
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Email",
        description:
          "Title displayed on the latest requests table email column.",
      }),
      accessor: "email",
    },
  ];

  const tableData = data?.latestPoolCandidateSearchRequests.filter(notEmpty);

  return (
    <>
      <h2
        id="latest-requests-heading"
        data-h2-font-weight="b(800)"
        data-h2-margin="b(top-bottom, m)"
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
        pagination={false}
        columns={columns}
      />
    </>
  );
};

const LatestRequestsTableApi: React.FC = () => {
  const intl = useIntl();
  const [results] = useLatestRequestsQuery();
  const { data, fetching, error } = results;

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

  return <LatestRequestsTable data={data} />;
};

export default LatestRequestsTableApi;
export { LatestRequestsTable };
