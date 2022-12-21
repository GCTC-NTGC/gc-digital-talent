import React, { useCallback, useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { getLocalizedName } from "@common/helpers/localize";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import { PoolCandidateSearchStatus } from "@common/api/generated";
import Pending from "@common/components/Pending";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { formatDate, parseDateTimeUtc } from "@common/helpers/dateUtils";
import {
  ApplicantFilter,
  Maybe,
  PoolCandidateFilter,
  PoolCandidateSearchRequest,
  useGetPoolCandidateSearchRequestsQuery,
} from "../../api/generated";
import Table, { ColumnsOf, tableViewItemButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

interface IRow {
  original: {
    poolCandidateFilter?: Maybe<PoolCandidateFilter>;
    applicantFilter?: Maybe<ApplicantFilter>;
  };
}

// callbacks extracted to separate function to stabilize memoized component
const statusAccessor = (
  status: PoolCandidateSearchStatus | null | undefined,
  intl: IntlShape,
) =>
  status
    ? intl.formatMessage(getPoolCandidateSearchStatus(status as string))
    : "";

// wrap something in a React element for rendering
const wrapInAReactElement = (
  value: string | JSX.Element[] | null | undefined,
) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{value}</>;
};

interface SearchRequestTableProps {
  poolCandidateSearchRequests: Array<Maybe<PoolCandidateSearchRequest>>;
}

export const SearchRequestTable = ({
  poolCandidateSearchRequests,
}: SearchRequestTableProps) => {
  const intl = useIntl();
  const paths = useAdminRoutes();

  const localizedTransformPoolToPosterTitle = useCallback(
    (pool: Parameters<typeof getFullPoolAdvertisementTitle>[1]) =>
      getFullPoolAdvertisementTitle(intl, pool),
    [intl],
  );

  const columns = useMemo<ColumnsOf<PoolCandidateSearchRequest>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Action",
          id: "TDTE1c",
          description:
            "Title displayed for the search request table edit column.",
        }),
        id: "action", // required when accessor is a function
        accessor: ({ id, fullName }) =>
          tableViewItemButtonAccessor(
            paths.searchRequestView(id),
            intl.formatMessage({
              defaultMessage: "request",
              id: "gLtTaW",
              description:
                "Text displayed after View text for Search Request table view action",
            }),
            fullName || "",
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool",
          id: "Htqzxb",
          description:
            "Title displayed on the search request table pool column.",
        }),
        accessor: ({ poolCandidateFilter, applicantFilter }) => {
          const pools = applicantFilter?.pools ?? poolCandidateFilter?.pools;
          return pools
            ? pools
                .filter(notEmpty)
                .map(localizedTransformPoolToPosterTitle)
                .filter(notEmpty)
                .join(", ")
            : null;
        },
        Cell: ({ row: { original } }: { row: IRow }) => {
          const pools =
            original?.applicantFilter?.pools ??
            original?.poolCandidateFilter?.pools;
          return wrapInAReactElement(
            pools?.filter(notEmpty).map(
              (pool, index) =>
                pool && (
                  <React.Fragment key={pool.id}>
                    <a href={paths.poolCandidateTable(pool.id)}>
                      {localizedTransformPoolToPosterTitle(pool)}
                    </a>
                    {index > 0 && ", "}
                  </React.Fragment>
                ),
            ),
          );
        },
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
        Cell: ({ value }) =>
          wrapInAReactElement(
            value
              ? formatDate({
                  date: parseDateTimeUtc(value),
                  formatString: "PPP p",
                  intl,
                })
              : null,
          ),
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
          defaultMessage: "Email",
          id: "hiZAeF",
          description:
            "Title displayed on the search request table email column.",
        }),
        accessor: "email",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Department",
          id: "i3C5Hn",
          description:
            "Title displayed on the search request table department column.",
        }),
        accessor: ({ department }) => getLocalizedName(department?.name, intl),
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
    ],
    [intl, paths, localizedTransformPoolToPosterTitle],
  );

  const memoizedData = useMemo(
    () => poolCandidateSearchRequests.filter(notEmpty),
    [poolCandidateSearchRequests],
  );

  return (
    <Table data={memoizedData} columns={columns} hiddenCols={["id", "email"]} />
  );
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
