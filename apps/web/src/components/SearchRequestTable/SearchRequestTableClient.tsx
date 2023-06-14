import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  getLocalizedName,
  getPoolCandidateSearchStatus,
} from "@gc-digital-talent/i18n";
import { Pending } from "@gc-digital-talent/ui";

import {
  PoolCandidateSearchStatus,
  Maybe,
  PoolCandidateSearchRequest,
  Scalars,
  useGetPoolCandidateSearchRequestsQuery,
} from "~/api/generated";

import useRoutes from "~/hooks/useRoutes";
import Table, {
  ColumnsOf,
  tableViewItemButtonAccessor,
  Cell,
} from "~/components/Table/ClientManagedTable";

// callbacks extracted to separate function to stabilize memoized component
const statusAccessor = (
  status: PoolCandidateSearchStatus | null | undefined,
  intl: IntlShape,
) =>
  status
    ? intl.formatMessage(getPoolCandidateSearchStatus(status as string))
    : "";

function dateCell(date: Maybe<Scalars["DateTime"]>, intl: IntlShape) {
  return date ? (
    <span>
      {formatDate({
        date: parseDateTimeUtc(date),
        formatString: "PPP p",
        intl,
      })}
    </span>
  ) : null;
}

type SearchRequestCell = Cell<PoolCandidateSearchRequest>;

interface SearchRequestTableProps {
  poolCandidateSearchRequests: Array<Maybe<PoolCandidateSearchRequest>>;
  title: string;
}

export const SearchRequestTableClient = ({
  poolCandidateSearchRequests,
  title,
}: SearchRequestTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

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
        accessor: (d) => `Action ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: searchRequest } }: SearchRequestCell) =>
          tableViewItemButtonAccessor(
            paths.searchRequestView(searchRequest.id),
            intl.formatMessage({
              defaultMessage: "request",
              id: "gLtTaW",
              description:
                "Text displayed after View text for Search Request table view action",
            }),
            searchRequest.fullName || "",
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
        accessor: ({ requestedDate }) =>
          requestedDate ? parseDateTimeUtc(requestedDate).valueOf() : null,
        Cell: ({ row: { original: searchRequest } }: SearchRequestCell) =>
          dateCell(searchRequest.requestedDate, intl),
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
    [intl, paths],
  );

  const memoizedData = useMemo(
    () => poolCandidateSearchRequests.filter(notEmpty),
    [poolCandidateSearchRequests],
  );

  return (
    <Table
      data={memoizedData}
      columns={columns}
      hiddenCols={["id", "email"]}
      title={title}
    />
  );
};

const SearchRequestTableWrapper = ({ title }: { title: string }) => {
  const [result] = useGetPoolCandidateSearchRequestsQuery();
  const { data, fetching, error } = result;

  return (
    <Pending fetching={fetching} error={error}>
      <SearchRequestTableClient
        poolCandidateSearchRequests={data?.poolCandidateSearchRequests ?? []}
        title={title}
      />
    </Pending>
  );
};

export default SearchRequestTableWrapper;
