import {
  ColumnDef,
  createColumnHelper,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "urql";
import { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";

import {
  EmployeeWfaFilterInput,
  getFragment,
  graphql,
  WorkforceAdjustmentRowFragment,
} from "@gc-digital-talent/graphql";
import { Link, Ul } from "@gc-digital-talent/ui";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getEmploymentEquityGroup,
  navigationMessages,
} from "@gc-digital-talent/i18n";

import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { getFullNameHtml, getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import { getClassificationName } from "~/utils/poolUtils";
import cells from "~/components/Table/cells";
import accessors from "~/components/Table/accessors";
import pageTitles from "~/messages/pageTitles";
import profileMessages from "~/messages/profileMessages";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";

import WorkforceAdjustmentFilterDialog, {
  FormValues,
} from "./WorkforceAdjustmentFilterDialog";
import {
  transformEmployeeWFAFilterInputToFormValues,
  transformFormValuesToEmployeeWFAFilterInput,
  transformSortStateToOrderByClause,
  transformStateToWhereClause,
} from "./utils";

const WorkforceAdjustmentRow_Fragment = graphql(/** GraphQL */ `
  fragment WorkforceAdjustmentRow on UserEmployeeWFA {
    id
    firstName
    lastName
    workEmail
    classification {
      group
      level
    }
    preferredLang {
      value
      label {
        localized
      }
    }
    employeeWFA {
      wfaDate
      wfaUpdatedAt
      wfaInterest {
        value
        label {
          localized
        }
      }
    }
    department {
      name {
        localized
      }
    }
    communityInterests {
      community {
        id
        name {
          localized
        }
        workStreams {
          id
          name {
            localized
          }
        }
      }
    }
    isWoman
    hasDisability
    isVisibleMinority
    hasPriorityEntitlement
    indigenousCommunities {
      value
    }
    acceptedOperationalRequirements {
      label {
        localized
      }
    }
    locationPreferences {
      label {
        localized
      }
    }
    userSkills {
      skill {
        id
        name {
          localized
        }
      }
    }
  }
`);

const WorkforceAdjustmentTable_Query = graphql(/** GraphQL */ `
  query WorkforceAdjustmentTable(
    $where: EmployeeWfaFilterInput
    $orderBy: [QueryEmployeeWFAPaginatedAdminTableOrderByRelationOrderByClause!]
    $first: Int
    $page: Int
  ) {
    employeeWFAPaginatedAdminTable(
      where: $where
      orderBy: $orderBy
      first: $first
      page: $page
    ) {
      data {
        ...WorkforceAdjustmentRow
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`);

const columnHelper = createColumnHelper<WorkforceAdjustmentRowFragment>();

const defaultState = {
  ...INITIAL_STATE,
  sortState: [{ id: "wfaUpdatedAt", desc: false }],
  filters: {
    classifications: [],
    departments: [],
    workStreams: [],
    wfaInterests: [],
    communities: [],
    equity: undefined,
    languageAbility: undefined,
    positionDuration: undefined,
    operationalRequirements: [],
    hasPriorityEntitlement: undefined,
    workRegions: [],
    skills: [],
  },
};

const WorkforceAdjustmentTable = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: EmployeeWfaFilterInput | undefined = useMemo(
    () =>
      filtersEncoded
        ? (JSON.parse(filtersEncoded) as EmployeeWfaFilterInput)
        : undefined,
    [filtersEncoded],
  );
  const filterRef = useRef<EmployeeWfaFilterInput | undefined>(initialFilters);
  const [filterState, setFilterState] = useState<EmployeeWfaFilterInput>(
    initialFilters ?? {},
  );
  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );
  const [searchState, setSearchState] = useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "createdDate", desc: false }],
  );

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
    const transformedData = transformFormValuesToEmployeeWFAFilterInput(data);
    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  const [{ data, fetching }] = useQuery({
    query: WorkforceAdjustmentTable_Query,
    variables: {
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      where: transformStateToWhereClause(filterState, searchState),
      orderBy: sortState
        ? transformSortStateToOrderByClause(sortState)
        : undefined,
    },
  });

  const wfaEmployees = getFragment(
    WorkforceAdjustmentRow_Fragment,
    data?.employeeWFAPaginatedAdminTable.data,
  );

  const columns = [
    columnHelper.accessor(
      (user) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "name",
        header: intl.formatMessage(commonMessages.name),
        cell: ({ row: { original: user } }) => {
          return user.id ? (
            <Link href={paths.userView(user.id)}>
              {getFullNameHtml(user.firstName, user.lastName, intl)}
            </Link>
          ) : null;
        },
        enableColumnFilter: false,
        enableSorting: true,
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(
      ({ classification }) =>
        classification ? getClassificationName(classification, intl) : null,
      {
        id: "classification",
        enableColumnFilter: false,
        enableSorting: true,
        header: intl.formatMessage(
          employeeProfileMessages.currentEmployeeClassification,
        ),
      },
    ),
    columnHelper.accessor(
      ({ preferredLang }) => preferredLang?.label?.localized ?? null,
      {
        id: "preferredLang",
        enableColumnFilter: false,
        enableSorting: true,
        header: intl.formatMessage(commonMessages.workingLanguageAbility),
      },
    ),
    columnHelper.accessor(
      ({ employeeWFA }) => employeeWFA?.wfaInterest?.label.localized ?? null,
      {
        id: "wfaInterest",
        enableColumnFilter: false,
        enableSorting: true,
        header: intl.formatMessage({
          defaultMessage: "WFA situation",
          id: "JR4LU8",
          description: "Column title for employee WFA status",
        }),
      },
    ),
    columnHelper.accessor("workEmail", {
      id: "workEmail",
      enableColumnFilter: false,
      enableSorting: true,
      header: intl.formatMessage(commonMessages.workEmail),
      cell: ({ getValue }) => cells.email(getValue()),
    }),
    columnHelper.accessor(
      ({ employeeWFA }) => accessors.date(employeeWFA?.wfaUpdatedAt),
      {
        id: "wfaUpdatedAt",
        enableColumnFilter: false,
        enableSorting: true,
        header: intl.formatMessage(commonMessages.updated),
        cell: ({
          row: {
            original: { employeeWFA },
          },
        }) => cells.date(employeeWFA?.wfaUpdatedAt, intl),
      },
    ),
    columnHelper.accessor(
      ({ employeeWFA }) => accessors.date(employeeWFA?.wfaDate),
      {
        id: "wfaDate",
        enableColumnFilter: false,
        enableSorting: true,
        header: intl.formatMessage({
          defaultMessage: "Position end date",
          id: "O4dmgB",
          description:
            "Column title for when a WFA employee expects to end their position",
        }),
        cell: ({
          row: {
            original: { employeeWFA },
          },
        }) => cells.date(employeeWFA?.wfaDate, intl),
      },
    ),
    columnHelper.accessor(({ department }) => department?.name.localized, {
      id: "department",
      enableColumnFilter: false,
      header: intl.formatMessage(tableMessages.employeeDepartment),
    }),
    columnHelper.accessor(
      ({ communityInterests }) => {
        const streams = unpackMaybes(
          communityInterests?.flatMap((interest) =>
            interest.community.workStreams?.flatMap(
              (stream) => stream.name?.localized,
            ),
          ),
        );

        return uniqueItems(streams).join(", ");
      },
      {
        id: "workStreams",
        enableColumnFilter: false,
        enableSorting: false,
        header: intl.formatMessage(pageTitles.workStreams),
      },
    ),
    columnHelper.accessor(
      ({ communityInterests }) => {
        const communities = unpackMaybes(
          communityInterests?.flatMap(
            (interest) => interest.community.name?.localized,
          ),
        );

        return uniqueItems(communities).join(", ");
      },
      {
        id: "communities",
        header: intl.formatMessage(pageTitles.communities),
        cell: ({ row: { original } }) => {
          const communities = unpackMaybes(
            original.communityInterests?.flatMap(
              (interest) => interest.community.name?.localized,
            ),
          );

          return communities.length > 0 ? (
            <Ul>
              {communities.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </Ul>
          ) : null;
        },
      },
    ),
    columnHelper.accessor(
      ({
        isWoman,
        isVisibleMinority,
        hasDisability,
        indigenousCommunities,
      }) => {
        let equity: string[] = [];
        if (isWoman) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("woman")),
          ];
        }

        if (isVisibleMinority) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("minority")),
          ];
        }

        if (hasDisability) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("disability")),
          ];
        }

        if (indigenousCommunities && indigenousCommunities?.length > 0) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("indigenous")),
          ];
        }

        return equity.join(", ");
      },
      {
        id: "employmentEquity",
        enableColumnFilter: false,
        header: intl.formatMessage(commonMessages.employmentEquity),
      },
    ),
    columnHelper.accessor(
      ({ hasPriorityEntitlement }) => {
        if (typeof hasPriorityEntitlement === "undefined") {
          return null;
        }
        return hasPriorityEntitlement
          ? intl.formatMessage(commonMessages.yes)
          : intl.formatMessage(commonMessages.no);
      },
      {
        id: "hasPriorityEntitlement",
        enableColumnFilter: false,
        enableSorting: true,
        header: intl.formatMessage(profileMessages.priorityStatus),
      },
    ),
    columnHelper.accessor(
      ({ acceptedOperationalRequirements }) =>
        unpackMaybes(
          acceptedOperationalRequirements?.flatMap(
            (pref) => pref?.label.localized,
          ),
        ).join(", "),
      {
        id: "workPreferences",
        enableColumnFilter: false,
        header: intl.formatMessage(navigationMessages.workPreferences),
      },
    ),
    columnHelper.accessor(
      ({ locationPreferences }) =>
        unpackMaybes(
          locationPreferences?.flatMap((pref) => pref?.label.localized),
        ).join(", "),
      {
        id: "locationPreferences",
        enableColumnFilter: false,
        header: intl.formatMessage(profileMessages.workLocationPreferences),
      },
    ),
    columnHelper.accessor(
      ({ userSkills }) =>
        unpackMaybes(
          userSkills?.flatMap((userSkill) => userSkill?.skill.name.localized),
        ).join(", "),
      {
        id: "skills",
        enableColumnFilter: false,
        header: intl.formatMessage(navigationMessages.skills),
      },
    ),
  ] as ColumnDef<WorkforceAdjustmentRowFragment>[];

  return (
    <Table<WorkforceAdjustmentRowFragment>
      data={unpackMaybes(wfaEmployees)}
      columns={columns}
      isLoading={fetching}
      caption={intl.formatMessage({
        defaultMessage:
          "Information about employees' workforce adjustment situation",
        id: "pabyhH",
        description: "Caption for the workforce adjustment table",
      })}
      hiddenColumnIds={[
        "wfaDate",
        "department",
        "workStreams",
        "employmentEquity",
        "hasPriorityEntitlement",
        "workPreferences",
        "locationPreferences",
        "skills",
      ]}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.employeeWFAPaginatedAdminTable?.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search users",
          id: "ZatPPs",
          description: "Label for the user table search input",
        }),
        onChange: ({ term, type }: SearchState) => {
          handleSearchStateChange({ term, type });
        },
        overrideAllTableMsg: intl.formatMessage({
          defaultMessage: "Full profile",
          id: "803us1",
          description:
            "Text in table search form column dropdown when no column is selected.",
        }),
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: defaultState.sortState,
      }}
      filter={{
        state: filterRef.current,
        component: (
          <WorkforceAdjustmentFilterDialog
            onSubmit={handleFilterSubmit}
            resetValues={transformEmployeeWFAFilterInputToFormValues(
              defaultState.filters,
            )}
            initialValues={transformEmployeeWFAFilterInputToFormValues(
              initialFilters,
            )}
          />
        ),
      }}
    />
  );
};

export default WorkforceAdjustmentTable;
