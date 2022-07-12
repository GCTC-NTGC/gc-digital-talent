import React from "react";
import { useIntl } from "react-intl";
import type { IntlShape } from "react-intl";

import { FromArray } from "@common/types/utilityTypes";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import type { PoolCandidateSearchStatus } from "@common/api/generated";

import { notEmpty } from "@common/helpers/util";
import Pending from "@common/components/Pending";
import Heading from "@common/components/Heading";
import Table from "../Table";
import type { ColumnsOf } from "../Table";

import {
  ApplicantFilter,
  LocalizedString,
  Maybe,
  PoolCandidateFilter,
  useLatestRequestsQuery,
} from "../../api/generated";
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

interface IRow {
  original: {
    poolCandidateFilter?: PoolCandidateFilter;
    applicantFilter?: ApplicantFilter;
  };
}

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
      accessor: ({ poolCandidateFilter, applicantFilter }) => {
        const pools = applicantFilter?.pools ?? poolCandidateFilter?.pools;
        return pools
          ? pools
              .filter(notEmpty)
              .map(
                (pool: { name?: Maybe<LocalizedString> }) =>
                  pool?.name?.[locale],
              )
              .filter(notEmpty)
              .join(", ")
          : null;
      },
      Cell: ({ row: { original } }: { row: IRow }) => {
        const pools =
          original?.applicantFilter?.pools ??
          original?.poolCandidateFilter?.pools;
        return pools?.map(
          (pool, index) =>
            pool && (
              <>
                <a key={pool.id} href={paths.poolCandidateTable(pool.id)}>
                  {pool.name?.[locale]}
                </a>
                {index > 0 && ", "}
              </>
            ),
        );
      },
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
      <Heading
        id="latest-requests-heading"
        level="h2"
        data-h2-margin="b(top-bottom, m)"
      >
        {intl.formatMessage({
          defaultMessage: "Latests requests",
          description:
            "Title for the latests requests table in the admin dashboard",
        })}
      </Heading>
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
  const [{ data, fetching, error }] = useLatestRequestsQuery();

  return (
    <Pending fetching={fetching} error={error}>
      <LatestRequestsTable data={data} />
    </Pending>
  );
};

export default LatestRequestsTableApi;
export { LatestRequestsTable };
