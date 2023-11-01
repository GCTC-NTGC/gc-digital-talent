import React, { useState } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";
import {
  InputMaybe,
  PoolCandidateSearchRequestInput,
} from "@gc-digital-talent/graphql";

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
import { SearchState } from "../Table/ResponsiveTable/types";
import { INITIAL_STATE } from "../Table/ResponsiveTable/constants";

const columnHelper = createColumnHelper<PoolCandidateSearchRequest>();

interface SearchRequestTableProps {
  title: string;
}

const defaultState = {
  pageSize: 10,
  currentPage: 1,
  searchState: {
    term: "",
    type: "",
  },
  hiddenColumnIds: [],
  sortBy: undefined,
  filters: {},
};

const searchRequestInput = (
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): InputMaybe<PoolCandidateSearchRequestInput> => {
  if (searchBarTerm === undefined && searchType === undefined) {
    return null;
  }

  return {
    // search bar
    generalSearch: !!searchBarTerm && !searchType ? searchBarTerm : undefined,
    id: searchType === "id" && !!searchBarTerm ? searchBarTerm : undefined,
    fullName:
      searchType === "fullName" && !!searchBarTerm ? searchBarTerm : undefined,
    email:
      searchType === "email" && !!searchBarTerm ? searchBarTerm : undefined,
    jobTitle:
      searchType === "jobTitle" && !!searchBarTerm ? searchBarTerm : undefined,
    additionalComments:
      searchType === "additionalComments" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
    adminNotes:
      searchType === "adminNotes" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
  };
};

const SearchRequestTable = ({ title }: SearchRequestTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchState, setSearchState] = useState<SearchState>(
    INITIAL_STATE.searchState,
  );
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
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
      // meta: {
      //   searchHeader: intl.formatMessage({
      //     defaultMessage: "Job title",
      //     id: "nkVG29",
      //     description:
      //       "Title displayed for the search request table request job title column.",
      //   }),
      // },
      // why is this different?
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
        enableColumnFilter: false,
        cell: ({ row: { original: pool } }) =>
          classificationsCell(
            pool.applicantFilter?.qualifiedClassifications?.filter(notEmpty),
          ),
      },
    ),
    columnHelper.accessor(
      (row) =>
        row.applicantFilter?.qualifiedStreams
          ?.filter(notEmpty)
          .map((stream) => intl.formatMessage(getPoolStream(stream)))
          .join(","),
      {
        id: "stream",
        header: intl.formatMessage({
          defaultMessage: "Stream",
          id: "LoKxJe",
          description:
            "Title displayed on the search request table stream column.",
        }),
        enableColumnFilter: false,
        cell: ({ row: { original: row } }) =>
          cells.commaList({
            list:
              row.applicantFilter?.qualifiedStreams
                ?.filter(notEmpty)
                .map((stream) => intl.formatMessage(getPoolStream(stream))) ??
              [],
          }),
      },
    ),
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
        enableColumnFilter: false,
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
      enableColumnFilter: false,
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
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor("adminNotes", {
      id: "adminNotes",
      header: intl.formatMessage(adminMessages.notes),
      cell: ({ row: { original: searchRequest } }) =>
        notesAccessor(searchRequest, intl),
    }),
  ] as ColumnDef<PoolCandidateSearchRequest>[];

  const handleSearchStateChange = ({
    term,
    type,
  }: {
    term: string | undefined;
    type: string | undefined;
  }) => {
    setSearchState({
      term: term ?? defaultState.searchState.term,
      type: type ?? defaultState.searchState.type,
    });
  };

  const [{ data, fetching }] = useGetPoolCandidateSearchRequestsPaginatedQuery({
    variables: {
      where: searchRequestInput(searchState?.term, searchState?.type),
    },
  });

  const requestData =
    data?.poolCandidateSearchRequestsPaginated?.data.filter(notEmpty) ?? [];

  return (
    <Table<PoolCandidateSearchRequest>
      data={requestData}
      caption={title}
      columns={columns}
      hiddenColumnIds={["id", "manager", "email", "adminNotes"]}
      isLoading={fetching}
      sort={{
        internal: false,
      }}
      pagination={{
        internal: false,
        total: requestData.length,
        pageSizes: [10, 20, 50],
      }}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search requests",
          id: "pnjDCS",
          description: "Label for the search request table search input",
        }),
        onChange: ({ term, type }: SearchState) => {
          handleSearchStateChange({ term, type });
        },
      }}
    />
  );
};

export default SearchRequestTable;
