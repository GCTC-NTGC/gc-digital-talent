import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";

import {
  PoolCandidateSearchRequest,
  useGetPoolCandidateSearchRequestsPaginatedQuery,
} from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import useRoutes from "~/hooks/useRoutes";

import {
  classificationAccessor,
  classificationsCell,
  notesAccessor,
  statusAccessor,
} from "./components/helpers";
import cells from "../Table/cells";
import accessors from "../Table/accessors";

const columnHelper = createColumnHelper<PoolCandidateSearchRequest>();

interface SearchRequestTableProps {
  searchRequests: Array<PoolCandidateSearchRequest>;
  title: string;
}

export const SearchRequestTable = ({
  searchRequests,
  title,
}: SearchRequestTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor("jobTitle", {
      id: "jobTitle",
      header: intl.formatMessage({
        defaultMessage: "Request job title",
        id: "6AhLsc",
        description:
          "Title displayed for the search request table request job title column.",
      }),
      cell: ({ row: { original: searchRequest }, getValue }) =>
        cells.view(paths.searchRequestView(searchRequest.id), getValue() || ""),
    }),
    columnHelper.accessor(
      (row) =>
        classificationAccessor(
          row.applicantFilter?.qualifiedClassifications?.filter(notEmpty),
        ),
      {
        id: "classifications",
        header: intl.formatMessage({
          defaultMessage: "Group and level",
          id: "y+r+ej",
          description:
            "Title displayed on the search request table group and level column.",
        }),
        cell: ({ row: { original: pool } }) =>
          classificationsCell(
            pool.applicantFilter?.qualifiedClassifications?.filter(notEmpty),
          ),
      },
    ),
    columnHelper.accessor((row) => row, {
      id: "stream",
      header: intl.formatMessage({
        defaultMessage: "Stream",
        id: "LoKxJe",
        description:
          "Title displayed on the search request table stream column.",
      }),
      cell: ({ row: { original: row } }) =>
        cells.commaList({
          list:
            row.applicantFilter?.qualifiedStreams
              ?.filter(notEmpty)
              .map((stream) => intl.formatMessage(getPoolStream(stream))) ?? [],
        }),
    }),
    columnHelper.accessor("fullName", {
      id: "manager",
      header: intl.formatMessage({
        defaultMessage: "Manager",
        id: "7FtbwK",
        description:
          "Title displayed on the search request table manager column.",
      }),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: intl.formatMessage({
        defaultMessage: "Email",
        id: "hiZAeF",
        description:
          "Title displayed on the search request table email column.",
      }),
    }),
    columnHelper.accessor(
      (row) => getLocalizedName(row.department?.name, intl, true),
      {
        id: "departments",
        header: intl.formatMessage({
          defaultMessage: "Department",
          id: "i3C5Hn",
          description:
            "Title displayed on the search request table department column.",
        }),
      },
    ),
    columnHelper.accessor("status", {
      id: "status",
      header: intl.formatMessage({
        defaultMessage: "Status",
        id: "t3sEc+",
        description:
          "Title displayed on the search request table status column.",
      }),
      cell: ({ row: { original: searchRequest } }) =>
        statusAccessor(searchRequest.status, intl),
    }),
    columnHelper.accessor(
      ({ requestedDate }) => accessors.date(requestedDate, intl),
      {
        id: "requestedDate",
        header: intl.formatMessage({
          defaultMessage: "Date Received",
          id: "r2gD/4",
          description:
            "Title displayed on the search request table requested date column.",
        }),
      },
    ),
    columnHelper.accessor("adminNotes", {
      id: "adminNotes",
      header: intl.formatMessage(adminMessages.notes),
      cell: ({ row: { original: searchRequest } }) =>
        notesAccessor(searchRequest, intl),
    }),
  ] as ColumnDef<PoolCandidateSearchRequest>[];

  const data = searchRequests.filter(notEmpty);

  return (
    <Table<PoolCandidateSearchRequest>
      data={data}
      caption={title}
      columns={columns}
      hiddenColumnIds={["id", "manager", "email", "adminNotes"]}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      search={{
        internal: true,
        label: intl.formatMessage({
          defaultMessage: "Search requests",
          id: "pnjDCS",
          description: "Label for the search request table search input",
        }),
      }}
    />
  );
};

const SearchRequestTableApi = ({ title }: { title: string }) => {
  const [result] = useGetPoolCandidateSearchRequestsPaginatedQuery();
  const { data, fetching, error } = result;

  const requestsData = data?.poolCandidateSearchRequestsPaginated?.data ?? [];
  const filteredData = requestsData.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SearchRequestTable searchRequests={filteredData || []} title={title} />
    </Pending>
  );
};

export default SearchRequestTableApi;
