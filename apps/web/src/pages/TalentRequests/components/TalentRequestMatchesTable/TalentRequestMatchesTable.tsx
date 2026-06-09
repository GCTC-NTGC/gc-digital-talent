import {
  createColumnHelper,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useMemo, useRef, useState } from "react";
import { useQuery, type OperationContext } from "urql";
import type { SubmitHandler } from "react-hook-form";

import { graphql, type User } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import { fakeUsers } from "@gc-digital-talent/fake-data";

import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import useRoutes from "~/hooks/useRoutes";
import { getTableStateFromSearchParams } from "~/components/Table/ResponsiveTable/useControlledTableState";
import type { SearchState } from "~/components/Table/ResponsiveTable/types";
import useSelectedRows from "~/hooks/useSelectedRows";
import { getFullNameLabel } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";

import { locationAccessor } from "./utils";
import TalentRequestMatchesFilterDialog, {
  type FormValues,
} from "./TalentRequestMatchesFilterDialog";

interface TalentRequestResult {
  id: string;
  user: User;
  sources: "PREQUALIFIED"[];
  skillCount: number;
}

const columnHelper = createColumnHelper<TalentRequestResult>();

const TalentRequestMatchesTable_Query = graphql(/** GraphQL */ `
  query TalentRequestMatchesTable {
    ...TalentRequestMatchesFilterDialog
  }
`);

const context: Partial<OperationContext> = {
  requestPolicy: "cache-first",
};

const defaultState = {
  ...INITIAL_STATE,
  sortState: [],
  filters: {},
};

const mockUsers = fakeUsers(10);
const data = mockUsers.map((user) => ({
  id: user.id,
  user,
  sources: [],
  skillCount: user.userSkills?.length ?? 0,
}));

const TalentRequestMatchesTable = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters = useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : undefined),
    [filtersEncoded],
  );
  const filterRef = useRef(initialFilters);
  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );
  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);
  const [searchState, setSearchState] = useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "createdDate", desc: false }],
  );
  const [filterState, setFilterState] = useState(initialFilters ?? {});

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState((previous) => ({
      pageIndex:
        previous.pageSize === pageSize
          ? (pageIndex ?? INITIAL_STATE.paginationState.pageIndex)
          : 0,
      pageSize: pageSize ?? INITIAL_STATE.paginationState.pageSize,
    }));
  };

  const handleSearchStateChange = ({ term, type }: SearchState) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    setSearchState({
      term: term ?? INITIAL_STATE.searchState.term,
      type: type ?? INITIAL_STATE.searchState.type,
    });
  };

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    console.log(data);
    // setFilterState(transformedData);
    // if (!isEqual(transformedData, filterRef.current)) {
    //   filterRef.current = transformedData;
    // }
  };

  const [{ data: optionsData, fetching: fetchingOptions }] = useQuery({
    query: TalentRequestMatchesTable_Query,
    context,
  });

  const columns: ColumnDef<TalentRequestResult>[] = [
    columnHelper.accessor(
      ({ user }) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        header: intl.formatMessage(commonMessages.name),
        id: "name",
        cell: ({ row: { original: user }, getValue }) =>
          user.id ? (
            <Link href={paths.userView(user.id)}>{getValue()}</Link>
          ) : null,
        meta: { isRowTitle: true },
      },
    ),
    columnHelper.accessor("skillCount", {
      id: "skillCount",
      header: intl.formatMessage({
        defaultMessage: "Requested skills",
        id: "aNhUkJ",
        description:
          "Header for the number of user skills matching requested skills",
      }),
    }),
    columnHelper.accessor(({ sources }) => sources.join(", "), {
      id: "sources",
      header: intl.formatMessage({
        defaultMessage: "Talent source",
        id: "ZayKDK",
        description: "Heading for the source of the matching user",
      }),
      enableSorting: false,
    }),
    columnHelper.accessor(({ user }) => user.email, {
      id: "email",
      header: intl.formatMessage(commonMessages.email),
      cell: ({
        row: {
          original: { user },
        },
      }) =>
        user?.email ? (
          <Link external href={`mailto:${user.email}`}>
            {user.email}
          </Link>
        ) : null,
    }),
    columnHelper.accessor(
      ({ user }) => locationAccessor(user?.currentCity, user?.currentProvince),
      {
        id: "location",
        header: intl.formatMessage(profileMessages.currentLocation),
      },
    ),
    columnHelper.accessor(
      ({ user }) =>
        user.isGovEmployee
          ? intl.formatMessage(commonMessages.yes)
          : intl.formatMessage(commonMessages.no),
      {
        id: "isGovEmployee",
        header: intl.formatMessage(commonMessages.governmentEmployee),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ user: { department } }) => department?.name.localized,
      {
        id: "department",
        header: intl.formatMessage(
          employeeProfileMessages.currentEmployeeDepartment,
        ),
      },
    ),
  ] as ColumnDef<TalentRequestResult>[];

  return (
    <Table<TalentRequestResult>
      caption={intl.formatMessage({
        defaultMessage: "Matching candidates",
        id: "pX4FBO",
        description: "Title for users matching talent request criteria",
      })}
      data={data}
      columns={columns}
      isLoading={fetchingOptions}
      filter={{
        // eslint-disable-next-line react-hooks/refs
        state: filterRef.current,
        component: (
          <TalentRequestMatchesFilterDialog
            query={optionsData}
            onSubmit={handleFilterSubmit}
            resetValues={{}}
          />
        ),
      }}
    />
  );
};

export default TalentRequestMatchesTable;
