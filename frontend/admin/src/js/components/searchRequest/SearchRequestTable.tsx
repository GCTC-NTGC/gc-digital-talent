import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import { PoolCandidateSearchStatus } from "@common/api/generated";
import Pending from "@common/components/Pending";
import {
  GetPoolCandidateSearchRequestsQuery,
  useGetPoolCandidateSearchRequestsQuery,
} from "../../api/generated";
import Table, { ColumnsOf, tableViewItemButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<
  FromArray<GetPoolCandidateSearchRequestsQuery["poolCandidateSearchRequests"]>
>;

// callbacks extracted to separate function to stabilize memoized component
const statusAccessor = (
  status: PoolCandidateSearchStatus | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {status
      ? intl.formatMessage(getPoolCandidateSearchStatus(status as string))
      : ""}
  </span>
);

export const SearchRequestTable: React.FunctionComponent<
  GetPoolCandidateSearchRequestsQuery
> = ({ poolCandidateSearchRequests }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Action",
          id: "TDTE1c",
          description:
            "Title displayed for the search request table edit column.",
        }),
        accessor: ({ id, fullName }) =>
          tableViewItemButtonAccessor(
            paths.searchRequestView(id),
            "request",
            fullName || "",
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          id: "f24Z8p",
          description: "Title displayed on the search request table id column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Date Received",
          id: "r2gD/4",
          description:
            "Title displayed on the search request table requested date column.",
        }),
        accessor: "requestedDate",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Status",
          id: "t3sEc+",
          description:
            "Title displayed on the search request table status column.",
        }),
        accessor: ({ status }) => statusAccessor(status, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Manager",
          id: "7FtbwK",
          description:
            "Title displayed on the search request table manager column.",
        }),
        accessor: "fullName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Department",
          id: "i3C5Hn",
          description:
            "Title displayed on the search request table department column.",
        }),
        accessor: ({ department }) => department?.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          id: "hiZAeF",
          description:
            "Title displayed on the search request table email column.",
        }),
        accessor: "email",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Job Title",
          id: "8hee5d",
          description:
            "Title displayed on the search request table job title column.",
        }),
        accessor: "jobTitle",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool",
          id: "Htqzxb",
          description:
            "Title displayed on the search request table pool column.",
        }),
        accessor: ({ applicantFilter, poolCandidateFilter }) =>
          applicantFilter
            ? applicantFilter?.pools?.map(
                (pool) =>
                  pool && (
                    <a key={pool.id} href={paths.poolCandidateTable(pool.id)}>
                      {pool.name?.[locale]}
                    </a>
                  ),
              )
            : poolCandidateFilter?.pools?.map(
                (pool) =>
                  pool && (
                    <a key={pool.id} href={paths.poolCandidateTable(pool.id)}>
                      {pool.name?.[locale]}
                    </a>
                  ),
              ),
      },
    ],
    [intl, locale, paths],
  );

  const memoizedData = useMemo(
    () => poolCandidateSearchRequests.filter(notEmpty),
    [poolCandidateSearchRequests],
  );

  return <Table data={memoizedData} columns={columns} hiddenCols={["id"]} />;
};

export const SearchRequestTableApi: React.FunctionComponent = () => {
  const [result] = useGetPoolCandidateSearchRequestsQuery();
  const { data, fetching, error } = result;

  return (
    <Pending fetching={fetching} error={error}>
      <SearchRequestTable
        poolCandidateSearchRequests={data?.poolCandidateSearchRequests ?? []}
      />
    </Pending>
  );
};
